const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getThemeOptions(lang = 'en') {
    const res = await fetch(`${baseUrl}/${lang}/theme-options`, {
        next: { revalidate: 120 },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch Theme Options');
    }

    return res.json();
}
