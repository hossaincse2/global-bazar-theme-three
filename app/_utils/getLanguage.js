const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getLanguage() {
  try {
    const res = await fetch(`${baseUrl}/languages`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch languages');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching languages:', error);
    return { data: [] };
  }
}
