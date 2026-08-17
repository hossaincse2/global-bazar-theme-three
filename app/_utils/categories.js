const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getCategories(lang = 'en') {
    const res = await fetch(`${baseUrl}/${lang}/categories`, {
        next: { revalidate: 300 },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }

    return res.json();
}
