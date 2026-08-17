const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function reviewPost(reviewData) {
  const res = await fetch(`${baseUrl}/product-reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: reviewData,
  });

  const data = await res.json();
  return Response.json(data);
}
