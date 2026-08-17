const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getInvoice(orderId) {
    const res = await fetch(`${baseUrl}/pos/pos-recent-sales-invoice/${orderId}`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch invoice');
    }

    return res.json();
}
