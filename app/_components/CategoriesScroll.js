'use client';

import { getAllCategories } from '@/_utils/getAllCategories';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CategoriesScroll = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories('en', false, false, true);
        setCategories(categoriesData.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-y border-gray-200 overflow-hidden">
      <div className="relative py-3">
        <div className="marquee-container">
          <div className="marquee-content">
            {/* First set of categories */}
            {categories.map((category) => (
              <Link
                key={`first-${category.id}`}
                href={`/collections/${category.slug}`}
                className="inline-block px-4 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-primary-600 whitespace-nowrap"
              >
                {category.name}
              </Link>
            ))}
            {/* Duplicate set for seamless loop */}
            {categories.map((category) => (
              <Link
                key={`second-${category.id}`}
                href={`/collections/${category.slug}`}
                className="inline-block px-4 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-primary-600 whitespace-nowrap"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          display: flex;
          overflow: hidden;
          user-select: none;
        }

        .marquee-content {
          display: flex;
          animation: scroll 30s linear infinite;
          will-change: transform;
        }

        .marquee-content:hover {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default CategoriesScroll;
