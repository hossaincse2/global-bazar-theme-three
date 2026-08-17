const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function saveIncompleteOrder(data) {
  try {
    const res = await fetch(`${baseUrl}/incomplete-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error('Error saving incomplete order:', error);
    return { status: false, message: error.message };
  }
}
