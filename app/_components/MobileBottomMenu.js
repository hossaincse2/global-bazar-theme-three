'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { FiHome, FiSearch, FiShoppingCart, FiHeart, FiGrid } from 'react-icons/fi';
import { ProductContext } from '@/_context/cartContext';
import { WishlistContext } from '@/_context/wishlistContext';
import useDictionary from '@/_hooks/useDictionary';

const MobileBottomMenu = () => {
    const pathname = usePathname();
    const { state } = useContext(ProductContext);
    const { wishlistState } = useContext(WishlistContext);
    const { dictionary } = useDictionary();
    const headerTexts = dictionary?.Header || {};

    const menuItems = [
        {
            label: headerTexts.home || 'Home',
            icon: <FiHome className="text-xl" />,
            href: '/',
        },
        {
            label: headerTexts.shop || 'Shop',
            icon: <FiGrid className="text-xl" />,
            href: '/collections',
        },
        {
            label: 'Search',
            icon: <FiSearch className="text-xl" />,
            href: '#',
            onClick: (e) => {
                e.preventDefault();
                // Focus mobile search input if available, fallback to desktop
                const searchInput = document.querySelector('form.sm\\:hidden input') || document.querySelector('header form input');
                if (searchInput) {
                    searchInput.focus();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            },
        },
        {
            label: headerTexts.wishlist || 'Wishlist',
            icon: (
                <div className="relative">
                    <FiHeart className="text-xl" />
                    {wishlistState?.wishlistItems?.length > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                            {wishlistState.wishlistItems.length}
                        </span>
                    )}
                </div>
            ),
            href: '/wishlist',
        },
        {
            label: headerTexts.cart || 'Cart',
            icon: (
                <div className="relative">
                    <FiShoppingCart className="text-xl" />
                    {state.cartItems.length > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-primary-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                            {state.cartItems.length}
                        </span>
                    )}
                </div>
            ),
            href: '/cart',
        },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb-safe">
            <div className="container px-2">
                <div className="flex justify-between items-center py-2 h-16">
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                onClick={item.onClick}
                                className={`flex flex-col items-center justify-center flex-1 min-w-0 transition-all ${isActive ? 'text-primary-600' : 'text-gray-500'
                                    }`}
                            >
                                <div className={`mb-1 transition-transform ${isActive ? 'scale-110' : ''}`}>
                                    {item.icon}
                                </div>
                                <span className={`text-[10px] font-medium truncate w-full text-center ${isActive ? 'text-primary-600' : 'text-gray-500'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MobileBottomMenu;
