const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAllCategories(
  lang = 'en',
  withSubcategories = false,
  withProducts = false,
  onlyParent = false
) {
  const params = new URLSearchParams();
  
  if (withSubcategories) params.append('with_subcategories', 'true');
  if (withProducts) params.append('with_products', 'true');
  if (onlyParent) params.append('only_parent', 'true');

  const queryString = params.toString();
  const url = `${baseUrl}/${lang}/categories${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  return res.json();
}
