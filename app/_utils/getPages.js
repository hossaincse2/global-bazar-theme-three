const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPages() {
    const res = await fetch(`${baseUrl}/pages`, {
        next: { revalidate: 3600 }, // Pages don't change often
    });

    if (!res.ok) {
        throw new Error('Failed to fetch Pages');
    }

    return res.json();
}
