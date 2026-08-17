'use client';

import OrderContext from '@/_context/OrderContext';
import { useContext } from 'react';

const useOrderId = () => {
    const { orderId, setOrderId } = useContext(OrderContext);
    return { orderId, setOrderId };
};

export default useOrderId;
