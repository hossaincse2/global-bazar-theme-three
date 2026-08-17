const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function getAddManager() {
  try {
    const res = await fetch(`${baseUrl}/ads-manager-credentials`, {
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      console.warn('Failed to fetch ads manager credentials');
      return { tag_managers: [], pixels: [] };
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching ads manager:', error);
    return { tag_managers: [], pixels: [] };
  }
}
