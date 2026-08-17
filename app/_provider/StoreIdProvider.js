import { useState } from 'react';
import StoreIdContext from '@/_context/StoreIdContext';

const StoreIdProvider = ({ children }) => {
  const [userStoreId, setUserStoreId] = useState(null);

  return (
    <StoreIdContext.Provider value={{ userStoreId, setUserStoreId }}>
      {children}
    </StoreIdContext.Provider>
  );
};

export default StoreIdProvider;
