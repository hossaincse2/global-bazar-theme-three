const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function salePost(authToken, orderData) {
    const res = await fetch(`${baseUrl}/pos/pos-product-order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: orderData,
    });

    const data = await res.json();
    return Response.json(data);
}
