const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getMyOrders(token, orderStatus = 'all', page = 1, perPage = 10) {
    const res = await fetch(
        `${baseUrl}/user/user-orders?filter=${orderStatus}&page=${page}&perPage=${perPage}`,
        {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!res.ok) {
        throw new Error('Failed to fetch my orders');
    }

    return res.json();
}

export async function getSingleOrder(token, orderId) {
    const res = await fetch(`${baseUrl}/user/user-order-details/${orderId}`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch order details');
    }

    return res.json();
}

export async function getOrderStatus(token) {
    const res = await fetch(`${baseUrl}/user/order-status`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch order status');
    }

    return res.json();
}
