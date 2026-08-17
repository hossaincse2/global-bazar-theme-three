import { decrypt } from '@/_services/encryption';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const business_category = process.env.NEXT_PUBLIC_API_BUSINESS_CATEGORY || 'default';

export async function getAllProduct(
  lang = 'en',
  category = null,
  subCategory = '',
  sort_by = null,
  search = '',
  page = 1,
  perPage = 12,
  brandId = 'all',
  token = null,
  isRetailer = false,
  minPrice = null,
  maxPrice = null
) {
  const headers = {};

  const retailerFlag = String(isRetailer) === 'true' || isRetailer === true;
  if (token && retailerFlag) {
    headers['Authorization'] = `Bearer ${decrypt(token)}`;
  }

  let url = `${baseUrl}/${lang}/products?search=${search}&category=${category}&sub_category=${subCategory}&page=${page}&perPage=${perPage}&sort_by=${sort_by}&brand_id=${brandId}&business_category=${business_category}`;
  if (minPrice !== null && minPrice !== undefined) url += `&min_price=${minPrice}`;
  if (maxPrice !== null && maxPrice !== undefined) url += `&max_price=${maxPrice}`;

  const res = await fetch(url, {
    next: { revalidate: 120 },
    headers,
  }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }

  return res.json();
}

export async function getProduct(
  lang = 'en',
  uuid,
  token = null,
  isRetailer = false
) {
  const headers = {};

  const retailerFlag = String(isRetailer) === 'true' || isRetailer === true;
  if (token && retailerFlag) {
    headers['Authorization'] = `Bearer ${decrypt(token)}`;
  }

  const res = await fetch(`${baseUrl}/${lang}/product/${uuid}`, {
    next: { revalidate: 120 },
    headers,
  });

  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }

  return res.json();
}
