'use client';

import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import { decrypt } from '@/_services/encryption';
import { getSingleOrder } from '@/_utils/auth/getOrders';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/_utils/formatNumber';
import { useEffect, useState } from 'react';
import { FiMapPin, FiPackage, FiPhone, FiUser } from 'react-icons/fi';

export default function OrderDetailsPage() {
    const params = useParams();
    const orderId = params.orderId;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { dictionary } = useDictionary();
    const { siteSetting } = useSiteSetting();
    const authTexts = dictionary?.Auth || {};
    const token = Cookies.get('userToken');

    useEffect(() => {
        const fetchOrder = async () => {
            if (!token || !orderId) return;
            setLoading(true);
            try {
                const response = await getSingleOrder(decrypt(token), orderId);
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [token, orderId]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return 'text-orange-600 bg-orange-100';
            case 'Hold': return 'text-orange-600 bg-orange-100';
            case 'Processed': return 'text-blue-600 bg-blue-100';
            case 'Delivered': return 'text-teal-600 bg-teal-100';
            case 'Completed': return 'text-green-600 bg-green-100';
            case 'Cancelled': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Pending': return authTexts.pending || 'Pending';
            case 'Hold': return authTexts.hold || 'Hold';
            case 'Processed': return authTexts.processed || 'Processed';
            case 'Delivered': return authTexts.delivered || 'Delivered';
            case 'Completed': return authTexts.received || 'Completed';
            case 'Cancelled': return authTexts.cancelled || 'Cancelled';
            default: return status;
        }
    };

    const currency = siteSetting?.currency_icon || '৳';

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
                Order not found
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {authTexts.orderId || 'Order'} #{order.order_number}
                        </h2>
                        <p className="text-gray-500">{order.order_at || order.created_at}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle(order.status)}`}>
                        {getStatusText(order.status)}
                    </span>
                </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiMapPin className="text-primary-600" />
                    {authTexts.shipping || 'Shipping Information'}
                </h3>
                <div className="space-y-2 text-gray-600">
                    <p className="flex items-center gap-2">
                        <FiUser className="text-gray-400" />
                        {order.customer?.name}
                    </p>
                    <p className="flex items-center gap-2">
                        <FiPhone className="text-gray-400" />
                        {order.customer?.phone}
                    </p>
                    <p className="flex items-center gap-2">
                        <FiMapPin className="text-gray-400" />
                        {order.customer?.address}
                    </p>
                </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiPackage className="text-primary-600" />
                    {authTexts.products || 'Products'}
                </h3>
                <div className="space-y-4">
                    {order.order_items?.map((item, index) => (
                        <div key={index} className="flex gap-4 p-4 border border-gray-100 rounded-lg">
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                    src={item.product_image || '/images/no-available.svg'}
                                    alt={item.product_name}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">{item.product_name}</h4>
                                {item.attributes?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {item.attributes.map((attr, idx) => (
                                            <span key={idx} className="text-sm text-gray-500">
                                                {attr.name}: {attr.name === 'color' ? (
                                                    <span className="inline-block w-4 h-4 rounded-full border" style={{ backgroundColor: `#${attr.value}` }}></span>
                                                ) : attr.value}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Qty: {item.quantity}</span>
                                    <span className="font-semibold text-primary-600">{currency}{formatPrice(item.total)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {authTexts.orderInfo || 'Order Summary'}
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                        <span>{authTexts.paymentMethod || 'Payment Method'}</span>
                        <span className="font-medium capitalize">{order.payment_method}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>{authTexts.subTotal || 'Subtotal'}</span>
                        <span className="font-medium">{currency}{formatPrice(order.sub_total)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>{authTexts.deliveryFee || 'Delivery Fee'}</span>
                        <span className="font-medium">{currency}{formatPrice(order.delivery_fee)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-gray-900 pt-3 border-t border-gray-200">
                        <span>{authTexts.totalPay || 'Total'}</span>
                        <span className="text-primary-600">{currency}{formatPrice(order.total_amount)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
