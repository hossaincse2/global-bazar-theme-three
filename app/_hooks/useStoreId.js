import { useContext } from 'react';
import StoreIdContext from '../_context/StoreIdContext';

const useStoreId = () => {
  const context = useContext(StoreIdContext);

  if (!context) {
    throw new Error('useStoreId must be used within a StoreIdContext.Provider');
  }

  const { userStoreId, setUserStoreId } = context;

  return { userStoreId, setUserStoreId };
};

export default useStoreId;
