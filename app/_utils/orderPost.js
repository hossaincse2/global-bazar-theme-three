const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function orderPost(orderData, token) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${baseUrl}/product-order`, {
    method: 'POST',
    headers,
    body: orderData,
  });

  const data = await res.json();
  return Response.json(data);
}
