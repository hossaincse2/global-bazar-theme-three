'use client';

import useDictionary from '@/_hooks/useDictionary';
import { getAllProduct } from '@/_utils/getAllProduct';
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language, dictionary } = useDictionary();
  const globalTexts = dictionary?.Global || {};

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProduct(language, 'all', '', 'new_arrival', '', 1, 8, 'all', null, false);
        setProducts(data?.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [language]);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-3">
            {globalTexts.latestProduct || 'Latest Products'}
          </h2>
          <p className="text-gray-600">{globalTexts.latestProductDesc || 'Check out our newest arrivals'}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestProducts;
