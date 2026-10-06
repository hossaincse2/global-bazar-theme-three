'use client';

import { useState, useEffect, useRef, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { ProductContext } from '@/_context/cartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { getAllProduct } from '@/_utils/getAllProduct';
import { formatPrice } from '@/_utils/formatNumber';
import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import ProductCard from './ProductCard';

const ProductSliderSection = ({ title, sortBy, bgColor = "bg-white" }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { language, dictionary } = useDictionary();
    const { siteSetting } = useSiteSetting();
    const { dispatch } = useContext(ProductContext);
    const router = useRouter();
    const productSwiperRef = useRef(null);
    const productDetailsTexts = dictionary?.ProductDetails || {};

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getAllProduct(language, 'all', '', sortBy, '', 1, 10, 'all');
                setProducts(response?.data || []);
            } catch (error) {
                console.error(`Error fetching ${title} products:`, error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [language, sortBy, title]);

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

    if (!loading && products.length === 0) return null;

    return (
        <section className={`py-12 ${bgColor} overflow-hidden`}>
            <div className="container">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
                    <Link href="/collections" className="text-primary-600 text-sm font-semibold flex items-center gap-1 hover:underline">
                        Show All <FiChevronRight />
                    </Link>
                </div>

                {/* Products Slider */}
                <div className="relative group">
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl shadow-sm h-96 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <>
                            <Swiper
                                modules={[Navigation, Autoplay]}
                                spaceBetween={24}
                                slidesPerView={2}
                                autoplay={{
                                    delay: 3500,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                loop={products.length > 5}
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

                            {/* Navigation Arrows */}
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
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductSliderSection;
