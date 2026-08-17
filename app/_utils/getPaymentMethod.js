const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPaymentMethod() {
  const res = await fetch(`${baseUrl}/payment-gateway`, {
    next: { revalidate: 120 },
  });

  if (!res.ok) {
    return { data: [] };
  }

  try {
    return res.json();
  } catch (error) {
    return { data: [] };
  }
}
