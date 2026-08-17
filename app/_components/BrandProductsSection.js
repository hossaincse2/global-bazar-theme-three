'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { useContext } from 'react';
import { ProductContext } from '@/_context/cartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ProductCard from './ProductCard';

import { getBrands } from '@/_utils/getBrands';
import { getAllProduct } from '@/_utils/getAllProduct';
import { formatPrice } from '@/_utils/formatNumber';
import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const BrandProductsSection = () => {
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [products, setProducts] = useState([]);
    const [loadingBrands, setLoadingBrands] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const { language, dictionary } = useDictionary();
    const { siteSetting } = useSiteSetting();
    const { dispatch } = useContext(ProductContext);
    const router = useRouter();
    const currency = siteSetting?.currency_icon || '৳';
    const productDetailsTexts = dictionary?.ProductDetails || {};

    const brandSwiperRef = useRef(null);
    const productSwiperRef = useRef(null);

    console.log('BRANDS STATE:', brands);
    console.log('SELECTED BRAND:', selectedBrand);
    console.log('PRODUCTS STATE:', products);

    useEffect(() => {
        const fetchBrandsData = async () => {
            try {
                const response = await getBrands(language);
                const brandsData = response?.data || [];
                setBrands(brandsData);
                // Do not auto-select a brand, leave it null to show all products first
            } catch (error) {
                console.error('Error fetching brands:', error);
            } finally {
                setLoadingBrands(false);
            }
        };
        fetchBrandsData();
    }, [language]);

    useEffect(() => {
        const fetchProductsData = async () => {
            setLoadingProducts(true);
            try {
                // Fetch products specifically for the selected brand, or all products if none selected
                const brandParam = selectedBrand ? selectedBrand.id : 'all';
                const response = await getAllProduct(language, 'all', '', null, '', 1, 10, brandParam);
                setProducts(response?.data || []);
            } catch (error) {
                console.error('Error fetching brand products:', error);
            } finally {
                setLoadingProducts(false);
            }
        };
        fetchProductsData();
    }, [selectedBrand, language]);

    const handleAddToCart = (product, e) => {
        e?.preventDefault();
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

    const handleBuyNow = (product, e) => {
        e?.preventDefault();
        handleAddToCart(product);
        router.push('/checkout');
    };

    if (loadingBrands) return null;

    return (
        <section className="py-12 bg-white overflow-hidden">
            <div className="container">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop By Brands</h2>
                </div>

                {/* Brand Tabs Slider */}
                <div className="relative mb-12 border-b border-gray-100">
                    <div className="flex items-center">
                        <div className="flex-1 overflow-hidden pr-20">
                            <Swiper
                                modules={[Navigation, Autoplay]}
                                spaceBetween={40}
                                slidesPerView="auto"
                                className="brand-tabs-swiper"
                                onSwiper={(swiper) => (brandSwiperRef.current = swiper)}
                            >
                                {brands.map((brand) => {
                                    const brandImg = brand.media?.[0]?.original_url || brand.image || brand.logo;
                                    return (
                                        <SwiperSlide key={brand.id} className="!w-auto">
                                            <button
                                                onClick={() => setSelectedBrand(brand)}
                                                className={`flex flex-col items-center gap-2 py-4 px-2 transition-all relative group/brand-tab ${selectedBrand?.id === brand.id
                                                    ? 'scale-110'
                                                    : 'hover:scale-105'
                                                    }`}
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    {brandImg ? (
                                                        <div className="w-20 h-10 relative transition-all duration-300">
                                                            <Image
                                                                src={brandImg}
                                                                alt={brand.name}
                                                                fill
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="h-10 flex items-center justify-center px-4">
                                                            <span className={`text-lg font-black uppercase tracking-tighter ${selectedBrand?.id === brand.id ? 'text-gray-900' : 'text-gray-400 group-hover/brand-tab:text-gray-600'}`}>
                                                                {brand.name}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {brandImg && (
                                                        <span className={`text-xs font-bold uppercase tracking-wider ${selectedBrand?.id === brand.id ? 'text-gray-900' : 'text-gray-500 group-hover/brand-tab:text-gray-700'}`}>
                                                            {brand.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full transition-all duration-300 ${selectedBrand?.id === brand.id ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover/brand-tab:opacity-100 group-hover/brand-tab:scale-x-75'}`} />
                                            </button>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </div>

                        {/* Show All Link */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white pl-4 pr-1 z-10 flex items-center gap-2 shadow-[-10px_0_15px_-10px_white]">
                            <button
                                onClick={() => brandSwiperRef.current?.slideNext()}
                                className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-primary-600 border border-gray-100 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 transition-colors"
                            >
                                <FiChevronRight className="text-xl" />
                            </button>
                            <Link href="/collections" className="text-primary-600 text-xs md:text-sm font-semibold flex items-center hover:underline whitespace-nowrap">
                                Show All <FiChevronRight className="ml-0.5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Products Slider */}
                <div className="relative group">
                    {loadingProducts ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl shadow-sm h-80 animate-pulse" />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <Swiper
                                modules={[Navigation]}
                                spaceBetween={24}
                                slidesPerView={2}
                                breakpoints={{
                                    640: { slidesPerView: 3 },
                                    1024: { slidesPerView: 4 },
                                    1280: { slidesPerView: 5 },
                                }}
                                onSwiper={(swiper) => (productSwiperRef.current = swiper)}
                                className="pb-4"
                            >
                                {products.map((product) => (
                                    <SwiperSlide key={product.id}>
                                        <ProductCard product={product} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Navigation Buttons */}
                            <button
                                onClick={() => productSwiperRef.current?.slidePrev()}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white shadow-lg border border-gray-100 rounded-full flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-10 hover:bg-primary-600 hover:text-white"
                            >
                                <FiChevronLeft size={24} />
                            </button>
                            <button
                                onClick={() => productSwiperRef.current?.slideNext()}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 bg-white shadow-lg border border-gray-100 rounded-full flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-10 hover:bg-primary-600 hover:text-white"
                            >
                                <FiChevronRight size={24} />
                            </button>
                        </>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500">No products found for this brand.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BrandProductsSection;
