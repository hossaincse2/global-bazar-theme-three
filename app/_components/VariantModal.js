'use client';

import { ProductContext } from '@/_context/cartContext';
import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import { formatPrice } from '@/_utils/formatNumber';
import { getProduct } from '@/_utils/getAllProduct';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { FiMinus, FiPlus, FiShoppingCart, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const VariantModal = ({ product, isOpen, onClose }) => {
    const { dispatch, state } = useContext(ProductContext);
    const { siteSetting } = useSiteSetting();
    const { language, dictionary } = useDictionary();
    const [fullProduct, setFullProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariants, setSelectedVariants] = useState({});
    const [matchedVariant, setMatchedVariant] = useState(null);
    const [variantPrice, setVariantPrice] = useState(0);
    const [variantStock, setVariantStock] = useState(0);
    const [currentPreview, setCurrentPreview] = useState(null);
    const [activeThumbIndex, setActiveThumbIndex] = useState(0);

    const productTexts = dictionary?.ProductDetails || {};
    const currency = siteSetting?.currency_icon || siteSetting?.currency || '৳';

    useEffect(() => {
        if (product && isOpen) {
            const fetchFullProduct = async () => {
                setLoading(true);
                try {
                    const data = await getProduct(language, product.slug, null, false);
                    if (data?.data) {
                        setFullProduct(data.data);
                        setVariantPrice(data.data.sale_price || data.data.unit_price || 0);
                        setVariantStock(data.data.stock || 0);
                        setCurrentPreview(data.data.preview_image || data.data.image);
                    }
                } catch (error) {
                    console.error("Failed to fetch product details:", error);
                    // Fallback to basic product info
                    setFullProduct(product);
                    setVariantPrice(product.sale_price || product.unit_price || 0);
                    setVariantStock(product.stock || 0);
                    setCurrentPreview(product.preview_image || product.image);
                } finally {
                    setLoading(false);
                }
            };

            fetchFullProduct();
            setSelectedVariants({});
            setMatchedVariant(null);
            setQuantity(1);
            setActiveThumbIndex(0);
        } else {
            setFullProduct(null);
        }
    }, [product, isOpen, language]);

    const getAttributeOptions = () => {
        const targetProduct = fullProduct || product;
        if (!targetProduct?.variants?.length) return {};
        const attributesMap = {};
        targetProduct.variants.forEach((variant) => {
            Object.entries(variant.attributes || {}).forEach(([key, value]) => {
                if (!attributesMap[key]) attributesMap[key] = new Set();
                attributesMap[key].add(value);
            });
        });
        return Object.fromEntries(Object.entries(attributesMap).map(([key, set]) => [key, [...set]]));
    };

    const attributeOptions = getAttributeOptions();
    const targetProduct = fullProduct || product;
    const getVariantByAttribute = (key, value) => targetProduct?.variants?.find((v) => v.attributes?.[key] === value);

    const handleVariantChange = (key, value) => {
        const updated = { ...selectedVariants, [key]: value };
        setSelectedVariants(updated);

        // Find matching variant
        const found = targetProduct?.variants?.find((v) =>
            Object.entries(v.attributes || {}).every(([k, val]) => updated[k] === val)
        );

        if (found) {
            setMatchedVariant(found);
            setVariantStock(found.qty);
            setVariantPrice((product.sale_price || product.unit_price || 0) + (found.additional_price || 0));

            const variantImage = found.preview_image || found.variant_images?.[0]?.preview_url;
            if (variantImage && !variantImage.includes('placeholder')) {
                setCurrentPreview(variantImage);
            }
        } else {
            setMatchedVariant(null);
            setVariantStock(0);
            setVariantPrice(product?.sale_price || product?.unit_price || 0);
        }
    };

    const handleThumbnailClick = (image, index) => {
        setCurrentPreview(image.original_url || image.preview_url || image);
        setActiveThumbIndex(index);
    };

    const isInCart = () => state.cartItems.some((item) =>
        item.id === product.id && item.variant_id === (matchedVariant?.product_variant_id ?? null)
    );

    const handleAddToCart = () => {
        if (!product) return;

        if (Object.keys(selectedVariants).length !== Object.keys(attributeOptions).length) {
            toast.error(productTexts.selectOptions || 'Please select all product options');
            return;
        }

        if (!matchedVariant) {
            toast.error(productTexts.combinationNotAvailable || 'This combination is not available');
            return;
        }

        if (matchedVariant.qty < 1 && !product.pre_order) {
            toast.error(productTexts.stockOut || 'This variant is out of stock');
            return;
        }

        if (isInCart()) {
            toast.error(`${product.name} ${productTexts.alreadyInCart || 'already in cart'}`);
            return;
        }

        dispatch({
            type: 'ADD_TO_CART',
            payload: {
                id: product.id,
                product_id: product.id,
                product_name: product.name,
                product_slug: product.slug,
                name: product.name,
                slug: product.slug,
                preview_image: matchedVariant?.preview_image || product.preview_image,
                unit_price: product.unit_price,
                sale_price: variantPrice,
                quantity,
                total: quantity * variantPrice,
                attributes: selectedVariants,
                variant_id: matchedVariant?.product_variant_id ?? null,
                additional_price: matchedVariant?.additional_price ?? 0,
                stock: matchedVariant?.qty ?? product.stock,
            }
        });

        toast.success(productTexts.addedToCart || 'Added to cart!');
        onClose();
    };

    if (!isOpen || !product) return null;

    const productImages = targetProduct?.product_images || [];

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px]">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {loading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-900 transition-colors z-[60] bg-gray-50 rounded-full"
                >
                    <FiX size={16} />
                </button>

                <div className="flex flex-col md:flex-row max-h-[85vh] overflow-hidden">
                    {/* Left Column: Image Explorer */}
                    <div className="md:w-[42%] bg-gray-50 flex flex-col gap-3 overflow-y-auto border-r border-gray-100 p-4">
                        <div className="relative aspect-square w-full bg-white rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                                src={currentPreview || '/images/no-available.svg'}
                                alt={targetProduct?.name || product.name}
                                fill
                                priority
                                className="object-contain p-2"
                            />
                        </div>
                        {/* Thumbnails */}
                        {productImages.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 justify-center pb-2">
                                {productImages.slice(0, 6).map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleThumbnailClick(img, index)}
                                        className={`relative w-10 h-10 rounded-md overflow-hidden border-2 transition-all duration-200
                      ${activeThumbIndex === index ? 'border-primary-600 shadow-sm' : 'border-white hover:border-gray-100'}`}
                                    >
                                        <Image src={img.preview_url || img.original_url} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Details & Options */}
                    <div className="md:w-[58%] p-5 md:p-6 flex flex-col overflow-y-auto">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-gray-900 mb-1.5 leading-tight">
                                {targetProduct?.name || product.name}
                            </h2>
                            <div className="flex items-center gap-2.5 mb-1.5">
                                <span className="text-xl font-bold text-primary-600">
                                    {currency}{formatPrice(variantPrice)}
                                </span>
                                {(product.sale_price > 0 && !matchedVariant) && (
                                    <span className="text-xs text-gray-400 line-through">
                                        {currency}{formatPrice(product.unit_price)}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <div className={`w-1 h-1 rounded-full ${variantStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${variantStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {variantStock > 0 ? `${variantStock} In Stock` : 'Out of stock'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-5 flex-1">
                            {Object.entries(attributeOptions).map(([key, values]) => {
                                const isColor = key.toLowerCase() === 'color';
                                return (
                                    <div key={key}>
                                        <label className="block text-[10px] font-bold text-gray-400 mb-2.5 uppercase tracking-widest">{key}</label>
                                        <div className="flex flex-wrap gap-2">
                                            {values.map((value, idx) => {
                                                const variant = getVariantByAttribute(key, value);
                                                const vImg = variant?.preview_image || variant?.variant_images?.[0]?.preview_url;
                                                const hasImg = vImg && !vImg.includes('placeholder');
                                                const sel = selectedVariants[key] === value;
                                                const isHex = isColor && /^#[0-9A-F]{6}$/i.test(value);

                                                return (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => handleVariantChange(key, value)}
                                                        className={`transition-all duration-200 relative
                              ${isColor && hasImg
                                                                ? `p-0.5 border-2 rounded-lg overflow-hidden w-11 h-11 ${sel ? 'border-primary-600 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`
                                                                : isHex
                                                                    ? `w-7 h-7 rounded-full border-2 ${sel ? 'border-primary-600 ring-2 ring-primary-50' : 'border-gray-200 hover:border-gray-300'}`
                                                                    : `px-2.5 py-1 border-2 rounded-lg text-[10px] font-bold uppercase tracking-tight ${sel ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-white'}`
                                                            }`}
                                                        style={isHex ? { backgroundColor: value } : {}}
                                                        title={value}
                                                    >
                                                        {isColor && hasImg ? (
                                                            <div className="relative w-full h-full rounded-md overflow-hidden">
                                                                <Image src={vImg} alt={value} fill className="object-cover" />
                                                            </div>
                                                        ) : isHex ? (
                                                            sel && <div className="absolute inset-0 flex items-center justify-center"><div className="w-1 h-1 bg-white rounded-full"></div></div>
                                                        ) : value}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Quantity</label>
                                <div className="inline-flex items-center border border-gray-100 rounded-lg p-0.5 bg-gray-50/50">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-7 h-7 flex items-center justify-center hover:bg-white hover:text-primary-600 hover:shadow-sm rounded transition-all"
                                    >
                                        <FiMinus size={12} />
                                    </button>
                                    <span className="w-8 text-center font-bold text-sm text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => (variantStock > quantity || product.pre_order) && setQuantity(quantity + 1)}
                                        className="w-7 h-7 flex items-center justify-center hover:bg-white hover:text-primary-600 hover:shadow-sm rounded transition-all"
                                    >
                                        <FiPlus size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-5 border-t border-gray-50">
                            <button
                                onClick={handleAddToCart}
                                disabled={variantStock < 1 && !product.pre_order}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary-50 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                            >
                                <FiShoppingCart size={14} /> {productTexts.addToCart || 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VariantModal;
