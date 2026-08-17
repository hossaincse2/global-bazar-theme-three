const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function postForgotPassword(email) {
    const res = await fetch(`${baseUrl}/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(email),
    });

    const data = await res.json();
    return Response.json(data);
}

export async function postResetPassword(resetData) {
    const res = await fetch(`${baseUrl}/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(resetData),
    });

    const data = await res.json();
    return Response.json(data);
}
