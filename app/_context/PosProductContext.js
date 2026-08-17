'use client';

import { posCartReducer, posInitialState } from '@/_reducer/posCartReducer';
import { createContext, useEffect, useReducer } from 'react';

const PosProductContext = createContext('');

export const PosProvider = ({ children }) => {
      const [state, dispatch] = useReducer(posCartReducer, posInitialState);

      useEffect(() => {
          dispatch({
              type: 'SET_CART',
          });
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    return (
        <PosProductContext.Provider value={{ state, dispatch }}>
            {children}
        </PosProductContext.Provider>
    );
};

export default PosProductContext;
