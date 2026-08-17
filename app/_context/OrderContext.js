'use client';

import { createContext, useState } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orderId, setOrderId] = useState(null);

    return (
        <OrderContext.Provider value={{ orderId, setOrderId }}>
            {children}
        </OrderContext.Provider>
    );
};

export default OrderContext;
