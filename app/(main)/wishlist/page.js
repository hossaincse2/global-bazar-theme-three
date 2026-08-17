'use client';

import { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiHeart, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { WishlistContext } from '@/_context/wishlistContext';
import { formatPrice } from '@/_utils/formatNumber';
import useSiteSetting from '@/_hooks/useSiteSetting';
import useDictionary from '@/_hooks/useDictionary';

export default function WishlistPage() {
    const { wishlistState, wishlistDispatch } = useContext(WishlistContext);
    const { siteSetting } = useSiteSetting();
    const { dictionary } = useDictionary();
    const currency = siteSetting?.currency_icon || siteSetting?.currency || '৳';
    const globalTexts = dictionary?.Global || {};

    const handleRemove = (product) => {
        wishlistDispatch({
            type: 'TOGGLE_WISHLIST',
            payload: product
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8 md:py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <FiHeart className="text-pink-500 fill-current" />
                    {globalTexts.myWishlist || 'My Wishlist'}
                </h1>

                {wishlistState?.wishlistItems?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {wishlistState.wishlistItems.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden group flex flex-col h-full border border-gray-100">
                                <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-gray-100">
                                    <Image
                                        src={product.preview_image || '/images/no-available.svg'}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {product.sale_price > 0 && (
                                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                            Sale
                                        </div>
                                    )}
                                </Link>

                                <div className="p-4 flex flex-col flex-grow">
                                    <Link href={`/products/${product.slug}`} className="block mb-2 flex-grow">
                                        <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2 hover:text-primary-600 transition">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    <div className="flex items-center justify-between mt-auto pt-2">
                                        <div className="flex flex-col">
                                            {product.sale_price > 0 ? (
                                                <>
                                                    <span className="font-bold text-primary-600 text-[15px]">{currency}{formatPrice(product.sale_price)}</span>
                                                    <span className="text-gray-400 line-through text-xs">{currency}{formatPrice(product.unit_price)}</span>
                                                </>
                                            ) : (
                                                <span className="font-bold text-primary-600 text-[15px]">{currency}{formatPrice(product.unit_price)}</span>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleRemove(product)}
                                            className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                                            title="Remove from wishlist"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mb-6">
                            <FiHeart size={40} />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your wishlist yet. Explore our products and add your favorites!</p>
                        <Link
                            href="/collections"
                            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <FiShoppingCart />
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
