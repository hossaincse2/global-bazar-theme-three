'use client';

import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import { decrypt } from '@/_services/encryption';
import { getMyOrders, getOrderStatus } from '@/_utils/auth/getOrders';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { formatPrice } from '@/_utils/formatNumber';
import { FiEye } from 'react-icons/fi';

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState('all');
    const [orderStatusList, setOrderStatusList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalOrder, setTotalOrder] = useState(0);
    const [orderItem, setOrderItem] = useState([]);
    const loaderRef = useRef(null);
    const [isSeeMoreClick, setIsSeeMoreClick] = useState(false);
    const { dictionary } = useDictionary();
    const { siteSetting } = useSiteSetting();
    const authTexts = dictionary?.Auth || {};
    const token = Cookies.get('userToken');

    const memoizedOrderArray = useMemo(() => orderItem, [orderItem]);

    const handleSeeMore = useCallback(() => {
        setPage((prev) => prev + 1);
        setIsSeeMoreClick(true);
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const response = await getMyOrders(decrypt(token), orderStatus, page, 10);
                setOrders(response.data);
                setTotalOrder(response.meta?.total || 0);
                if (page === 1) {
                    setOrderItem(response.data);
                } else {
                    setOrderItem((prev) => [...prev, ...response.data]);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token, orderStatus, page]);

    useEffect(() => {
        const fetchOrderStatus = async () => {
            if (!token) return;
            try {
                const response = await getOrderStatus(decrypt(token));
                setOrderStatusList(response.data || []);
            } catch (error) {
                console.error('Error fetching order status:', error);
            }
        };
        fetchOrderStatus();
    }, [token]);

    useEffect(() => {
        if (orderItem.length >= totalOrder) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loading) {
                handleSeeMore();
            }
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [loading, orderItem.length, totalOrder, handleSeeMore]);

    const handleOrderStatus = (status) => {
        setOrderStatus(status);
        setIsSeeMoreClick(false);
        setPage(1);
    };

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

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 pb-4 border-b border-gray-200 mb-6">
                {authTexts.myOrders || 'My Orders'}
            </h2>

            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
                <button
                    onClick={() => handleOrderStatus('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${orderStatus === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    {authTexts.all || 'All'}
                </button>
                {orderStatusList.map((status) => (
                    <button
                        key={status}
                        onClick={() => handleOrderStatus(status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${orderStatus === status ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {getStatusText(status)}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {loading && !isSeeMoreClick ? (
                <div className="py-10 text-center text-gray-500">Loading...</div>
            ) : memoizedOrderArray.length > 0 ? (
                <div className="space-y-4">
                    {memoizedOrderArray.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <p className="text-gray-600">
                                            {authTexts.orderId || 'Order ID'}:{' '}
                                            <span className="font-semibold text-gray-900">#{order.order_number}</span>
                                        </p>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-1">
                                        {authTexts.orderItems || 'Items'}:{' '}
                                        <span className="font-semibold">{order.total_quantity}</span>
                                    </p>
                                    <p className="text-gray-600">
                                        {authTexts.total || 'Total'}:{' '}
                                        <span className="font-semibold text-primary-600">{currency}{formatPrice(order.total_amount)}</span>
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <p className="text-sm text-gray-500">
                                        {authTexts.placed || 'Placed'}: {order.created_at}
                                    </p>
                                    <Link
                                        href={`/dashboard/my-orders/${order.id}`}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition"
                                    >
                                        <FiEye /> {authTexts.details || 'Details'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-10 text-center text-gray-500">
                    {authTexts.noFound || 'No orders found'}
                </div>
            )}

            {/* Loader for infinite scroll */}
            <div ref={loaderRef} className="flex justify-center py-4">
                {loading && orderItem.length < totalOrder && (
                    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                )}
            </div>
        </div>
    );
}
