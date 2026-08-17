'use client';

import useDictionary from '@/_hooks/useDictionary';

const BrandsSection = () => {
  const { dictionary } = useDictionary();
  const brandTexts = dictionary?.Brands || {};

  const brands = [
    'Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Asus',
    'Microsoft', 'Canon', 'Nikon', 'Panasonic'
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {brandTexts.topBrands || 'Top Brands'}
          </h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-4">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-center hover:border-primary-500 hover:shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="font-semibold text-gray-700 group-hover:text-primary-600 transition-colors duration-300 relative z-10 text-sm md:text-base">
                {brand}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="inline-flex items-center px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200">
            {brandTexts.viewAllBrands || 'View All Brands'}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
