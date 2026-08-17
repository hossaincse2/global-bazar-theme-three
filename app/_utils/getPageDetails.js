const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPageDetails(slug, language = 'en') {
    // If language integration expands to pages, use it here, but current API drops language prefix.
    const res = await fetch(`${baseUrl}/page-details/${slug}`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch Page Details');
    }

    return res.json();
}
