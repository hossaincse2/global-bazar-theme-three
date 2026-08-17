'use client';

import { ProductContext } from '@/_context/cartContext';
import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { formatPrice } from '@/_utils/formatNumber';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

const CartContent = () => {
  const { state, dispatch } = useContext(ProductContext);
  const { dictionary } = useDictionary();
  const { siteSetting } = useSiteSetting();
  const cartTexts = dictionary?.Cart || {};
  const currency = siteSetting?.currency_icon || siteSetting?.currency || '৳';

  const handleRemove = (item) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: item });
  };

  const handleIncrement = (item) => {
    dispatch({ type: 'INCREMENT_QUANTITY', payload: item });
  };

  const handleDecrement = (item) => {
    dispatch({ type: 'DECREMENT_QUANTITY', payload: item });
  };

  if (state.cartItems.length === 0) {
    return (
      <div className="py-16">
        <div className="container text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-dark-900 mb-2">{cartTexts.tableEmpty || 'Your cart is empty'}</h2>
            <p className="text-gray-600 mb-6">{dictionary?.Global?.noFound || 'Add some products to get started'}</p>
            <Link
              href="/collections"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              {cartTexts.continueShopping || 'Continue Shopping'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container">
        <h1 className="text-3xl md:text-4xl font-bold text-dark-900 mb-8">{cartTexts.pageTitle || 'Shopping Cart'}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.cartItems.map((item) => (
              <div
                key={`${item.id}-${item.variant_id || ''}`}
                className="bg-white rounded-xl shadow-sm p-4 flex gap-4"
              >
                <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.preview_image || item.image || '/images/no-available.svg'}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-semibold text-dark-900 hover:text-primary-600 line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-primary-600 font-bold mt-1">
                    {currency}{formatPrice(item.sale_price > 0 ? item.sale_price : item.unit_price)}
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecrement(item)}
                        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                      >
                        <FiMinus className="text-sm" />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleIncrement(item)}
                        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                      >
                        <FiPlus className="text-sm" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item)}
                      className="text-accent-500 hover:text-accent-600 flex items-center gap-1 text-sm"
                    >
                      <FiTrash2 />
                      {cartTexts.tableAction || 'Remove'}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg text-dark-900">
                    {currency}{formatPrice((item.sale_price > 0 ? item.sale_price : item.unit_price) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-dark-900 mb-4">{dictionary?.Checkout?.orderTitle || 'Order Summary'}</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>{cartTexts.tableSubTotal || 'Subtotal'}</span>
                  <span>{currency}{formatPrice(state.cartTotal)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-dark-900">
                  <span>{cartTexts.tableTotal || 'Total'}</span>
                  <span>{currency}{formatPrice(state.cartTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold text-center transition mb-3"
              >
                {cartTexts.tableCheckout || 'Proceed to Checkout'}
              </Link>

              <Link
                href="/collections"
                className="block w-full border-2 border-gray-300 hover:border-primary-600 text-dark-900 py-3 rounded-lg font-semibold text-center transition"
              >
                {cartTexts.continueShopping || 'Continue Shopping'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartContent;
