'use client';

import { ProductContext } from '@/_context/cartContext';
import { WishlistContext } from '@/_context/wishlistContext';
import { CompareContext } from '@/_context/compareContext';
import { ThemeOptionsContext } from '@/_context/ThemeOptionsContext';
import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { formatPrice } from '@/_utils/formatNumber';
import { FiHeart, FiStar, FiBarChart2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import VariantModal from './VariantModal';

const ProductCard = ({ product }) => {
  const { dispatch } = useContext(ProductContext);
  const { wishlistState, wishlistDispatch } = useContext(WishlistContext);
  const { compareState, compareDispatch } = useContext(CompareContext);
  const { themeOptions } = useContext(ThemeOptionsContext);
  const { dictionary } = useDictionary();
  const { siteSetting } = useSiteSetting();
  const router = useRouter();
  const productDetailsTexts = dictionary?.ProductDetails || {};
  const productCardTexts = dictionary?.ProductCard || {};
  const currency = siteSetting?.currency_icon || siteSetting?.currency || '৳';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addBtnText = themeOptions?.button_settings?.card_button_text || productCardTexts.addToCart || 'Add to Cart';

  const handleAddToCart = (e) => {
    e?.preventDefault();
    if (product?.variants?.length > 0) {
      setIsModalOpen(true);
      return;
    }
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.preview_image || product.image,
        unit_price: product.unit_price,
        sale_price: product.sale_price,
        quantity: 1,
      },
    });
    toast.success(productDetailsTexts.addedToCart || 'Added to cart!');
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (product?.variants?.length > 0) {
      router.push(`/products/${product.slug}`);
      return;
    }
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.preview_image || product.image,
        unit_price: product.unit_price,
        sale_price: product.sale_price,
        quantity: 1,
      },
    });
    router.push('/checkout');
  };

  const isWishlisted = wishlistState?.wishlistItems?.some((item) => item.id === product?.id);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;
    wishlistDispatch({
      type: 'TOGGLE_WISHLIST',
      payload: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        preview_image: product.preview_image || product.image,
        unit_price: product.unit_price,
        sale_price: product.sale_price,
      }
    });
    if (isWishlisted) {
      toast.info('Removed from wishlist');
    } else {
      toast.success('Added to wishlist');
    }
  };

  const isCompared = compareState?.compareItems?.some((item) => item.id === product?.id);

  const handleToggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;

    if (!isCompared && (compareState?.compareItems?.length || 0) >= 4) {
      toast.warning('You can only compare up to 4 products at a time.');
      return;
    }

    compareDispatch({
      type: 'TOGGLE_COMPARE',
      payload: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        preview_image: product.preview_image || product.image,
        unit_price: product.unit_price,
        sale_price: product.sale_price,
        category: product.category,
        brand: product.brand,
        specification: product.specification || product.specifications,
        summary: product.summary,
      }
    });

    if (isCompared) {
      toast.info('Removed from compare');
    } else {
      toast.success('Added to compare');
      const newCount = (compareState?.compareItems?.length || 0) + 1;
      if (newCount >= 2) {
        router.push('/compare');
      }
    }
  };

  const discountPercentage = product.sale_price > 0
    ? Math.round(((product.unit_price - product.sale_price) / product.unit_price) * 100)
    : 0;

  const displayPrice = product.sale_price > 0 ? product.sale_price : product.unit_price;
  const rating = parseFloat(product.average_rating || 0);

  return (
    <div className="group/card bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-xl transition-all duration-500 h-full flex flex-col relative overflow-hidden">
      {/* New Arrival Badge - Diagonal */}
      {product.is_new && (
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden z-10 pointer-events-none">
          <div className="absolute top-2 -right-6 w-24 py-1 bg-[#ff0055] text-white text-[10px] font-bold text-center rotate-45 uppercase shadow-md leading-relaxed">
            NEW ARRIVAL
          </div>
        </div>
      )}

      <Link href={`/products/${product.slug}`} className="block relative h-full flex flex-col">
        {/* Action Buttons Container */}
        <div className="absolute top-0 left-0 flex flex-col gap-2 z-10 opacity-0 group-hover/card:opacity-100 transition-opacity">
          {/* Wishlist Button */}
          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm
              ${isWishlisted
                ? 'bg-pink-50 text-pink-500 opacity-100'
                : 'bg-white/90 text-gray-600 backdrop-blur-sm hover:bg-pink-50 hover:text-pink-500'
              }`}
            onClick={handleToggleWishlist}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <FiHeart size={14} className={isWishlisted ? 'fill-current' : ''} />
          </button>

          {/* Compare Button (Show unconditionally) */}
          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm
              ${isCompared
                ? 'bg-blue-50 text-blue-500 opacity-100'
                : 'bg-white/90 text-gray-600 backdrop-blur-sm hover:bg-blue-50 hover:text-blue-500'
              }`}
            onClick={handleToggleCompare}
            title={isCompared ? 'Remove from Compare' : 'Compare Product'}
          >
            <FiBarChart2 size={14} />
          </button>
        </div>

        {/* Thumbnail */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-xl mb-4">
          <Image
            src={product.preview_image || product.image || '/images/no-available.svg'}
            alt={product.name}
            fill
            className="object-contain group-hover/card:scale-110 transition-transform duration-700"
          />
          {discountPercentage > 0 && (
            <div className="absolute bottom-2 right-2 bg-accent-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
              -{discountPercentage}%
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex flex-col items-center text-center flex-1">
          {/* Brand Info */}
          <div className="h-4 mb-2 flex items-center justify-center">
            {product.brand?.logo || product.brand?.image ? (
              <div className="relative w-12 h-4 grayscale group-hover/card:grayscale-0 transition-all duration-300">
                <Image
                  src={product.brand?.logo || product.brand?.image}
                  alt={product.brand?.name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">
                {product.brand?.name || product.category || 'GENERIC'}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-gray-800 text-sm md:text-base line-clamp-2 hover:text-primary-600 transition-colors h-10 md:h-12 overflow-hidden px-1 mb-2">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="mb-2">
            <span className="text-primary-600 font-extrabold text-base md:text-lg">
              {currency}{formatPrice(displayPrice)}
            </span>
            {product.sale_price > 0 && (
              <span className="text-gray-400 line-through text-xs ml-2">
                {currency}{formatPrice(product.unit_price)}
              </span>
            )}
          </div>

          {/* Ratings */}
          <div className="flex items-center gap-1 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={12}
                  className={`${i < Math.floor(rating) ? 'fill-current' : ''}`}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-gray-500">
              ({rating > 0 ? rating.toFixed(1) : '5.0'})
            </span>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex gap-2 w-full mt-auto">
            <button
              onClick={handleAddToCart}
              className="theme-card-btn flex-1 font-bold py-2 rounded-xl transition-all duration-300 text-[11px] md:text-xs shadow-sm border"
              title={addBtnText}
            >
              {addBtnText}
            </button>
            <button
              onClick={handleBuyNow}
              className="theme-btn flex-1 font-bold py-2 rounded-xl transition-all duration-300 text-[11px] md:text-xs shadow-sm border"
              title="Buy Now"
            >
              Buy Now
            </button>
          </div>
        </div>
      </Link>

      {product?.variants?.length > 0 && (
        <VariantModal
          product={product}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductCard;
