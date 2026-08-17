const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const business_category =
  process.env.NEXT_PUBLIC_API_BUSINESS_CATEGORY || 'default';

export async function getBrands(lang = 'en') {
  const res = await fetch(
    `${baseUrl}/${lang}/brands?business_category=${business_category}`,
    {
      next: { revalidate: 120 },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch brands');
  }

  return res.json();
}
