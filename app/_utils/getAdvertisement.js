const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAdvertisement(position = 'home_top') {
  const res = await fetch(`${baseUrl}/advertisement?position=${position}`, {
    next: { revalidate: 120 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch Advertisement');
  }

  return res.json();
}
