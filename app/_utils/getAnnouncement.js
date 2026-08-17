const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAnnouncement() {
  const res = await fetch(`${baseUrl}/campaign`, {
    next: { revalidate: 120 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch announcement');
  }

  return res.json();
}
