const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPrintInvoice(token, id) {
    const res = await fetch(`${baseUrl}/pos/pos-recent-sales-invoice/${id}`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch invoice');
    }

    return res.json();
}
