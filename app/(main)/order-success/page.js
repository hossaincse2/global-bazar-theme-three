'use client';

import useDictionary from '@/_hooks/useDictionary';
import useOrderId from '@/_hooks/useOrderId';
import useSiteSetting from '@/_hooks/useSiteSetting';
import { getInvoice } from '@/_utils/getInvoice';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiCheckCircle, FiDownload, FiHome, FiPrinter, FiX } from 'react-icons/fi';

export default function OrderSuccessPage() {
    const { orderId } = useOrderId();
    const { siteSetting } = useSiteSetting();
    const { dictionary, language } = useDictionary();
    const router = useRouter();
    const [invoice, setInvoice] = useState('');
    const [showInvoice, setShowInvoice] = useState(false);
    const [loading, setLoading] = useState(false);

    const orderSuccessTexts = dictionary?.OrderSuccess || {};

    useEffect(() => {
        if (!orderId) {
            router.push('/');
        }
    }, [orderId, router]);

    const handlePrintInvoice = async () => {
        if (!orderId) return;
        setLoading(true);
        try {
            const invoiceData = await getInvoice(orderId);
            setInvoice(invoiceData.invoice);
            setShowInvoice(true);
        } catch (error) {
            console.error('Error fetching invoice:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice - ${orderId}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        @media print { body { padding: 0; } }
                    </style>
                </head>
                <body>${invoice}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    if (!orderId) return null;

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12">
            <div className="container">
                <div className="max-w-lg mx-auto text-center">
                    {/* Success Icon */}
                    <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                        <FiCheckCircle className="text-5xl text-green-500" />
                    </div>

                    {/* Logo */}
                    {siteSetting?.header_logo && (
                        <div className="mb-6">
                            <Image
                                src={siteSetting.header_logo}
                                alt={siteSetting?.title || 'Store'}
                                width={150}
                                height={50}
                                className="h-12 w-auto object-contain mx-auto"
                            />
                        </div>
                    )}

                    {/* Success Message */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {orderSuccessTexts.orderSuccess || 'Order Placed Successfully!'}
                    </h1>

                    <p className="text-gray-600 mb-2">
                        {language === 'en' 
                            ? `${orderSuccessTexts.orderThanks || 'Thank you for shopping with'} ${siteSetting?.title || 'us'}!`
                            : `${siteSetting?.title || ''} ${orderSuccessTexts.orderThanks || 'থেকে কেনাকাটা করার জন্য ধন্যবাদ'}!`
                        }
                    </p>

                    <p className="text-gray-600 mb-8">
                        {orderSuccessTexts.orderIdText || 'Order ID'}:{' '}
                        <span className="font-bold text-primary-600">#{orderId}</span>
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition"
                        >
                            <FiHome />
                            {orderSuccessTexts.shoppingMore || 'Continue Shopping'}
                        </Link>

                        <button
                            onClick={handlePrintInvoice}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition disabled:opacity-50"
                        >
                            <FiPrinter />
                            {loading ? (dictionary?.Global?.loading || 'Loading...') : (dictionary?.Auth?.invoice || 'Invoice')}
                        </button>
                    </div>

                    {/* Order Info */}
                    <div className="mt-10 p-6 bg-white rounded-xl shadow-sm text-left">
                        <h3 className="font-semibold text-gray-900 mb-4">{orderSuccessTexts.whatsNext || "What's Next?"}</h3>
                        <ul className="space-y-3 text-gray-600 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                                <span>{orderSuccessTexts.step1 || 'You will receive an order confirmation SMS/Email shortly.'}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                                <span>{orderSuccessTexts.step2 || 'Our team will process your order and prepare it for delivery.'}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                                <span>{orderSuccessTexts.step3 || 'You can track your order status from your dashboard.'}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Invoice Modal */}
            {showInvoice && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowInvoice(false)}>
                    <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900">Invoice</h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrint}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                    title="Print"
                                >
                                    <FiPrinter className="text-gray-600" />
                                </button>
                                <button
                                    onClick={() => setShowInvoice(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <FiX className="text-gray-600" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[70vh]">
                            <div dangerouslySetInnerHTML={{ __html: invoice }} />
                        </div>
                        <div className="p-4 border-t border-gray-200 flex gap-3">
                            <button
                                onClick={handlePrint}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition"
                            >
                                <FiDownload />
                                Print / Download
                            </button>
                            <button
                                onClick={() => setShowInvoice(false)}
                                className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
