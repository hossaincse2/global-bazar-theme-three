'use client';

import ProductCard from '@/_components/ProductCard';
import { ProductContext } from '@/_context/cartContext';
import { ThemeOptionsContext } from '@/_context/ThemeOptionsContext';
import useDictionary from '@/_hooks/useDictionary';
import { getAllProduct, getProduct } from '@/_utils/getAllProduct';
import { reviewPost } from '@/_utils/reviewPost';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { formatPrice } from '@/_utils/formatNumber';
import { FaRegStar, FaRegUserCircle, FaStar } from 'react-icons/fa';
import { FiCheck, FiEdit2, FiHeart, FiMinus, FiPlus, FiShare2, FiShoppingCart, FiTruck } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductDetails = ({ slug }) => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentPreview, setCurrentPreview] = useState(null);
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [matchedVariant, setMatchedVariant] = useState(null);
  const [variantPrice, setVariantPrice] = useState(0);
  const [variantStock, setVariantStock] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [showVariantError, setShowVariantError] = useState(false);
  const { dispatch, state } = useContext(ProductContext);
  const { themeOptions } = useContext(ThemeOptionsContext);
  const { language, dictionary } = useDictionary();

  const productTexts = dictionary?.ProductDetails || {};
  const reviewTexts = dictionary?.ProductReview || {};
  const globalTexts = dictionary?.Global || {};

  const addBtnText = themeOptions?.button_settings?.card_button_text || productTexts.addToCart || 'Add to Cart';

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, relatedData] = await Promise.all([
          getProduct(language, slug, null, false),
          getAllProduct(language, 'all', '', 'new_arrival', '', 1, 4, 'all', null, false),
        ]);
        setProduct(productData?.data);
        setRelatedProducts(relatedData?.data || []);
        if (productData?.data) {
          setVariantPrice(productData.data.sale_price || 0);
          setVariantStock(productData.data.stock || 0);
          setCurrentPreview(productData.data.preview_image);
        }
      } catch (error) { console.error('Error fetching product:', error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [slug, language]);

  const getAttributeOptions = () => {
    if (!product?.variants?.length) return {};
    const attributesMap = {};
    product.variants.forEach((variant) => {
      Object.entries(variant.attributes || {}).forEach(([key, value]) => {
        if (!attributesMap[key]) attributesMap[key] = new Set();
        attributesMap[key].add(value);
      });
    });
    return Object.fromEntries(Object.entries(attributesMap).map(([key, set]) => [key, [...set]]));
  };

  const attributeOptions = getAttributeOptions();
  const getVariantByAttribute = (key, value) => product?.variants?.find((v) => v.attributes?.[key] === value);

  const handleVariantChange = (key, value) => {
    setShowVariantError(false);
    const updated = { ...selectedVariants, [key]: value };
    setSelectedVariants(updated);
    if (key.toLowerCase() === 'color') {
      const colorVariant = getVariantByAttribute(key, value);
      const variantImage = colorVariant?.preview_image || colorVariant?.variant_images?.[0]?.preview_url;
      if (variantImage && !variantImage.includes('placeholder')) setCurrentPreview(variantImage);
    }
    const found = product?.variants?.find((v) => Object.entries(v.attributes || {}).every(([k, val]) => updated[k] === val));
    if (found) {
      setMatchedVariant(found);
      setVariantStock(found.qty);
      setVariantPrice((product.sale_price || 0) + (found.additional_price || 0));
      if (quantity > found.qty && found.qty > 0) setQuantity(found.qty);
    } else {
      setMatchedVariant(null);
      setVariantStock(0);
      setVariantPrice(product?.sale_price || 0);
    }
  };

  const handleThumbnailClick = (image, index) => {
    setCurrentPreview(image.original_url || image.preview_url || image);
    setActiveThumbIndex(index);
  };

  const isInCart = () => state.cartItems.some((item) => product?.variants?.length > 0 ? item.id === product.id && item.variant_id === matchedVariant?.product_variant_id : item.id === product.id);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.variants?.length > 0) {
      if (Object.keys(selectedVariants).length !== Object.keys(attributeOptions).length) { 
        setShowVariantError(true);
        return; 
      }
      if (!matchedVariant) { toast.error(productTexts.combinationNotAvailable || 'This combination is not available'); return; }
      if (matchedVariant.qty < 1 && !product.pre_order) { toast.error(productTexts.stockOut || 'This variant is out of stock'); return; }
    }
    if (isInCart()) { toast.error(`${product.name} ${productTexts.alreadyInCart || 'already in cart'}`); return; }
    dispatch({
      type: 'ADD_TO_CART', payload: {
        id: product.id, product_id: product.id, product_name: product.name, product_slug: product.slug, name: product.name, slug: product.slug,
        preview_image: matchedVariant?.preview_image || product.preview_image, unit_price: product.unit_price,
        sale_price: product.variants?.length > 0 ? variantPrice : product.sale_price, quantity,
        total: quantity * (variantPrice > 0 ? variantPrice : product.sale_price > 0 ? product.sale_price : product.unit_price),
        attributes: selectedVariants, variant_id: matchedVariant?.product_variant_id ?? null,
        additional_price: matchedVariant?.additional_price ?? 0, stock: matchedVariant?.qty ?? product.stock,
      }
    });
    toast.success(productTexts.addedToCart || 'Added to cart!');
  };

  const handleOrderNow = () => { 
    if (!product) return;
    if (product.variants?.length > 0) {
      if (Object.keys(selectedVariants).length !== Object.keys(attributeOptions).length) { 
        setShowVariantError(true);
        return; 
      }
      if (!matchedVariant) { toast.error(productTexts.combinationNotAvailable || 'This combination is not available'); return; }
      if (matchedVariant.qty < 1 && !product.pre_order) { toast.error(productTexts.stockOut || 'This variant is out of stock'); return; }
    }
    if (!isInCart()) {
      dispatch({
        type: 'ADD_TO_CART', payload: {
          id: product.id, product_id: product.id, product_name: product.name, product_slug: product.slug, name: product.name, slug: product.slug,
          preview_image: matchedVariant?.preview_image || product.preview_image, unit_price: product.unit_price,
          sale_price: product.variants?.length > 0 ? variantPrice : product.sale_price, quantity,
          total: quantity * (variantPrice > 0 ? variantPrice : product.sale_price > 0 ? product.sale_price : product.unit_price),
          attributes: selectedVariants, variant_id: matchedVariant?.product_variant_id ?? null,
          additional_price: matchedVariant?.additional_price ?? 0, stock: matchedVariant?.qty ?? product.stock,
        }
      });
    }
    window.location.href = '/checkout'; 
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    const formData = new FormData(e.target);
    try {
      const response = await reviewPost(JSON.stringify({ name: formData.get('name'), email: formData.get('email'), review: formData.get('review'), rating: reviewRating, product_id: product.id, images: [] }));
      const data = await response.json();
      if (data.success) { toast.success(reviewTexts.reviewSubmitted || 'Review submitted!'); setShowReviewForm(false); setReviewRating(0); e.target.reset(); }
    } catch { toast.error(reviewTexts.reviewFailed || 'Failed to submit review'); }
    finally { setReviewSubmitting(false); }
  };

  if (loading || !mounted) return (
    <div className="py-8"><div className="container"><div className="grid md:grid-cols-2 gap-8 animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-xl" />
      <div className="space-y-4"><div className="h-8 bg-gray-200 rounded w-3/4" /><div className="h-6 bg-gray-200 rounded w-1/2" /><div className="h-20 bg-gray-200 rounded" /></div>
    </div></div></div>
  );

  if (!product) return <div className="py-16 text-center"><h2 className="text-2xl font-bold">{globalTexts.productNotFound || 'Product not found'}</h2></div>;

  const discountPercentage = product.sale_price > 0 ? Math.round(((product.unit_price - product.sale_price) / product.unit_price) * 100) : 0;
  const productImages = product.product_images || [];
  const displayPrice = product.variants?.length > 0 ? variantPrice : (product.sale_price > 0 ? product.sale_price : product.unit_price);
  const hasVariants = product.variants?.length > 0;
  const isFullSelection = hasVariants ? Object.keys(selectedVariants).length === Object.keys(attributeOptions).length : true;
  const isPartialSelection = hasVariants && Object.keys(selectedVariants).length > 0 && !isFullSelection;
  const currentStock = isPartialSelection ? (product.stock || 0) : (hasVariants ? variantStock : product.stock);
  const showStockStatus = !hasVariants || isFullSelection;
  const isButtonDisabled = currentStock < 1 && !product.pre_order;

  return (
    <div className="py-8">
      <div className="container">
        <div className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link>{' / '}
          <Link href="/collections" className="hover:text-primary-600">Shop</Link>{' / '}
          <span>{product.category}</span>{' / '}<span className="text-gray-900">{product.name}</span>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div>
            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
              <Image src={currentPreview || product.preview_image || '/images/no-available.svg'} alt={product.name} fill className="object-contain" />
              {discountPercentage > 0 && <span className="absolute top-4 left-4 bg-accent-500 text-white text-sm font-bold px-3 py-1 rounded">-{discountPercentage}%</span>}
            </div>
            {productImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((img, index) => (
                  <button key={index} onClick={() => handleThumbnailClick(img, index)} className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${activeThumbIndex === index ? 'border-primary-600' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Image src={img.preview_url || img.original_url} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-dark-900 mb-4">{product.name}{product.pre_order && <span className="text-gray-500 text-lg ml-2">(Pre Order)</span>}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => <FaStar key={i} className={`text-lg ${i < Math.floor(product.average_rating || 0) ? 'fill-current' : 'text-gray-300'}`} />)}</div>
              <span className="text-gray-600">({product.total_ratings || 0} {reviewTexts.totalRating || 'reviews'})</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary-600">৳{formatPrice(displayPrice)}</span>
              {product.sale_price > 0 && <span className="text-xl text-gray-400 line-through">৳{formatPrice(product.unit_price)}</span>}
            </div>
            {!product.pre_order && showStockStatus && (currentStock > 0 ? <p className="text-green-600 mb-4 flex items-center gap-2"><FiCheck /> {productTexts.inStock || 'In Stock'}</p> : <p className="text-red-600 mb-4">{productTexts.outOfStock || 'Out of Stock'}</p>)}
            {product.pre_order && <p className="text-green-700 mb-4">{productTexts.preOrderItem || 'This is a Pre-order item'}</p>}
            {product.summary && <div className="text-gray-700 mb-6 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.summary }} />}
            {Object.entries(attributeOptions).map(([key, values]) => {
              const isColor = key.toLowerCase() === 'color';
              return (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-semibold mb-2 capitalize">{key}:</label>
                  <div className="flex flex-wrap gap-2">
                    {values.map((value, idx) => {
                      const variant = getVariantByAttribute(key, value);
                      const vImg = variant?.preview_image || variant?.variant_images?.[0]?.preview_url;
                      const hasImg = vImg && !vImg.includes('placeholder');
                      const sel = selectedVariants[key] === value;
                      return (
                        <button key={idx} type="button" onClick={() => handleVariantChange(key, value)}
                          className={`transition ${isColor && hasImg ? `p-1 border-2 rounded-lg ${sel ? 'border-primary-600' : 'border-gray-300'}` : isColor && /^#[0-9A-F]{6}$/i.test(value) ? `w-8 h-8 rounded-full border-2 ${sel ? 'border-primary-600 ring-2 ring-primary-300' : 'border-gray-300'}` : `px-4 py-2 border-2 rounded-lg ${sel ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-gray-300'}`}`}
                          style={isColor && /^#[0-9A-F]{6}$/i.test(value) ? { backgroundColor: value } : {}}>
                          {isColor && hasImg ? <div className="w-14 h-14 relative"><Image src={vImg} alt={value} fill className="object-cover rounded" /></div> : isColor && /^#[0-9A-F]{6}$/i.test(value) ? null : value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {product.variants?.length > 0 && Object.keys(selectedVariants).length === Object.keys(attributeOptions).length && !matchedVariant && <p className="mb-4 text-sm text-red-600">{productTexts.combinationNotAvailable || 'This combination is not available.'}</p>}
            {showVariantError && <p className="mb-4 text-sm text-red-600">{productTexts.selectOptions || 'Please select all product options'}</p>}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm"><FiCheck className="text-green-500" /><span>{productTexts.freeShipping || 'Free shipping on orders over ৳5000'}</span></li>
                <li className="flex items-center gap-2 text-sm"><FiCheck className="text-green-500" /><span>{product.warranty || '1 year warranty'}</span></li>
              </ul>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">{productTexts.quantity || 'Quantity'}</label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"><FiMinus /></button>
                <span className="w-16 text-center font-semibold">{quantity}</span>
                <button type="button" onClick={() => { if (!product.pre_order && quantity >= currentStock) return; setQuantity(quantity + 1); }} className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"><FiPlus /></button>
              </div>
            </div>
            <div className="flex gap-3 mb-6">
              <button type="button" onClick={handleAddToCart} disabled={isButtonDisabled} className="theme-card-btn flex-1 py-4 border rounded-lg font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:text-gray-100 disabled:border-gray-400 transition-colors"><FiShoppingCart />{addBtnText}</button>
              <button type="button" onClick={handleOrderNow} disabled={isButtonDisabled} className="theme-btn flex-1 py-4 border rounded-lg font-semibold disabled:bg-gray-400 disabled:text-gray-100 disabled:border-gray-400 transition-colors">{productTexts.order || 'Order Now'}</button>
              <button className="w-14 h-14 border border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-500 transition-colors"><FiHeart className="text-xl" /></button>
            </div>
            <div className="border-t pt-6">
              <div className="flex items-center gap-3 text-gray-700"><FiTruck className="text-2xl text-primary-600" /><div><p className="font-semibold">{productTexts.freeDelivery || 'Free Delivery'}</p><p className="text-sm text-gray-600">{productTexts.deliveryDays || '3-5 business days'}</p></div></div>
            </div>
            <div className="border-t mt-6 pt-6">
              <h3 className="font-bold text-lg mb-4">{productTexts.productDetails || 'Product Details'}</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2"><span className="font-semibold w-32">{productTexts.detailsCategory || 'Category'}:</span><span>{product.category}</span></li>
                <li className="flex gap-2"><span className="font-semibold w-32">{productTexts.sku || 'SKU'}:</span><span>{product.sku_code}</span></li>
                {product.warranty && <li className="flex gap-2"><span className="font-semibold w-32">{productTexts.warranty || 'Warranty'}:</span><span>{product.warranty}</span></li>}
              </ul>
            </div>
            <div className="border-t mt-6 pt-6 flex items-center gap-4">
              <span className="font-semibold">{productTexts.share || 'Share'}:</span>
              <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"><FiShare2 /></button>
            </div>
          </div>
        </div>

        {product.description && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-dark-900 mb-6">{productTexts.description || 'Description'}</h2>
            <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}
        <div id="ratings" className="mb-16 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-2xl font-bold text-dark-900 mb-4 md:mb-0">{reviewTexts.ratingAndReview || 'Ratings & Reviews'}</h2>
            <button onClick={() => setShowReviewForm(!showReviewForm)} className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"><FiEdit2 />{reviewTexts.writeReview || 'Write a Review'}</button>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-10 p-6 bg-gray-50 rounded-xl">
            <div className="text-center">
              <h3 className="text-5xl font-bold text-gray-900">{product.average_rating || 0}</h3>
              <div className="flex justify-center my-2">{[...Array(5)].map((_, i) => <FaStar key={i} className={`text-xl ${i < Math.floor(product.average_rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} />)}</div>
              <p className="text-gray-600">{product.total_ratings || 0} ratings</p>
            </div>
            <div className="flex-1 w-full md:max-w-md">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = product[`total_${['one', 'two', 'three', 'four', 'five'][star - 1]}_stars`] || 0;
                const pct = product.total_ratings > 0 ? Math.round((count / product.total_ratings) * 100) : 0;
                const colors = ['#DC2B2B', '#FF9E2C', '#FF9E2C', '#FF9E2C', '#05C168'];
                return (
                  <div key={star} className="flex items-center gap-3 mb-2">
                    <span className="flex items-center gap-1 w-8 text-sm font-medium">{star} <FaStar className="text-xs" style={{ color: colors[star - 1] }} /></span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: colors[star - 1] }} /></div>
                    <span className="w-8 text-sm text-gray-600">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {showReviewForm && (
            <div className="mb-10 p-6 bg-white border rounded-xl max-w-2xl">
              <h3 className="text-xl font-semibold mb-6">{reviewTexts.productReview || 'Product Review'}</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-6 text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-3">{reviewTexts.yourRating || 'Your Rating'}:</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setReviewRating(star)} className="text-3xl hover:scale-110">
                        {star <= reviewRating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-yellow-400" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{reviewTexts.yourReview || 'Your Review'}</label>
                  <textarea name="review" rows="4" required className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder={reviewTexts.yourReview || 'Write your review...'} />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{reviewTexts.yourName || 'Your Name'}</label>
                  <input type="text" name="name" required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{reviewTexts.emailPhone || 'Email / Phone'}</label>
                  <input type="text" name="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                </div>
                <button type="submit" disabled={reviewSubmitting} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50">
                  {reviewSubmitting ? (reviewTexts.submitting || 'Submitting...') : (reviewTexts.submitReview || 'Submit Review')}
                </button>
              </form>
            </div>
          )}
          {product.reviews?.length > 0 && (
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <div className="flex items-center gap-4">
                      <p className="flex items-center gap-2 text-gray-800 font-medium"><FaRegUserCircle className="text-xl" />{review.name}</p>
                      <div className="flex">{[...Array(5)].map((_, i) => <FaStar key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />)}</div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 sm:mt-0">{review.created_at}</p>
                  </div>
                  <p className="text-gray-700">{review.review}</p>
                  {review.images?.length > 0 && (
                    <div className="flex gap-3 mt-4">{review.images.map((img, idx) => <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden"><Image src={img} alt="Review" width={80} height={80} className="object-cover w-full h-full" /></div>)}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-6">{productTexts.relatedProducts || 'Related Products'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{relatedProducts.map((prod) => <ProductCard key={prod.id} product={prod} />)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
