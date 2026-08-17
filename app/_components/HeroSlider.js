'use client';

import useDictionary from '@/_hooks/useDictionary';
import { getAllCategories } from '@/_utils/getAllCategories';
import { getHeroImage } from '@/_utils/getHeroImage';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useContext } from 'react';
import { FiChevronLeft, FiChevronRight, FiShoppingBag } from 'react-icons/fi';
import { IoChevronForward } from 'react-icons/io5';
import { ThemeOptionsContext } from '../_context/ThemeOptionsContext';

const HeroSlider = () => {
  const { language, dictionary } = useDictionary();
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const { themeOptions } = useContext(ThemeOptionsContext);

  const primaryColor = themeOptions?.base_colors?.primary_color || '#0ea5e9';
  const primaryLight = `${primaryColor}15`; // 15% opacity for hover background

  const headerTexts = dictionary?.Header || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroData, categoriesData] = await Promise.all([
          getHeroImage(),
          getAllCategories(language, true, false, true),
        ]);
        setImages(heroData?.data || []);
        setCategories(categoriesData?.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  useEffect(() => {
    const displayCount = images && images.length > 0 ? images.length : 1;
    if (displayCount > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % displayCount);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [images]);

  const nextSlide = () => {
    const displayCount = images && images.length > 0 ? images.length : 1;
    setCurrentSlide((prev) => (prev + 1) % displayCount);
  };

  const prevSlide = () => {
    const displayCount = images && images.length > 0 ? images.length : 1;
    setCurrentSlide((prev) => (prev - 1 + displayCount) % displayCount);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 py-4">
        <div className="container">
          <div className="flex gap-4">
            <div className="hidden lg:block w-64 h-[400px] bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex-1 h-[300px] md:h-[350px] lg:h-[400px] bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Default slide when no API data
  const defaultSlide = {
    id: 'default',
    image_url: '/images/default_slide.jpg',
    title: 'Welcome to Our Store',
    subtitle: 'Discover amazing products at great prices',
    url: '/collections'
  };

  // Use default slide if no images from API
  const displayImages = images && images.length > 0 ? images : [defaultSlide];

  return (
    <div className="bg-gray-50 py-4">
      <div className="container">
        <div className="flex gap-4">
          {/* Category Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0 relative z-40" onMouseLeave={() => setHoveredCategory(null)}>
            <div className="bg-white rounded-lg shadow-sm">
              <nav
                className="h-[300px] md:h-[350px] lg:h-[400px] overflow-y-auto custom-scrollbar"
                style={{ '--primary-color': primaryColor }}
              >
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="group"
                    onMouseEnter={() => setHoveredCategory(category.id)}
                  >
                    <Link
                      href={`/collections/${category.slug}`}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition ${index !== categories.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      style={{
                        backgroundColor: hoveredCategory === category.id ? primaryLight : 'transparent',
                        color: hoveredCategory === category.id ? primaryColor : '#374151'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = primaryLight;
                        e.currentTarget.style.color = primaryColor;
                      }}
                      onMouseLeave={(e) => {
                        if (hoveredCategory !== category.id) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#374151';
                        }
                      }}
                    >
                      {category.category_image && (
                        <div className="w-5 h-5 relative flex-shrink-0">
                          <img
                            src={category.category_image}
                            alt={category.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <span className="flex-1">{category.name}</span>
                      {category.sub_category && category.sub_category.length > 0 && (
                        <IoChevronForward style={{ color: hoveredCategory === category.id ? primaryColor : '#9ca3af' }} />
                      )}
                    </Link>
                  </div>
                ))}
              </nav>
            </div>

            {/* Submenu Portal/Overlay (Rendered outside the scroll container to prevent clipping) */}
            {hoveredCategory && (() => {
              const activeCat = categories.find(c => c.id === hoveredCategory);
              if (!activeCat?.sub_category || activeCat.sub_category.length === 0) return null;

              return (
                <div
                  className="absolute left-full top-0 w-68 bg-white shadow-2xl border border-gray-200 rounded-lg py-2 z-[100] min-h-[400px] ml-1"
                  onMouseEnter={() => setHoveredCategory(activeCat.id)}
                >
                  <div className="px-4 py-2 mb-2 font-bold text-xs uppercase text-gray-400 tracking-widest border-b border-gray-50">
                    {activeCat.name}
                  </div>
                  <div
                    className="max-h-[380px] overflow-y-auto custom-scrollbar"
                    style={{ '--primary-color': primaryColor }}
                  >
                    {activeCat.sub_category.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/collections/${sub.slug}`}
                        className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 transition"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = primaryLight;
                          e.currentTarget.style.color = primaryColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#374151';
                        }}
                      >
                        {sub.category_image && (
                          <div className="w-6 h-6 relative flex-shrink-0">
                            <img
                              src={sub.category_image}
                              alt={sub.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <span className="font-medium">{sub.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}
          </aside>

          {/* Hero Slider */}
          <div className="flex-1 relative h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden bg-gray-900 rounded-lg shadow-sm">
            {/* Slides */}
            {displayImages.map((image, index) => (
              <div
                key={image.id}
                className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                {/* Background Image */}
                <Image
                  src={image.image_url}
                  alt={image.title || 'Hero Banner'}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}

            {/* Navigation Arrows */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition z-20"
                  aria-label="Previous slide"
                >
                  <FiChevronLeft className="text-lg md:text-xl" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition z-20"
                  aria-label="Next slide"
                >
                  <FiChevronRight className="text-lg md:text-xl" />
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {displayImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-1.5 h-1.5 rounded-full transition ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
