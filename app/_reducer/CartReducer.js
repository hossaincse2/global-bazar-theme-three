const initialState = {
  cartItems: [],
  cartTotal: 0,
  quantity: 1,
};

const saveToLocalStorage = (cartItems) => {
  const data = {
    items: JSON.parse(cartItems),
    timestamp: new Date().getTime(),
  };
  localStorage.setItem('cartItems', JSON.stringify(data));
};

const calculateCartTotal = (cartItems) => {
  return cartItems.reduce(
    (total, item) =>
      total +
      (item.sale_price > 0 ? item.sale_price : item.unit_price) * item.quantity,
    0
  );
};

const isSameCartItem = (a, b) => {
  if (a.variant_id || b.variant_id) {
    return a.id === b.id && a.variant_id === b.variant_id;
  }
  return a.id === b.id;
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cartItems.find((item) =>
        isSameCartItem(item, action.payload)
      );

      let updatedCartItems;
      if (existingItem) {
        updatedCartItems = state.cartItems.map((item) =>
          isSameCartItem(item, action.payload)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCartItems = [...state.cartItems, { ...action.payload }];
      }

      saveToLocalStorage(JSON.stringify(updatedCartItems));
      return {
        ...state,
        cartItems: updatedCartItems,
        cartTotal: calculateCartTotal(updatedCartItems),
      };

    case 'REMOVE_FROM_CART':
      const filteredItems = state.cartItems.filter(
        (item) => !isSameCartItem(item, action.payload)
      );
      saveToLocalStorage(JSON.stringify(filteredItems));
      return {
        ...state,
        cartItems: filteredItems,
        cartTotal: calculateCartTotal(filteredItems),
      };

    case 'INCREMENT_QUANTITY':
      const incrementedItems = state.cartItems.map((item) =>
        isSameCartItem(item, action.payload)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveToLocalStorage(JSON.stringify(incrementedItems));
      return {
        ...state,
        cartItems: incrementedItems,
        cartTotal: calculateCartTotal(incrementedItems),
      };

    case 'DECREMENT_QUANTITY':
      const decrementedItems = state.cartItems.map((item) => {
        if (isSameCartItem(item, action.payload)) {
          return {
            ...item,
            quantity: Math.max(item.quantity - 1, 1),
          };
        }
        return item;
      });
      saveToLocalStorage(JSON.stringify(decrementedItems));
      return {
        ...state,
        cartItems: decrementedItems,
        cartTotal: calculateCartTotal(decrementedItems),
      };

    case 'CLEAR_CART':
      const clearCartItems = [];
      const clearCartTotal = 0;
      saveToLocalStorage(JSON.stringify(clearCartItems));
      return {
        ...state,
        cartItems: clearCartItems,
        cartTotal: clearCartTotal,
      };

    case 'SET_CART':
      if (typeof window === 'undefined') return state;
      const storedData = localStorage.getItem('cartItems');
      if (!storedData) return { ...state, cartItems: [], cartTotal: 0 };

      const parsedData = JSON.parse(storedData);
      const currentTime = new Date().getTime();

      if (currentTime - parsedData.timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('cartItems');
        return { ...state, cartItems: [], cartTotal: 0 };
      }

      const getLocalData = parsedData.items || [];
      return {
        ...state,
        cartItems: getLocalData,
        cartTotal: calculateCartTotal(getLocalData),
      };

    default:
      return state;
  }
};

export { cartReducer, initialState };
