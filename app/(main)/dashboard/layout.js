'use client';

import useDictionary from '@/_hooks/useDictionary';
import useUser from '@/_hooks/useUser';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSelectedLayoutSegment } from 'next/navigation';
import { useEffect } from 'react';
import { FiShoppingBag, FiUser } from 'react-icons/fi';

export default function DashboardLayout({ children }) {
    const { user } = useUser();
    const router = useRouter();
    const segment = useSelectedLayoutSegment();
    const { dictionary } = useDictionary();
    const authTexts = dictionary?.Auth || {};

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="py-10 bg-gray-50 min-h-screen">
            <div className="container">
                <div className="grid grid-cols-12 gap-6">
                    {/* Sidebar */}
                    <div className="col-span-12 md:col-span-3">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <div className="text-center mb-6">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary-100">
                                    {user.avatar ? (
                                        <Image src={user.avatar} alt={user.name} width={96} height={96} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                                            <FiUser className="text-4xl text-primary-600" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                <p className="text-sm text-gray-500">{user.email || user.phone}</p>
                            </div>
                            <nav className="space-y-2">
                                <Link
                                    href={`/dashboard/user/${user.username}`}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
                                        segment === 'user' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <FiUser className="text-lg" />
                                    {authTexts.profile || 'Profile'}
                                </Link>
                                <Link
                                    href="/dashboard/my-orders"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
                                        segment === 'my-orders' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <FiShoppingBag className="text-lg" />
                                    {authTexts.myOrders || 'My Orders'}
                                </Link>
                            </nav>
                        </div>
                    </div>
                    {/* Main Content */}
                    <div className="col-span-12 md:col-span-9">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
