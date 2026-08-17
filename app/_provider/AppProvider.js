'use client';

import { useEffect, useReducer, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LanguageProvider } from '@/_context/LanguageContext';
import { OrderProvider } from '@/_context/OrderContext';
import { SiteSettingProvider } from '@/_context/SiteSettingContext';
import { ThemeOptionsProvider } from '@/_context/ThemeOptionsContext';
import { UserProvider } from '@/_context/UserContext';
import { WishlistContext } from '@/_context/wishlistContext';
import { CompareContext } from '@/_context/compareContext';
import { ProductContext } from '@/_context/cartContext';
import AuthProvider from '@/_provider/authProvider';
import StoreIdProvider from '@/_provider/StoreIdProvider';
import { cartReducer, initialState } from '@/_reducer/CartReducer';
import { wishlistReducer, initialWishlistState } from '@/_reducer/WishlistReducer';
import { compareReducer, initialCompareState } from '@/_reducer/CompareReducer';

export default function AppProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [wishlistState, wishlistDispatch] = useReducer(wishlistReducer, initialWishlistState);
  const [compareState, compareDispatch] = useReducer(compareReducer, initialCompareState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    dispatch({ type: 'SET_CART' });
    wishlistDispatch({ type: 'SET_WISHLIST' });
    compareDispatch({ type: 'SET_COMPARE' });
  }, []);

  return (
    <LanguageProvider>
      <SiteSettingProvider>
        <ThemeOptionsProvider>
          <UserProvider>
            <AuthProvider>
              <StoreIdProvider>
                <OrderProvider>
                  <CompareContext.Provider value={{ compareState, compareDispatch }}>
                    <WishlistContext.Provider value={{ wishlistState, wishlistDispatch }}>
                      <ProductContext.Provider value={{ state, dispatch }}>
                        {children}
                        {mounted && (
                          <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                          />
                        )}
                      </ProductContext.Provider>
                    </WishlistContext.Provider>
                  </CompareContext.Provider>
                </OrderProvider>
              </StoreIdProvider>
            </AuthProvider>
          </UserProvider>
        </ThemeOptionsProvider>
      </SiteSettingProvider>
    </LanguageProvider>
  );
}
