import { auth } from "@clerk/nextjs/server";

export async function fetchWithAuth(path: string, options: any = {}) {
    const { getToken } = await auth();
    const token = await getToken()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    
    return res.json();
}