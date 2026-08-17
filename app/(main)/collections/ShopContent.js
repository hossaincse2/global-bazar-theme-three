'use client';

import ProductCard from '@/_components/ProductCard';
import { ProductContext } from '@/_context/cartContext';
import { ThemeOptionsContext } from '@/_context/ThemeOptionsContext';
import useDictionary from '@/_hooks/useDictionary';
import { getAllCategories } from '@/_utils/getAllCategories';
import { getAllProduct } from '@/_utils/getAllProduct';
import { getBrands } from '@/_utils/getBrands';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { formatPrice } from '@/_utils/formatNumber';
import { FiFilter, FiGrid, FiHeart, FiList, FiLoader, FiShoppingCart, FiStar, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import * as Slider from '@radix-ui/react-slider';

// Professional List View Card Component
const ProductListCard = ({ product, dictionary, currency }) => {
  const { dispatch } = useContext(ProductContext);
  const router = useRouter();
  const { themeOptions } = useContext(ThemeOptionsContext);
  const productCardTexts = dictionary?.ProductCard || {};
  const productDetailsTexts = dictionary?.ProductDetails || {};

  const addBtnText = themeOptions?.button_settings?.card_button_text || productCardTexts.addToCart || 'Add to Cart';

  const handleAddToCart = (e) => {
    e?.preventDefault();
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
    toast.success(productDetailsTexts.addedToCart || 'Added to cart!');
  };

  const handleBuyNow = (e) => {
    e?.preventDefault();
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

  const discountPercentage = product.sale_price > 0
    ? Math.round(((product.unit_price - product.sale_price) / product.unit_price) * 100)
    : 0;
  const displayPrice = product.sale_price > 0 ? product.sale_price : product.unit_price;

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <Link href={`/products/${product.slug}`} className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-56 md:w-64 flex-shrink-0">
          <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden bg-gray-100">
            <Image src={product.preview_image || product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            {discountPercentage > 0 && (
              <span className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded">-{discountPercentage}%</span>
            )}
          </div>
        </div>
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            {product.category && <p className="text-xs text-primary-600 font-medium mb-1 uppercase tracking-wide">{product.category}</p>}
            <h3 className="text-lg font-semibold text-dark-900 mb-2 group-hover:text-primary-600 transition line-clamp-2">{product.name}</h3>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (<FiStar key={i} className={`text-sm ${i < Math.floor(product.average_rating || 0) ? 'fill-current' : ''}`} />))}
              </div>
              <span className="text-sm text-gray-500">({product.total_ratings || 0})</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-primary-600">{currency}{formatPrice(displayPrice)}</span>
              {product.sale_price > 0 && <span className="text-base text-gray-400 line-through">{currency}{formatPrice(product.unit_price)}</span>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={(e) => { e.preventDefault(); /* Wishlist handler to be added if needed */ }} className="p-2.5 border border-gray-300 rounded-lg hover:border-primary-600 hover:text-primary-600 transition" title="Wishlist"><FiHeart className="text-lg" /></button>
              <button
                onClick={handleAddToCart}
                className="theme-card-btn flex items-center gap-2 px-5 py-2.5 rounded-lg border font-medium transition duration-300 shadow-sm"
              >
                <FiShoppingCart />{addBtnText}
              </button>
              <button
                onClick={handleBuyNow}
                className="theme-btn flex items-center gap-2 px-5 py-2.5 rounded-lg border font-medium transition duration-300 shadow-sm"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};


const FilterSidebar = ({
  filterTexts,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minAllowedPrice,
  maxAllowedPrice,
  setAppliedMinPrice,
  setAppliedMaxPrice,
  categories,
  selectedCategory,
  handleCategoryChange,
  brands,
  selectedBrand,
  handleBrandChange,
  clearFilters
}) => (
  <div className="space-y-6">
    {/* Price Range */}
    <div>
      <h3 className="font-bold text-lg mb-4 text-dark-900">{filterTexts.price || 'Price Range'}</h3>

      {/* Dual Range Slider (Radix) */}
      <div className="mb-8 mt-6 px-2">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[Number(minPrice) || minAllowedPrice, Number(maxPrice) || maxAllowedPrice]}
          max={maxAllowedPrice}
          min={minAllowedPrice}
          step={500}
          minStepsBetweenThumbs={1}
          onValueChange={(values) => {
            setMinPrice(values[0]);
            setMaxPrice(values[1]);
          }}
        >
          <Slider.Track className="bg-gray-200 relative grow rounded-full h-1.5">
            <Slider.Range className="absolute bg-primary-600 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-5 h-5 bg-white border-2 border-primary-600 shadow-[0_2px_10px] shadow-black/10 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-colors cursor-grab active:cursor-grabbing"
            aria-label="Minimum price"
          />
          <Slider.Thumb
            className="block w-5 h-5 bg-white border-2 border-primary-600 shadow-[0_2px_10px] shadow-black/10 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-colors cursor-grab active:cursor-grabbing"
            aria-label="Maximum price"
          />
        </Slider.Root>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-full relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">৳</span>
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')} className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary-500 text-sm font-medium text-gray-700 disabled:bg-gray-50" />
        </div>
        <span className="text-gray-400 font-medium">-</span>
        <div className="w-full relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">৳</span>
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')} className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary-500 text-sm font-medium text-gray-700 disabled:bg-gray-50" />
        </div>
      </div>
      <button
        onClick={() => {
          const finalMin = Math.max(minAllowedPrice, Math.min(Number(minPrice), maxAllowedPrice - 500));
          const finalMax = Math.max(finalMin + 500, Math.min(Number(maxPrice), maxAllowedPrice));
          setMinPrice(finalMin);
          setMaxPrice(finalMax);
          setAppliedMinPrice(finalMin);
          setAppliedMaxPrice(finalMax);
        }}
        className="w-full py-2 bg-gray-900 hover:bg-black text-white rounded-lg transition text-sm font-medium"
      >
        Apply Price
      </button>
    </div>

    {/* Categories */}
    <div>
      <h3 className="font-bold text-lg mb-4 text-dark-900">{filterTexts.categories || 'Categories'}</h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {categories.map((cat) => (
          <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600">
            <input type="checkbox" checked={selectedCategory === cat.slug} onChange={() => handleCategoryChange(cat)} className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" />
            <span className={`text-sm ${selectedCategory === cat.slug ? 'font-semibold text-primary-600' : ''}`}>{cat.name}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Brands */}
    <div>
      <h3 className="font-bold text-lg mb-4 text-dark-900">{filterTexts.brands || 'Brands'}</h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {brands.map((brand) => (
          <label key={brand.id} className="flex items-center gap-2 cursor-pointer hover:text-primary-600">
            <input type="checkbox" checked={selectedBrand === String(brand.id)} onChange={() => handleBrandChange(String(brand.id))} className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" />
            <span className={`text-sm ${selectedBrand === String(brand.id) ? 'font-semibold text-primary-600' : ''}`}>{brand.name}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Clear Filters */}
    <button onClick={clearFilters} className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">{filterTexts.clearAll || 'Clear All Filters'}</button>
  </div>
);

const ShopContent = ({ category = null }) => {
  const router = useRouter();
  const { language, dictionary } = useDictionary();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentCategory, setCurrentCategory] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const perPage = 12;

  // Filters
  const minAllowedPrice = 10;
  const maxAllowedPrice = 200000;
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('all');
  const [minPrice, setMinPrice] = useState(minAllowedPrice);
  const [maxPrice, setMaxPrice] = useState(maxAllowedPrice);
  const [appliedMinPrice, setAppliedMinPrice] = useState(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(null);

  // Refs
  const loaderRef = useRef(null);
  const isLoadingRef = useRef(false);

  // Dictionary texts
  const filterTexts = dictionary?.Filter || {};
  const sortTexts = dictionary?.ProductCard?.SortBy || {};
  const globalTexts = dictionary?.Global || {};
  const currency = '৳';

  // Sort options from dictionary
  const sortOptions = [
    { value: 'all', label: sortTexts.all || 'All Product' },
    { value: 'new_arrival', label: sortTexts.newArrival || 'New Arrival' },
    { value: 'best_selling', label: sortTexts.bestSelling || 'Best Selling' },
    { value: 'discount', label: sortTexts.discount || 'Offer' },
  ];

  // Fetch categories and brands on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          getAllCategories(language, false, false, true),
          getBrands(),
        ]);
        setCategories(categoriesData?.data || []);
        setBrands(brandsData?.data || []);

        if (category && categoriesData?.data) {
          const found = categoriesData.data.find(cat => cat.slug === category);
          setCurrentCategory(found);
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, [category, language]);


  // Fetch products
  const fetchProducts = useCallback(async (pageNum = 1, append = false) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const categoryParam = selectedCategory || '';
      const sortParam = sortBy === 'all' ? null : sortBy;

      const productsData = await getAllProduct(
        language,
        categoryParam,
        '',
        sortParam,
        '',
        pageNum,
        perPage,
        selectedBrand,
        null, // token
        false, // isRetailer
        appliedMinPrice,
        appliedMaxPrice
      );

      const newProducts = productsData?.data || [];
      const total = productsData?.meta?.total || productsData?.total || 0;

      setTotalProducts(total);

      if (append && pageNum > 1) {
        setProducts(prev => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
      }

      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [selectedCategory, selectedBrand, sortBy, language, appliedMinPrice, appliedMaxPrice]);

  // Initial fetch and when filters change
  useEffect(() => {
    setPage(1);
    fetchProducts(1, false);
  }, [selectedCategory, selectedBrand, sortBy, appliedMinPrice, appliedMaxPrice]);

  // Infinite scroll
  useEffect(() => {
    if (products.length >= totalProducts || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && !isLoadingRef.current) {
          fetchProducts(page + 1, true);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => { if (loaderRef.current) observer.unobserve(loaderRef.current); };
  }, [loading, loadingMore, page, products.length, totalProducts, fetchProducts]);


  // Handle category selection
  const handleCategoryChange = (cat) => {
    if (selectedCategory === cat.slug) {
      setSelectedCategory(null);
      setCurrentCategory(null);
      router.push('/collections');
    } else {
      setSelectedCategory(cat.slug);
      setCurrentCategory(cat);
      router.push(`/collections/${cat.slug}`);
    }
  };

  // Handle brand selection
  const handleBrandChange = (brandId) => {
    setSelectedBrand(selectedBrand === brandId ? 'all' : brandId);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setCurrentCategory(null);
    setSelectedBrand('all');
    setSortBy('all');
    setMinPrice(minAllowedPrice);
    setMaxPrice(maxAllowedPrice);
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
    router.push('/collections');
  };




  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link>{' / '}
          <Link href="/collections" className="hover:text-primary-600">Shop</Link>
          {currentCategory ? (
            <>{' / '}<span className="text-gray-900">{currentCategory.name}</span></>
          ) : category ? (
            <>{' / '}<span className="text-gray-900 capitalize">{category.replace(/-/g, ' ')}</span></>
          ) : null}
        </div>



        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
              <FiFilter />{filterTexts.filters || 'Filters'}
            </button>

            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-dark-900 leading-tight">
                {currentCategory?.name || (category ? category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : (globalTexts.all || 'All Products'))}
              </h1>
              <p className="text-xs text-gray-500">
                {loading ? (globalTexts.loading || 'Loading...') : `${filterTexts.showingProducts?.replace('{count}', products.length).replace('{total}', totalProducts) || `Showing ${products.length} of ${totalProducts} products`}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium whitespace-nowrap">{sortTexts.sortBy || 'Sort By'}:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-gray-50">
                {sortOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
              </select>
            </div>

            <div className="hidden md:flex items-center gap-1 border border-gray-300 rounded-lg p-1 bg-gray-50">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded transition ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}><FiGrid size={18} /></button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded transition ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}><FiList size={18} /></button>
            </div>
          </div>
        </div>


        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white p-6 rounded-lg shadow-sm">
              <FilterSidebar
                filterTexts={filterTexts}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                minAllowedPrice={minAllowedPrice}
                maxAllowedPrice={maxAllowedPrice}
                setAppliedMinPrice={setAppliedMinPrice}
                setAppliedMaxPrice={setAppliedMaxPrice}
                categories={categories}
                selectedCategory={selectedCategory}
                handleCategoryChange={handleCategoryChange}
                brands={brands}
                selectedBrand={selectedBrand}
                handleBrandChange={handleBrandChange}
                clearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Mobile Sidebar */}
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{filterTexts.filters || 'Filters'}</h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><FiX className="text-xl" /></button>
                  </div>
                  <FilterSidebar
                    filterTexts={filterTexts}
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    minAllowedPrice={minAllowedPrice}
                    maxAllowedPrice={maxAllowedPrice}
                    setAppliedMinPrice={setAppliedMinPrice}
                    setAppliedMaxPrice={setAppliedMaxPrice}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    handleCategoryChange={handleCategoryChange}
                    brands={brands}
                    selectedBrand={selectedBrand}
                    handleBrandChange={handleBrandChange}
                    clearFilters={clearFilters}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          <div className="flex-1">
            {loading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(6)].map((_, i) => (
                  <div key={`skeleton-${i}`} className={`bg-white rounded-xl shadow-sm overflow-hidden animate-pulse ${viewMode === 'list' ? 'flex' : ''}`}>
                    <div className={`bg-gray-200 ${viewMode === 'list' ? 'w-56 h-40' : 'aspect-square'}`} />
                    <div className="p-4 space-y-3 flex-1"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-4 bg-gray-200 rounded w-1/2" /><div className="h-10 bg-gray-200 rounded" /></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-500 text-lg mb-4">{globalTexts.noFound || 'No products found'}</p>
                <button onClick={clearFilters} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">{filterTexts.clearAll || 'Clear Filters'}</button>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {products.map((product) => (viewMode === 'grid' ? <ProductCard key={product.id} product={product} /> : <ProductListCard key={product.id} product={product} dictionary={dictionary} currency={currency} />))}
                </div>
                <div ref={loaderRef} className="flex justify-center items-center py-8 min-h-[80px]">
                  {loadingMore && (<div className="flex items-center gap-2 text-primary-600"><FiLoader className="animate-spin text-2xl" /><span>{globalTexts.loading || 'Loading more...'}</span></div>)}
                  {products.length >= totalProducts && products.length > 0 && (<p className="text-gray-400 text-sm">{globalTexts.noFound || "You've reached the end"}</p>)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopContent;
