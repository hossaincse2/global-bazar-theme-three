'use client';

import { ProductContext } from '@/_context/cartContext';
import useDictionary from '@/_hooks/useDictionary';
import useOrderId from '@/_hooks/useOrderId';
import useSiteSetting from '@/_hooks/useSiteSetting';
import { getCoupon } from '@/_utils/getCoupon';
import { getPaymentMethod } from '@/_utils/getPaymentMethod';
import { orderPost } from '@/_utils/orderPost';
import { saveIncompleteOrder } from '@/_utils/saveIncompleteOrder';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useMemo, useState } from 'react';
import { formatPrice } from '@/_utils/formatNumber';
import { FiCheck, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

const CheckoutContent = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(ProductContext);
  const { dictionary } = useDictionary();
  const { siteSetting } = useSiteSetting();
  const { setOrderId } = useOrderId();
  const { cartItems, cartTotal } = state;

  const [mounted, setMounted] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('inside_dhaka');
  const [shippingCost, setShippingCost] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    note: '',
  });

  // Shipping costs from site settings
  const insideDhaka = siteSetting?.inside_dhaka ? Number(siteSetting.inside_dhaka) : 60;
  const outsideDhaka = siteSetting?.outside_dhaka ? Number(siteSetting.outside_dhaka) : 120;
  const dhakaSub = siteSetting?.dhaka_sub_area ? Number(siteSetting.dhaka_sub_area) : 80;
  const currency = siteSetting?.currency_icon || siteSetting?.currency || '৳';

  const checkoutTexts = dictionary?.Checkout || {};

  useEffect(() => { setMounted(true); }, []);

  // Fetch payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const data = await getPaymentMethod();
        setPaymentMethods(data.data || []);
        if (data.data?.length > 0) {
          setSelectedPayment(data.data[0].slug);
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    };
    fetchPaymentMethods();
  }, []);

  // Update shipping cost based on location
  useEffect(() => {
    let cost = insideDhaka;
    if (selectedLocation === 'outside_dhaka') cost = outsideDhaka;
    else if (selectedLocation === 'dhaka_sub_area') cost = dhakaSub;
    setShippingCost(cost);
  }, [selectedLocation]);

  // Calculate subtotal after discount
  const subTotal = useMemo(() => cartTotal - discountValue, [cartTotal, discountValue]);
  const total = useMemo(() => subTotal + shippingCost, [subTotal, shippingCost]);

  // Ordered products for API
  const orderedProducts = useMemo(() =>
    cartItems.map((item) => ({
      product_name: item.name,
      product_id: item.id,
      quantity: item.quantity,
      price: item.sale_price > 0 ? item.sale_price : item.unit_price,
      product_variant_id: item.variant_id || null,
      total: item.quantity * (item.sale_price > 0 ? item.sale_price : item.unit_price),
    })), [cartItems]
  );

  const totalQuantity = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);

  // Cart handlers
  const handleRemove = (id, variant_id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id, variant_id } });
  };

  const handleIncrement = (id, variant_id) => {
    dispatch({ type: 'INCREMENT_QUANTITY', payload: { id, variant_id } });
  };

  const handleDecrement = (id, variant_id) => {
    dispatch({ type: 'DECREMENT_QUANTITY', payload: { id, variant_id } });
  };

  // Coupon handler
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    if (couponApplied) {
      toast.error('Coupon already applied');
      return;
    }

    try {
      const data = await getCoupon(couponCode);
      if (data.success) {
        const { type, discount } = data.data;
        let discountAmount = 0;
        if (type === 'Flat') {
          discountAmount = discount;
        } else if (type === 'Percentage') {
          discountAmount = cartTotal * (discount / 100);
        }
        setDiscountValue(discountAmount);
        setCouponApplied(true);
        toast.success(checkoutTexts.couponApplied || 'Coupon applied successfully!');
      } else {
        toast.error(data.message || checkoutTexts.invalidCoupon || 'Invalid coupon code');
      }
    } catch (error) {
      toast.error('Error applying coupon');
    }
  };

  // Form validation
  const validateForm = (data) => {
    const errors = {};
    if (!data.name?.trim()) errors.name = 'Name is required';
    if (!data.phone?.trim()) errors.phone = 'Phone is required';
    else if (data.phone.length !== 11) errors.phone = 'Phone must be 11 digits';
    if (!data.address?.trim()) errors.address = 'Address is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveDraft = async (currentData) => {
    const dataToSave = currentData || formData;
    if (dataToSave.phone && dataToSave.phone.length === 11) {
      const draftData = {
        phone: dataToSave.phone,
        additional_data: {
          name: dataToSave.name,
          email: dataToSave.email,
          address: dataToSave.address,
          delivery_area: selectedLocation,
          product_info: orderedProducts.map(p => ({
            product_id: p.product_id,
            quantity: p.quantity,
            price: p.price
          }))
        }
      };
      await saveIncompleteOrder(draftData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);

    if (name === 'phone' && value.length === 11) {
      handleSaveDraft(newData);
    }
  };

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (!validateForm(data)) return;

    const orderData = {
      name: data.name,
      phone: data.phone,
      email: data.email || '',
      address: data.address,
      note: data.note || '',
      products: orderedProducts,
      delivery_fee: shippingCost,
      total_quantity: totalQuantity,
      total_amount: total,
      delivery_location: selectedLocation,
      payment_method: selectedPayment,
      currency: 'bdt',
      discount_amount: discountValue,
      sub_total: subTotal,
    };

    if (discountValue > 0) {
      orderData.coupon_code = couponCode;
      orderData.coupon_discount_amount = discountValue;
    }

    try {
      setOrderLoading(true);
      const response = await orderPost(JSON.stringify(orderData));

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          setOrderId(responseData.order_number);
          toast.success(checkoutTexts.orderPlaced || 'Order placed successfully!');
          dispatch({ type: 'CLEAR_CART' });
          router.push('/order-success');
        } else {
          toast.error(responseData.message || checkoutTexts.orderFailed || 'Order failed');
        }
      } else {
        toast.error(checkoutTexts.orderFailed || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Error placing order');
    } finally {
      setOrderLoading(false);
    }
  };

  if (!mounted) return null;

  if (cartItems.length === 0) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">{checkoutTexts.cartEmpty || 'Your cart is empty'}</h2>
        <a href="/collections" className="text-primary-600 hover:underline">{dictionary?.Cart?.continueShopping || 'Continue Shopping'}</a>
      </div>
    );
  }


  return (
    <div className="py-8">
      <div className="container">
        <h1 className="text-2xl md:text-3xl font-bold text-dark-900 mb-8">{checkoutTexts.formTitle || 'Checkout'}</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-7">
              {/* Customer Information */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-dark-900 mb-4">{checkoutTexts.customerInfo || 'Customer Information'}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{checkoutTexts.Form?.name || 'Full Name'} *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={() => handleSaveDraft()}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${validationErrors.name ? 'border-red-500' : 'border-gray-300'}`} 
                    />
                    {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{checkoutTexts.Form?.phone || 'Phone'} *</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={() => handleSaveDraft()}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'}`} 
                      />
                      {validationErrors.phone && <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{checkoutTexts.Form?.email || 'Email'}</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleSaveDraft()}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{checkoutTexts.Form?.address || 'Address'} *</label>
                    <textarea 
                      name="address" 
                      rows="3" 
                      value={formData.address}
                      onChange={handleInputChange}
                      onBlur={() => handleSaveDraft()}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${validationErrors.address ? 'border-red-500' : 'border-gray-300'}`} 
                    />
                    {validationErrors.address && <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{checkoutTexts.Form?.note || 'Order Note'}</label>
                    <textarea 
                      name="note" 
                      rows="2" 
                      value={formData.note}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                      placeholder="Any special instructions..." 
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Location */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-dark-900 mb-4">{checkoutTexts.Form?.deliveryLocation || 'Delivery Location'}</h2>
                <div className="space-y-3">
                  {[
                    { value: 'inside_dhaka', label: checkoutTexts.Form?.insideDhaka || 'Inside Dhaka', cost: insideDhaka },
                    { value: 'dhaka_sub_area', label: checkoutTexts.Form?.dhakaSub || 'Dhaka Sub Area', cost: dhakaSub },
                    { value: 'outside_dhaka', label: checkoutTexts.Form?.outsideDhaka || 'Outside Dhaka', cost: outsideDhaka },
                  ].map((option) => (
                    <label key={option.value} className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${selectedLocation === option.value ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="delivery_location" value={option.value} checked={selectedLocation === option.value} onChange={(e) => setSelectedLocation(e.target.value)} className="w-5 h-5 text-primary-600" />
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <span className="font-semibold">{currency}{formatPrice(option.cost)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-dark-900 mb-4">{checkoutTexts.paymentTitle || 'Payment Method'}</h2>
                <div className="space-y-3">
                  {paymentMethods.length > 0 ? paymentMethods.map((method) => (
                    <label key={method.slug} className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${selectedPayment === method.slug ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="payment_method" value={method.slug} checked={selectedPayment === method.slug} onChange={(e) => setSelectedPayment(e.target.value)} className="w-5 h-5 text-primary-600" />
                      {method.logo && <Image src={method.logo} alt={method.name} width={40} height={24} className="object-contain" />}
                      <span className="font-medium">{method.name}</span>
                    </label>
                  )) : (
                    <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer border-primary-600 bg-primary-50`}>
                      <input type="radio" name="payment_method" value="cod" checked className="w-5 h-5 text-primary-600" />
                      <span className="font-medium">Cash on Delivery</span>
                    </label>
                  )}
                </div>
              </div>
            </div>


            {/* Right Column - Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-dark-900 mb-4">{checkoutTexts.orderTitle || 'Order Summary'}</h2>

                {/* Cart Items */}
                <div className="space-y-4 max-h-[350px] overflow-y-auto mb-4 pr-2 custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.variant_id || ''}`} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-50">
                        <Image src={item.preview_image || item.image || '/images/no-available.svg'} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 line-clamp-2 mb-1">{item.name}</p>
                        {item.attributes && Object.keys(item.attributes).length > 0 && (
                          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">{Object.values(item.attributes).join(' / ')}</p>
                        )}
                        <p className="text-sm font-black text-primary-600">{currency}{formatPrice(item.sale_price > 0 ? item.sale_price : item.unit_price)}</p>
                        <div className="flex items-center justify-between gap-2 mt-3">
                          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                            <button type="button" onClick={() => handleDecrement(item.id, item.variant_id)} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all"><FiMinus className="text-xs text-gray-600" /></button>
                            <span className="w-8 text-center text-xs font-bold text-gray-800">{item.quantity}</span>
                            <button type="button" onClick={() => handleIncrement(item.id, item.variant_id)} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all"><FiPlus className="text-xs text-gray-600" /></button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemove(item.id, item.variant_id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Remove item"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="flex gap-2 mb-4">
                  <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder={checkoutTexts.dicCouponProvide || 'Enter coupon code'} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" disabled={couponApplied} />
                  <button type="button" onClick={handleApplyCoupon} disabled={couponApplied} className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400">{checkoutTexts.apply || 'Apply'}</button>
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-gray-700">
                    <span>{checkoutTexts.dicSubTotal || 'Subtotal'}</span>
                    <span>{currency}{formatPrice(cartTotal)}</span>
                  </div>
                  {discountValue > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>{checkoutTexts.discount || 'Discount'}</span>
                      <span>-{currency}{formatPrice(discountValue)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-700">
                    <span>{checkoutTexts.dicDeliveryFee || 'Delivery Fee'}</span>
                    <span>{currency}{formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-dark-900 pt-3 border-t">
                    <span>{checkoutTexts.dicTotal || 'Total'}</span>
                    <span>{currency}{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={orderLoading} className="w-full mt-6 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:bg-gray-400">
                  {orderLoading ? (
                    <><span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> {checkoutTexts.dicConfirmProcessing || 'Processing...'}</>
                  ) : (
                    <><FiCheck /> {checkoutTexts.dicConfirm || 'Confirm Order'}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutContent;
