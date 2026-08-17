const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getBanners(lang = 'en') {
    const res = await fetch(`${baseUrl}/${lang}/banners`, {
        next: { revalidate: 300 },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch banners');
    }

    return res.json();
}
