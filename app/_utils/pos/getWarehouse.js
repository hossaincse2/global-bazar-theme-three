const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getWarehouse(token) {
    const res = await fetch(`${baseUrl}/pos/pos-warehouses`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch pos warehouse');
    }

    return res.json();
}
