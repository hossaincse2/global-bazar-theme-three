'use client';

import { createContext, useState } from 'react';

const PosUserContext = createContext('');

export const PosUserProvider = ({ children }) => {
  const [posUser, setPosUser] = useState(null);

  return (
    <PosUserContext.Provider value={{ posUser, setPosUser }}>
      {children}
    </PosUserContext.Provider>
  );
};

export default PosUserContext;
