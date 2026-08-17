const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getCustomers(token) {
  const res = await fetch(`${baseUrl}/pos/pos-customers`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch pos customers');
  }

  return res.json();
}

export async function createCustomer(authToken, orderData) {
  const res = await fetch(`${baseUrl}/pos/pos-create-customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: orderData,
  });

  return res; // Just return the raw response
}
