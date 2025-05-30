import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function getAuthToken() {
    const { userId, getToken } = await auth();

    if (!userId) {
        return { error: 'Unauthorized', token: null };
    }

    const token = await getToken();
    return { error: null, token };
}

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
    const { token, error } = await getAuthToken();

    if (error || !token) {
        throw new Error('Authentication required');
    }

    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
}

export function createAuthenticatedResponse(data: any, status = 200) {
    return NextResponse.json(data, { status });
}

export function createErrorResponse(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}