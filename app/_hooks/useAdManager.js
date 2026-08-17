// import { AdContext } from '@/_context/AdContext';
import { AdContext } from '@/_context/adContext';
import { useContext } from 'react';

const useAdManager = () => {
    const { adManager } = useContext(AdContext);
    return { adManager };
};

export default useAdManager;
