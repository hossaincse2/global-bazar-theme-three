const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getProducts(lang = 'en', params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${baseUrl}/${lang}/products${queryParams ? `?${queryParams}` : ''}`;
    
    const res = await fetch(url, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }

    return res.json();
}

export async function getProductDetails(lang = 'en', slug) {
    const res = await fetch(`${baseUrl}/${lang}/products/${slug}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch product details');
    }

    return res.json();
}
