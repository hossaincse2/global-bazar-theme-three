const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getHeroImage() {
  const res = await fetch(`${baseUrl}/hero-images`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch Hero image');
  }

  return res.json();
}
