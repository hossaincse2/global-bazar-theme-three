/* eslint-disable no-case-declarations */
const posInitialState = {
  posCartItems: [],
  cartTotal: 0,
  quantity: 1,
};

const saveToLocalStorage = (posCartItems) => {
  localStorage.setItem('posCartItems', posCartItems);
};

// Action types
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const INCREMENT_QUANTITY = 'INCREMENT_QUANTITY';
const DECREMENT_QUANTITY = 'DECREMENT_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';
const SET_CART = 'SET_CART';

const calculateCartTotal = (posCartItems) => {
  return posCartItems.reduce(
    (total, item) =>
      total +
      (item.final_sale_price > 0 ? item.final_sale_price : item.unit_price) *
        item.quantity,
    0
  );
};

const isSameCartItem = (a, b) =>
  a.product_id === b.product_id && a.variant_sku === b.variant_sku;

const posCartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const existingItem = state.posCartItems.find((item) =>
        isSameCartItem(item, action.payload)
      );

      let updatedCart;
      if (existingItem) {
        updatedCart = state.posCartItems.map((item) =>
          isSameCartItem(item, action.payload)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...state.posCartItems, { ...action.payload }];
      }

      saveToLocalStorage(JSON.stringify(updatedCart));
      return {
        ...state,
        posCartItems: updatedCart,
        cartTotal: calculateCartTotal(updatedCart),
      };

    case REMOVE_FROM_CART:
      const filteredItems = state.posCartItems.filter(
        (item) => !isSameCartItem(item, action.payload)
      );
      saveToLocalStorage(JSON.stringify(filteredItems));
      return {
        ...state,
        posCartItems: filteredItems,
        cartTotal: calculateCartTotal(filteredItems),
      };

    case INCREMENT_QUANTITY:
      const increasedItems = state.posCartItems.map((item) =>
        isSameCartItem(item, action.payload)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveToLocalStorage(JSON.stringify(increasedItems));
      return {
        ...state,
        posCartItems: increasedItems,
        cartTotal: calculateCartTotal(increasedItems),
      };

    case DECREMENT_QUANTITY:
      const decreasedItems = state.posCartItems.map((item) =>
        isSameCartItem(item, action.payload)
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      );
      saveToLocalStorage(JSON.stringify(decreasedItems));
      return {
        ...state,
        posCartItems: decreasedItems,
        cartTotal: calculateCartTotal(decreasedItems),
      };

    case CLEAR_CART:
      const clearedCart = [];
      saveToLocalStorage(JSON.stringify(clearedCart));
      return {
        ...state,
        posCartItems: clearedCart,
        cartTotal: 0,
      };

    case SET_CART:
      if (typeof window === 'undefined') return state;
      const storedItems =
        JSON.parse(localStorage.getItem('posCartItems')) || [];
      return {
        ...state,
        posCartItems: storedItems,
        cartTotal: calculateCartTotal(storedItems),
      };

    default:
      return state;
  }
};

export {
  ADD_TO_CART,
  CLEAR_CART,
  DECREMENT_QUANTITY,
  INCREMENT_QUANTITY,
  posCartReducer,
  posInitialState,
  REMOVE_FROM_CART,
  SET_CART,
};
