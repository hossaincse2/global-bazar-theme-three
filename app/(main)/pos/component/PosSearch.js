import { useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import usePos from '@/_hooks/usePos';

const PosSearch = ({ search, setSearch, products }) => {
  const [debouncedValue, setDebouncedValue] = useState(search);
  const { state, dispatch } = usePos();

  // Debouncing logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(debouncedValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [debouncedValue, setSearch]);

  // Automatically add to cart if barcode matches or single product found
  useEffect(() => {
    if (!debouncedValue) return;

    const foundProduct = products.find(
      (product) => product.barcode_or_sku_code === debouncedValue
    );

    if (products && products.length === 1) {
      const product = products[0];

      // Check if product is out of stock
      if (product.available_stock <= 0) {
        toast.error('Product is out of stock.', {
          position: 'bottom-right',
        });
        setDebouncedValue(''); // Clear input
        return;
      }

      // Check if product already in cart
      const productInCart = state.posCartItems.find(
        (item) =>
          item.product_id === product.product_id &&
          item.variant_sku === product.variant_sku
      );

      if (productInCart) {
        // Check if adding one more exceeds available stock
        if (productInCart.quantity >= product.available_stock) {
          toast.error('Stock limit reached. Cannot add more quantity.', {
            position: 'bottom-right',
          });
          setDebouncedValue(''); // Clear input
          return;
        }

        // Increment quantity
        dispatch({
          type: 'INCREMENT_QUANTITY',
          payload: {
            product_id: product.product_id,
            variant_sku: product.variant_sku,
          },
        });
      } else {
        // Add new product to cart
        dispatch({
          type: 'ADD_TO_CART',
          payload: {
            ...product,
            stock: product.available_stock,
            quantity: 1,
          },
        });
      }

      setDebouncedValue(''); // Clear input after adding
    }

    // Handle barcode match
    if (foundProduct) {
      // Check if product is out of stock
      if (foundProduct.available_stock <= 0) {
        toast.error('Product is out of stock.', {
          position: 'bottom-right',
        });
        setDebouncedValue(''); // Clear input
        return;
      }

      // Check if product already in cart
      const productInCart = state.posCartItems.find(
        (item) =>
          item.product_id === foundProduct.product_id &&
          item.variant_sku === foundProduct.variant_sku
      );

      if (productInCart) {
        // Check if adding one more exceeds available stock
        if (productInCart.quantity >= foundProduct.available_stock) {
          toast.error('Stock limit reached. Cannot add more quantity.', {
            position: 'bottom-right',
          });
          setDebouncedValue(''); // Clear input
          return;
        }

        // Increment quantity
        dispatch({
          type: 'INCREMENT_QUANTITY',
          payload: {
            product_id: foundProduct.product_id,
            variant_sku: foundProduct.variant_sku,
          },
        });
      } else {
        // Add new product to cart
        dispatch({
          type: 'ADD_TO_CART',
          payload: {
            ...foundProduct,
            stock: foundProduct.available_stock,
            quantity: 1,
          },
        });
      }

      setDebouncedValue(''); // Clear input after adding to cart
    }
  }, [debouncedValue, products, dispatch, state.posCartItems]);

  const handleInputChange = (event) => {
    setDebouncedValue(event.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', search);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="relative w-full">
        <input
          type="text"
          name="header-search"
          id="header-search"
          value={debouncedValue}
          onChange={handleInputChange}
          className="w-full h-full block pl-[18px] pr-[45px] py-4 bg-white border border-[#E7E6EC] text-gray-600 placeholder:text-gray-500 placeholder:text-base outline-hidden rounded-lg search-shadow"
          placeholder="Search by name or sku code..."
        />
        {debouncedValue && (
          <button
            type="button"
            onClick={() => setDebouncedValue('')}
            className="absolute top-1/2 -translate-y-1/2 right-[40px] text-gray-500 text-xl font-normal flex items-center"
          >
            <RxCross2 />
          </button>
        )}
        <button
          type="submit"
          className="absolute top-1/2 -translate-y-1/2 right-[18px] text-gray-500 text-xl font-normal flex items-center"
        >
          <IoSearchOutline />
        </button>
      </form>
    </div>
  );
};

export default PosSearch;
