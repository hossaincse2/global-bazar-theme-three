const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPosUser(token) {
    const res = await fetch(`${baseUrl}/user/details`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch pos categories');
    }

    return res.json();
}
