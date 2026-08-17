'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/_components/ui/table';

import Input from '@/_components/form/Input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';

import useAdManager from '@/_hooks/useAdManager';
import useAuth from '@/_hooks/useAuth';
import useDictionary from '@/_hooks/useDictionary';
import usePos from '@/_hooks/usePos';
import { getSiteSettings } from '@/_utils/getSiteSettings';
import { getPosPaymentMethod } from '@/_utils/pos/getPosPaymentMethod';
import { getPosUser } from '@/_utils/pos/getPosUser';
import { useEffect, useState } from 'react';
import { BiSolidEdit } from 'react-icons/bi';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { IoCartOutline } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { formatBanglaNumber } from '@/_utils/formatNumber';
import { trackEvent } from '@/_utils/facebookPixel';
import { getCoupon } from '@/_utils/getCoupon';
import { salePost } from '@/_utils/pos/salePost';
import CouponModal from './modal/CouponModal';
import NoteModal from './modal/NoteModal';
import RecentSaleModal from './modal/RecentSaleModal';
import ShippingModal from './modal/ShippingModal';

const BillTable = ({
  customervalue,
  setCustomerValue,
  warehousevalue,
  setWarehouseValue,
  refetchProducts,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVatOpen, setIsVatOpen] = useState(false);
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [vatPercent, setVatPercent] = useState(0);
  const [storeVatPercent, setStoreVatPercent] = useState(0);
  const [totalVat, setTotalVat] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponAmount, setCouponAmount] = useState(0);
  const [shippingAmount, setShippingAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [couponValue, setCouponValue] = useState(0);
  const [shipping, setShipping] = useState('');
  const [note, setNote] = useState('');
  const [cash, setCash] = useState(0);
  const [bkash, setBkash] = useState(0);
  const [card, setCard] = useState(0);
  const [due, setDue] = useState(0);
  const [partial, setPartial] = useState(0);
  const [user, setUser] = useState(null);
  const [siteSetting, setSiteSetting] = useState([]);

  const { authToken } = useAuth();
  // Separate isOpen states for each field
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isCashOpen, setIsCashOpen] = useState(false);
  const [isBkashOpen, setIsBkashOpen] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isDueOpen, setIsDueOpen] = useState(false);
  const [isPartialOpen, setIsPartialOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [discountType, setDiscountType] = useState('flat');
  const [subTotal, setSubtotal] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [bkashNumber, setBkashNumber] = useState(null);
  const [cardNumber, setCardNumber] = useState(null);
  const [discountValue, setDiscountValue] = useState(0);
  const [couponApply, setCouponApply] = useState(true);
  const [invoice, setInvoice] = useState('');
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const { language, dictionary } = useDictionary();
  const { adManager } = useAdManager();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactionId, setTransactionId] = useState('');

  const { state, dispatch } = usePos();
  const { posCartItems, cartTotal } = state;

  useEffect(() => {
    const fetchSiteSettings = async () => {
      const settings = await getSiteSettings(language);
      setStoreVatPercent(settings.data.vat);
      setVatPercent(settings.data.vat);
      setSiteSetting(settings.data);
    };

    fetchSiteSettings();
  }, [language]);

  const couponChange = (event) => {
    setCouponCode(event.target.value);
  };

  // useEffect(() => {
  //   if (authToken) {
  //     const fetchPaymentMethods = async () => {
  //       try {
  //         const paymentMethodData = await getPosPaymentMethod(authToken);
  //         setPaymentMethods(paymentMethodData.data);

  //         // Data fetch হওয়ার পরে first item select করুন
  //         if (paymentMethodData.data && paymentMethodData.data.length > 0) {
  //           setSelectedMethod(paymentMethodData.data[0].name);
  //         }

  //         console.log(selectedMethod);
  //       } catch (error) {
  //         console.error('Failed to fetch payment methods:', error);
  //       }
  //     };
  //     fetchPaymentMethods();
  //   }
  // }, [authToken]);

  // Manual Due and Partial methods
  const manualMethods = [
    {
      id: 'due',
      name: 'Due',
      sort_order: 100,
    },
    // {
    //   id: 'partial',
    //   name: 'Partial',
    //   sort_order: 101,
    // },
  ];

  useEffect(() => {
    if (authToken) {
      const fetchPaymentMethods = async () => {
        try {
          const paymentMethodData = await getPosPaymentMethod(authToken);
          const apiMethods = paymentMethodData.data || [];

          // Filter out Due and Partial from API data (if they exist)
          const filteredApiMethods = apiMethods.filter(
            (method) =>
              !['Due', 'Partial', 'due', 'partial'].includes(method.name)
          );

          // Combine API methods with manual methods
          const combinedMethods = [...filteredApiMethods, ...manualMethods];

          // Sort by sort_order
          const sortedMethods = combinedMethods.sort(
            (a, b) => a.sort_order - b.sort_order
          );

          setPaymentMethods(sortedMethods);

          // Set first method as selected initially
          if (sortedMethods.length > 0) {
            setSelectedMethod(sortedMethods[0].name);
          }
        } catch (error) {
          // If API fails, use only manual methods
          console.error('Failed to fetch payment methods:', error);
          setPaymentMethods(manualMethods);
          setSelectedMethod(manualMethods[0].name);
        }
      };
      fetchPaymentMethods();
    }
  }, [authToken]);

  // const extendedPaymentMethod = [...paymentMethods, {id: }]

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getPosUser(authToken);
        setUser(userData.data);
      } catch (error) {
        console.error('Failed to fetch pos user:', error);
      }
    };

    if (authToken) {
      fetchUser();
    }
  }, [authToken]);

  // setSubtotal(cartTotal);
  useEffect(() => {
    setSubtotal(cartTotal - discountValue);
  }, [cartTotal, discountValue]);

  const handleApply = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData(event.target);
      const coupon = data.get('coupon');
      // setShipping(value);
      setIsCouponOpen(false);

      if (coupon === '') {
        toast.error(`কুপন কোড দিন`, {
          position: 'bottom-right',
        });
      }

      let couponData = await getCoupon(coupon);
      if (couponData.success && coupon) {
        if (!couponApply) {
          toast.error(`আপনি কুপন ব্যবহার করে ফেলেছেন`, {
            position: 'bottom-right',
          });
        }
        const { type, discount } = couponData.data;

        if (type === 'Flat' && couponApply) {
          setSubtotal(subTotal - discount);
          setDiscountValue(discount);
          setCouponApply(false);
          toast.success(`"কুপন সফল হয়েছে"`, {
            position: 'bottom-right',
          });
        }

        if (type === 'Percentage' && couponApply) {
          const discountAmount = subTotal * (discount / 100);
          setSubtotal(subTotal - discountAmount);
          setDiscountValue(discountAmount);
          setCouponApply(false);
          toast.success(`"কুপন সফল হয়েছে"`, {
            position: 'bottom-right',
          });
        }
      } else {
        if (couponCode) {
          toast.error(`"কুপন সফল হয়নি"`, {
            position: 'bottom-right',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching coupon:', error);
    }
  };

  // Handle payment method selection
  const handleMethod = (method) => {
    setSelectedMethod(method);
  };

  const handleRemoveFromCart = (product_id, variant_sku) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { product_id, variant_sku },
    });
  };

  const handleIncrement = (product_id, variant_sku, quantity, stock) => {
    if (quantity >= stock) {
      toast.error('Stock limit reached', {
        position: 'bottom-right',
      });
      return;
    }

    dispatch({
      type: 'INCREMENT_QUANTITY',
      payload: { product_id, variant_sku },
    });
  };

  const handleDecrement = (product_id, variant_sku) => {
    dispatch({
      type: 'DECREMENT_QUANTITY',
      payload: { product_id, variant_sku },
    });
  };

  // calculate total items product
  const totalItems = posCartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // vat
  const submitVatHandler = async (event) => {
    event.preventDefault();

    const data = new FormData(event.target);
    const vat = data.get('vat');
    if (!vat) {
      console.warn('VAT field not found in form data.');
      return;
    }
    const vatPercent = parseFloat(vat); // Convert string to number
    setVatPercent(vatPercent);
    setIsVatOpen(false);
  };

  // total vat calculatation
  useEffect(() => {
    const newTotalVat = ((subTotal - discount) * vatPercent) / 100;
    setTotalVat(Math.round(newTotalVat));
  }, [vatPercent, cartTotal, subTotal, discount]);

  const handleDiscountType = (event) => {
    setDiscountType(event.target.value);
  };

  // Discount
  const submitDiscountHandler = async (event) => {
    event.preventDefault();

    const data = new FormData(event.target);
    const discountValue = parseFloat(data.get('discount_value')); // Parse the discount value
    const discountType = data.get('discount_type'); // Get the discount type

    if (isNaN(discountValue)) {
      // Add validation to ensure a valid discount value is entered
      console.log('Please enter a valid discount amount');
      return;
    }

    if (discountType === 'flat') {
      setDiscount(Math.floor(discountValue)); // Set the flat discount directly
    } else if (discountType === 'percentage') {
      setDiscount(Math.floor((cartTotal * discountValue) / 100)); // Apply percentage-based discount
    }

    setIsDiscountOpen(false); // Close the discount form
  };

  // Common form handler
  const submitFormHandler = (
    event,
    fieldName,
    setStateCallback,
    setIsOpenCallback
  ) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = data.get(fieldName);

    const floatValue = parseFloat(value);
    setStateCallback(Math.round(floatValue));
    setIsOpenCallback(false); // Close the form after submission
  };

  // Handlers for each form with separate isOpen state control
  // const submitCouponHandler = (event) => {
  //     submitFormHandler(event, 'coupon', setCoupon, setIsCouponOpen);

  // };

  const submitShippingHandler = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = data.get('shipping');
    setShipping(value);
    setIsShippingOpen(false);
    // submitFormHandler(event, 'shipping', setShipping, setIsShippingOpen);
  };

  const submitNoteHandler = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = data.get('note');
    setNote(value);
    setIsNoteOpen(false);
    // submitFormHandler(event, 'note', setNote, setIsNoteOpen);
  };

  // grand total calculation
  useEffect(() => {
    const grandTotal = subTotal + totalVat - (discount + couponValue);

    setGrandTotal(grandTotal);
    setFormData({ ...formData, received_amount: grandTotal });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subTotal, totalVat, discount, couponValue]);

  const orderedProduct = [];
  posCartItems.map((product) =>
    orderedProduct.push({
      product_name: product.product_name,
      product_id: product.product_id,
      quantity: product.quantity,
      product_variant_id: product.variant_id ?? null,
      price:
        product.final_sale_price === 0
          ? product.unit_price
          : product.final_sale_price,
      total:
        (product.final_sale_price === 0
          ? product.unit_price
          : product.final_sale_price) * product.quantity,
    })
  );

  // Single state object to store form data
  const [formData, setFormData] = useState({
    received_amount: '',
    payment_amount: '',
    change_amount: '',
  });

  const handleAmount = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      const updatedData = { ...prevFormData, [name]: value };

      // Calculate change_amount when payment_amount is updated
      if (name === 'payment_amount' && prevFormData.received_amount) {
        const receivedAmount = parseFloat(prevFormData.received_amount);
        const paymentAmount = parseFloat(value);

        // Ensure both values are numbers and valid for calculation
        if (!isNaN(receivedAmount) && !isNaN(paymentAmount)) {
          updatedData.change_amount = paymentAmount - receivedAmount;
        } else {
          updatedData.change_amount = ''; // Reset if invalid
        }
      }

      return updatedData;
    });
  };

  // Destructuring values for convenience
  const { received_amount, payment_amount, change_amount } = formData;

  // Handle quick amount buttons
  const handleQuickAmount = (amount) => {
    setFormData((prevFormData) => {
      const currentPayment = parseFloat(prevFormData.payment_amount) || 0;
      const newPaymentAmount = currentPayment + amount;
      const receivedAmount = parseFloat(prevFormData.received_amount);

      return {
        ...prevFormData,
        payment_amount: newPaymentAmount,
        change_amount: !isNaN(receivedAmount)
          ? newPaymentAmount - receivedAmount
          : '',
      };
    });
  };

  const submitSaleHandler = async (e) => {
    e.preventDefault();

    const orderData = {
      products: orderedProduct,
      customer_id: customervalue,
      store_id: warehousevalue,
      sub_total: subTotal,
      vat_amount: totalVat,
      vat: vatPercent,
      discount_amount: discount,
      total_quantity: totalItems,
      total_amount: grandTotal,
      payment_method: selectedMethod,
      shipping_address: shipping,
      note: note,
      billed_by: user.id,
      order_type: 'pos',
      paid_amount: formData.payment_amount || 0,
      change_amount: formData.change_amount || 0,
      discount_type: discountType,
      transaction_id: transactionId,
    };

    if (selectedMethod.toLowerCase() === 'bkash') {
      orderData.bkash_number = bkashNumber;
    }

    if (selectedMethod.toLowerCase() === 'card') {
      orderData.card_number = cardNumber;
    }

    if (selectedMethod.toLowerCase() === 'partial') {
      orderData.paid_amount = formData.payment_amount;
      orderData.due_amount = Math.abs(formData.change_amount);
    } else if (selectedMethod.toLowerCase() === 'due') {
      orderData.due_amount = grandTotal;
    }

    if (
      !['bkash', 'card', 'partial', 'due', 'cash'].includes(
        selectedMethod.toLowerCase()
      )
    ) {
      orderData.transaction_id = transactionId;
    }

    try {
      // setOrderLoading(true);
      const response = await salePost(authToken, JSON.stringify(orderData));
      if (response.ok) {
        // setOrderLoading(false);
        const responseData = await response.json();

        if (responseData.success) {
          setIsCardOpen(false);
          setSelectedMethod('cash');
          setInvoice(responseData.invoice);
          setInvoiceModalOpen(true);
          setDiscount(0);
          setVatPercent(storeVatPercent);
          setDiscountValue(0);
          setShipping('');
          setNote('');
          // router.push('/order-successfull');
          toast.success(`${responseData.success}`, {
            position: 'bottom-right',
          });

          setFormData({
            received_amount: '',
            payment_amount: '',
            change_amount: '',
          });

          dispatch({
            type: 'CLEAR_CART',
          });

          refetchProducts?.();

          if (adManager?.tag_managers?.length > 0) {
            adManager.tag_managers.forEach((tagManager) => {
              if (tagManager.tag_manager_id) {
                window.dataLayer.push({
                  event: 'purchase',
                  ecommerce: {
                    items: orderData,
                  },
                });
              }
            });
          }

          // For Facebook Pixels
          if (adManager?.pixels?.length > 0) {
            adManager.pixels.forEach((pixel) => {
              if (pixel.pixel_id) {
                trackEvent('Purchase', orderData);
              }
            });
          }
        } else {
          // setOrderLoading(false);
          toast.error(
            `দুঃখিত! আপনার অর্ডারটি সফল হয়নি। ${responseData.message}`,
            {
              position: 'bottom-right',
            }
          );
        }
      } else {
        throw new Error('Failed to submit Order');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <>
      <div className="min-h-[510px] 3xl:min-h-[619px] flex flex-col justify-between">
        {posCartItems.length > 0 ? (
          <div>
            <Table className="max-h-[145px] 3xl:max-h-[250px] overflow-auto d-flow search-scroll">
              <TableHeader className="sticky top-0 bg-black">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-white table-h-1">
                    Product Name
                  </TableHead>
                  <TableHead className="text-xs font-medium text-center text-white">
                    Quantity
                  </TableHead>
                  <TableHead className="text-xs text-white font-medium w-[60px]">
                    Price
                  </TableHead>
                  <TableHead className="text-xs text-white font-medium w-[60px] text-right">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs font-medium text-right text-white"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posCartItems.map((product) => (
                  <TableRow key={product.product_id + product.variant_sku}>
                    <TableCell className="text-xs text-gray-700 font-medium py-[14px] ellipsis-2">
                      {product.product_name}
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 font-medium py-[14px]">
                      <div className="flex justify-between items-center w-[65px] h-[22px] border bg-[#EAEAEA] rounded-[2px] px-[3px]">
                        <button
                          type="button"
                          onClick={() =>
                            handleDecrement(
                              product.product_id,
                              product.variant_sku
                            )
                          }
                          className="flex items-center justify-center w-4 h-4 text-xs text-gray-600 bg-white rounded-[2px] quantity-decrement"
                        >
                          <FaMinus />
                        </button>
                        <div className="text-xs text-gray-600 quantity">
                          {product.quantity}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleIncrement(
                              product.product_id,
                              product.variant_sku,
                              product.quantity,
                              product.stock
                            )
                          }
                          className="flex items-center justify-center w-4 h-4 text-xs text-gray-600 bg-white rounded-[2px] quantity-increment"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 font-medium py-[14px]">
                      {product.final_sale_price === 0
                        ? formatBanglaNumber(product.unit_price)
                        : formatBanglaNumber(product.final_sale_price)}{' '}
                      Tk
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 font-medium py-[14px]">
                      {formatBanglaNumber((product.final_sale_price === 0
                        ? product.unit_price
                        : product.final_sale_price) * product.quantity)}{' '}
                      Tk
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 font-medium py-[14px] flex justify-end">
                      <button
                        onClick={() =>
                          handleRemoveFromCart(
                            product.product_id,
                            product.variant_sku
                          )
                        }
                        className="w-5 h-5 bg-[#EDE9FA] rounded-[2px] flex justify-center items-center"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end pr-3">
              <div className="bg-white min-w-[225px]">
                <div className="border-b border-gray-400 py-[14px]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-700">
                      Subtotal
                    </p>
                    <p className="text-xs font-medium text-gray-700">
                      {formatBanglaNumber(subTotal)} TK
                    </p>
                  </div>
                </div>

                <div className="border-b border-gray-400 py-[14px]">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1 text-xs font-medium text-gray-700">
                      Discount
                      <Dialog
                        open={isDiscountOpen}
                        onOpenChange={setIsDiscountOpen}
                      >
                        <DialogTrigger asChild>
                          <button className="font-medium">
                            <BiSolidEdit />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-[#F6F4FD] border-[rgba(136, 49, 225, 0.20)]">
                          <DialogHeader className="sr-only">
                            <DialogTitle>Discount</DialogTitle>
                            <DialogDescription>
                              Discount Description
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <form
                              onSubmit={submitDiscountHandler}
                              id="cart-form"
                              className="cart-form"
                            >
                              <div className="grid gap-4">
                                <select
                                  name="discount_type"
                                  value={discountType}
                                  onChange={handleDiscountType}
                                  className="block w-full px-[14px] py-[16px] lg:px-6 lg:py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white"
                                >
                                  <option value="flat">Flat</option>
                                  <option value="percentage">Percentage</option>
                                </select>

                                <Input
                                  label="Discount"
                                  type="text"
                                  name="discount_value"
                                  placeholder="Enter Discount amount"
                                  optional={
                                    discountType === 'percentage'
                                      ? 'percentage'
                                      : 'flat'
                                  }
                                  required
                                />
                              </div>
                            </form>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </p>
                    <p className="text-xs font-medium text-gray-700">
                      {formatBanglaNumber(discount)} TK
                    </p>
                  </div>
                </div>
                <div className="border-b border-gray-400 py-[14px]">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1 text-xs font-medium text-gray-700">
                      Vat <span className="text-gray-600">({vatPercent}%)</span>
                      <Dialog open={isVatOpen} onOpenChange={setIsVatOpen}>
                        <DialogTrigger asChild>
                          <button className="font-medium">
                            <BiSolidEdit />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-[#F6F4FD] border-[rgba(136, 49, 225, 0.20)]">
                          <DialogHeader className="sr-only">
                            <DialogTitle>Vat</DialogTitle>
                            <DialogDescription>
                              Vat Description
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <form
                              onSubmit={submitVatHandler}
                              id="cart-form"
                              className="cart-form"
                            >
                              <div className="grid gap-4">
                                <Input
                                  label="Vat"
                                  type="text"
                                  name="vat"
                                  value={vatPercent}
                                  placeholder="Enter Vat amount in percentage"
                                  optional="percentage"
                                  required
                                />
                              </div>
                            </form>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </p>
                    <p className="text-xs font-medium text-gray-700">
                      {formatBanglaNumber(totalVat)} TK
                    </p>
                  </div>
                </div>
                <div className="py-[14px]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-700">Total</p>
                    <p className="text-xs font-semibold text-gray-700">
                      {formatBanglaNumber(grandTotal)} TK
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid items-center justify-center w-full min-h-[334px] 3xl:min-h-[400px]">
            <p className="text-2xl font-semibold text-gray-700">
              No product in cart
            </p>
          </div>
        )}
        <div className="border-t border-[#DFDFDF] pt-5">
          <div className="flex items-center xl:gap-[50px] gap-5 flex-wrap mb-5">
            <div className="text-xs text-gray-700 font-medium flex items-center gap-[10px]">
              <p>Items:</p>
              <p>
                {posCartItems.length} <span>({totalItems})</span>
              </p>
            </div>
            <CouponModal
              submitHandler={handleApply}
              discountValue={discountValue}
              couponChange={couponChange}
              isOpen={isCouponOpen}
              setIsOpen={setIsCouponOpen}
            />
            <ShippingModal
              submitHandler={submitShippingHandler}
              isOpen={isShippingOpen}
              setIsOpen={setIsShippingOpen}
            />
            <NoteModal
              submitHandler={submitNoteHandler}
              isOpen={isNoteOpen}
              setIsOpen={setIsNoteOpen}
            />
          </div>
          <div className="flex items-center gap-[10px] mb-[30px]">
            <div className="flex items-center gap-2 min-w-20">
              <p className="text-sm font-semibold text-gray-700">Pay Via:</p>
            </div>
            <ul className="flex items-center gap-[10px] flex-wrap">
              {paymentMethods.map((paymentMethod) => (
                <li key={paymentMethod.id}>
                  <button
                    onClick={() => handleMethod(paymentMethod.name)}
                    type="button"
                    className={`flex items-center gap-1 px-4 py-2 text-xs font-medium text-purple-900 transition-all duration-150 border border-purple-900 rounded hover:bg-purple-900 hover:text-white capitalize ${selectedMethod == paymentMethod.name
                      ? 'text-white bg-purple-900'
                      : ''
                      }`}
                  >
                    {paymentMethod.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-[18px]">
            {selectedMethod.toLowerCase() === 'due' ? (
              <button
                onClick={submitSaleHandler}
                className="w-full text-sm h-12 md:h-[56px] bg-[#4C20CD] text-white flex justify-center items-center gap-1 rounded-md"
              >
                <IoCartOutline />
                Sale
              </button>
            ) : (
              <Dialog open={isCardOpen} onOpenChange={setIsCardOpen}>
                <DialogTrigger asChild>
                  <button className="w-full text-sm h-12 md:h-[56px] bg-[#4C20CD] text-white flex justify-center items-center gap-1 rounded-md">
                    <IoCartOutline />
                    Sale
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-[#F6F4FD] border-[rgba(136, 49, 225, 0.20)]">
                  <DialogHeader className="sr-only">
                    <DialogTitle>Payment</DialogTitle>
                    <DialogDescription>Complete your payment</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <form
                      onSubmit={submitSaleHandler}
                      id="cart-form"
                      className="cart-form"
                    >
                      <div className="grid gap-4">
                        {/* Payable Amount */}
                        <div className="single-input">
                          <label className="block text-gray-700 text-sm font-semibold mb-[6px] capitalize">
                            Payable Amount
                          </label>
                          <input
                            type="number"
                            name="received_amount"
                            value={received_amount}
                            readOnly
                            className="block w-full px-[14px] py-[16px] border border-[#D0D5DD] rounded-md"
                          />
                        </div>

                        {/* Payment Amount with Quick Buttons */}
                        <div className="single-input">
                          <label className="block text-gray-700 text-sm font-semibold mb-[6px] capitalize">
                            Received Amount
                          </label>
                          <input
                            type="number"
                            name="payment_amount"
                            value={payment_amount}
                            placeholder="Enter payment amount"
                            onChange={handleAmount}
                            required
                            className="block w-full px-[14px] py-[16px] border border-[#D0D5DD] rounded-md"
                          />
                          {/* Quick Amount Buttons */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => handleQuickAmount(100)}
                              className="px-4 py-2 text-xs font-medium text-gray-900 transition-all border border-gray-900 rounded hover:bg-gray-900 hover:text-white"
                            >
                              100
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickAmount(500)}
                              className="px-4 py-2 text-xs font-medium text-gray-900 transition-all border border-gray-900 rounded hover:bg-gray-900 hover:text-white"
                            >
                              500
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickAmount(1000)}
                              className="px-4 py-2 text-xs font-medium text-gray-900 transition-all border border-gray-900 rounded hover:bg-gray-900 hover:text-white"
                            >
                              1000
                            </button>
                          </div>
                        </div>

                        {/* Change / Due Amount */}
                        <div className="single-input">
                          <label className="block text-gray-700 text-sm font-semibold mb-[6px] capitalize">
                            {selectedMethod.toLowerCase() === 'partial'
                              ? 'Due Amount'
                              : 'Change Amount'}
                          </label>
                          <input
                            type="number"
                            name="change_amount"
                            value={
                              selectedMethod.toLowerCase() === 'partial'
                                ? Math.abs(change_amount)
                                : change_amount
                            }
                            readOnly
                            className="block w-full px-[14px] py-[16px] border border-[#D0D5DD] rounded-md"
                          />
                        </div>

                        {/* Dynamic Fields */}
                        {selectedMethod === 'bkash' && (
                          <div className="single-input">
                            <label className="block text-gray-700 text-sm font-semibold mb-[6px] capitalize">
                              bKash Mobile Number
                            </label>
                            <input
                              type="text"
                              name="bkash_number"
                              value={bkashNumber}
                              placeholder="Enter bKash number"
                              onChange={(e) => setBkashNumber(e.target.value)}
                              className="block w-full px-[14px] py-[16px] border border-[#D0D5DD] rounded-md"
                            />
                          </div>
                        )}

                        {selectedMethod === 'nagad' && (
                          <div className="single-input">
                            <label className="block text-gray-700 text-sm font-semibold mb-[6px] capitalize">
                              Nagad Mobile Number
                            </label>
                            <input
                              type="text"
                              name="nagad_number"
                              value={nagadNumber}
                              placeholder="Enter Nagad number"
                              onChange={(e) => setNagadNumber(e.target.value)}
                              className="block w-full px-[14px] py-[16px] border border-[#D0D5DD] rounded-md"
                            />
                          </div>
                        )}

                        {!['nagad', 'bkash', 'due', 'partial', 'cash'].includes(
                          selectedMethod.toLowerCase()
                        ) && (
                            <div className="single-input">
                              <label className="block text-gray-700 text-sm font-semibold mb-[6px] capitalize">
                                Transaction ID / Order ID
                              </label>
                              <input
                                type="text"
                                name="transaction_id"
                                value={transactionId}
                                placeholder="Enter transaction/order ID"
                                onChange={(e) => setTransactionId(e.target.value)}
                                className="block w-full px-[14px] py-[16px] border border-[#D0D5DD] rounded-md"
                              />
                            </div>
                          )}
                      </div>

                      <div className="flex justify-start pt-5">
                        <button
                          type="submit"
                          className="text-xs bg-purple-900 text-white hover:bg-transparent hover:text-purple-900 font-medium py-[14px] px-[30px] border border-purple-900 transition-all duration-150 rounded"
                        >
                          Sale
                        </button>
                      </div>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <RecentSaleModal />
          </div>
        </div>
      </div>
      <div className="">
        <Dialog open={invoiceModalOpen} onOpenChange={setInvoiceModalOpen}>
          <DialogContent
            className={`${siteSetting.invoice_show_format === 'a4_format'
              ? 'sm:max-w-[800px]'
              : 'sm:max-w-[425px]'
              } bg-[#F6F4FD] border-[rgba(136, 49, 225, 0.20)] max-h-[90vh] scrollbar-hide overflow-y-auto`}
          >
            <DialogHeader className="sr-only">
              <DialogTitle>Coupon</DialogTitle>
              <DialogDescription>Coupon Description</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div
                dangerouslySetInnerHTML={{
                  __html: invoice,
                }}
              ></div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default BillTable;
