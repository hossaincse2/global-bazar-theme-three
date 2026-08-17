import PosUserContext from '@/_context/posUser';
import { useContext } from 'react';
// import PosUserContext from '@/contexts/PosUserContext'; // adjust path as needed

const usePosUser = () => {
  const context = useContext(PosUserContext);

  if (!context) {
    throw new Error('usePosUser must be used within a PosUserProvider');
  }

  return context;
};

export default usePosUser;
