'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { IoFilterSharp } from 'react-icons/io5';

import useDictionary from '@/_hooks/useDictionary';
import usePosUser from '@/_hooks/usePosUser';
import useStoreId from '@/_hooks/useStoreId';
import useAuth from '@/_hooks/useAuth';
import { getPosCategories } from '@/_utils/pos/getPosCategories';
import { getPosProductProducts } from '@/_utils/pos/getPosProducts';

import BillTable from './BillTable';
import CustomerList from './CustomerList';
import PosProductCard from './PosProductCard';
import PosSearch from './PosSearch';
import PosSkeletonCard from './PosSkeletonCard';

const PosProductsList = () => {
  const [search, setSearch] = useState('');
  const [customervalue, setCustomerValue] = useState('');
  const [warehousevalue, setWarehouseValue] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('');
  const [productItem, setProductItem] = useState([]);
  const [totalProduct, setTotalProduct] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [availableStock, setAvailableStock] = useState(true);
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState([]);
  const [authenticated, setAuthenticated] = useState(true);

  const { language, dictionary } = useDictionary();
  const { posUser } = usePosUser();
  const { userStoreId, setUserStoreId } = useStoreId();
  const { authToken, setAuthToken } = useAuth();
  const searchParams = useSearchParams();

  const loaderRef = useRef(null);

  const [storeId, setStoreId] = useState(null);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) setAuthToken(token);
    setPageLoading(false);
  }, [token]);

  useEffect(() => {
    if (posUser) {
      if (posUser.role === 'super_admin') {
        setStoreId('all');
        setUserStoreId('all');
      } else if (posUser.store_id) {
        setStoreId(posUser.store_id);
        setUserStoreId(posUser.store_id);
      }
    }
  }, [posUser]);

  useEffect(() => {
    if (authToken) {
      getPosCategories(authToken)
        .then((res) => {
          if (res.message === 'Unauthenticated') {
            setAuthenticated(false);
          } else {
            setCategories(res.data || []);
          }
        })
        .catch((err) => console.error('Failed to fetch categories:', err));
    }
  }, [authToken]);

  const fetchProduct = useCallback(
    async (reset = false) => {
      if (!authToken || (!storeId && storeId !== 'all')) return;

      try {
        setLoading(true);
        const currentPage = reset ? 1 : page;

        const res = await getPosProductProducts(
          authToken,
          selectedCategory,
          search,
          currentPage,
          12,
          storeId,
          availableStock
        );

        setTotalProduct(res.meta.total || 0);

        if (reset || currentPage === 1) {
          setProductItem(res.data || []);
        } else {
          setProductItem((prev) => [...prev, ...(res.data || [])]);
        }

        if (reset) setPage(1);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    },
    [authToken, storeId, selectedCategory, search, page, availableStock]
  );

  useEffect(() => {
    if (authToken && (storeId || storeId === 'all')) {
      fetchProduct(true);
    }
  }, [authToken, storeId, selectedCategory, search, availableStock]);

  useEffect(() => {
    if (!loaderRef.current || productItem.length >= totalProduct || loading)
      return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loaderRef, productItem.length, totalProduct, loading]);

  useEffect(() => {
    if (page > 1 && !loading) {
      fetchProduct();
    }
  }, [page]);

  const handleAvailableStock = () => {
    setAvailableStock((prev) => !prev);
  };

  const handleCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleAllFilter = () => {
    setSelectedCategory('');
  };

  if ((!authenticated && authToken) || (!authToken && !pageLoading)) {
    return (
      <div className="container">
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-white rounded-[16px]">
          <p className="text-3xl font-semibold text-gray-500">
            You are not authorized. Please Login
          </p>
        </div>
      </div>
    );
  }

  if (posUser && posUser.store_id === null) {
    return (
      <div className="flex items-center justify-center pt-10 text-center">
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-semibold text-gray-800">
            Store Assignment Required
          </h2>
          <p className="text-lg text-gray-600">
            You are not assigned to any store. Please contact the administrator
            for further assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pb-8">
      <div className="grid grid-cols-12 gap-[30px]">
        <div className="order-2 col-span-12 xl:col-span-7 xl:order-1">
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1">
              <PosSearch
                search={search}
                setSearch={setSearch}
                products={productItem}
              />
            </div>
            <button
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${availableStock
                  ? 'bg-purple-900 text-white'
                  : 'bg-white text-gray-500'
                }`}
              onClick={handleAvailableStock}
            >
              <IoFilterSharp />
            </button>
          </div>

          <div className="flex gap-4 px-3 py-2 mb-5 overflow-x-auto bg-white rounded product-filter whitespace-nowrap scrollbar-hide">
            <button
              onClick={handleAllFilter}
              className={`px-4 py-3 text-sm rounded-md ${selectedCategory === ''
                  ? 'bg-[#E7ECF2] text-purple-900'
                  : 'text-gray-700'
                }`}
            >
              {dictionary?.Global?.all || 'All'}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategory(category.id)}
                className={`px-4 py-3 text-sm rounded-md ${selectedCategory === category.id
                    ? 'bg-[#E7ECF2] text-purple-900'
                    : 'text-gray-700'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <Suspense fallback={<></>}>
            {loading && page === 1 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-4">
                <PosSkeletonCard />
                <PosSkeletonCard />
                <PosSkeletonCard />
                <PosSkeletonCard />
              </div>
            ) : productItem.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-4">
                {productItem.map((product, idx) => (
                  <PosProductCard key={idx} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex justify-center pt-10 text-gray-600">
                <h2 className="text-2xl">Product not found</h2>
              </div>
            )}

            <div ref={loaderRef} className="flex justify-center mt-40">
              {loading && productItem.length < totalProduct && (
                <div className="loader"></div>
              )}
            </div>
          </Suspense>
        </div>

        <div className="order-1 col-span-12 xl:col-span-5 xl:order-2">
          <div className="p-5 bg-white rounded-xl xl:sticky xl:top-[90px] xl:right-5">
            <CustomerList
              customervalue={customervalue}
              setCustomerValue={setCustomerValue}
              warehousevalue={warehousevalue}
              setWarehouseValue={setWarehouseValue}
              setStoreId={setStoreId}
              storeId={storeId}
              setPage={setPage}
            />
            <BillTable
              customervalue={customervalue}
              setCustomerValue={setCustomerValue}
              warehousevalue={warehousevalue}
              setWarehouseValue={setWarehouseValue}
              refetchProducts={() => fetchProduct(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosProductsList;
