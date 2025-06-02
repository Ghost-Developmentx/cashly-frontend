import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { userId, getToken } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = await getToken();
        const body = await request.json();

        // Send to Rails backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: body.firstName,
                last_name: body.lastName,
                phone_number: body.phoneNumber,
                address_line1: body.address.line1,
                address_line2: body.address.line2,
                city: body.address.city,
                state: body.address.state,
                zip_code: body.address.zipCode,
                country: body.address.country,
                company_name: body.businessName,
                business_type: body.businessType,
                company_size: body.employeeCount,
                industry: body.industry,
                onboarding_completed: true, // Explicitly set this
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update user profile');
        }

        const userData = await response.json();

        return NextResponse.json({
            success: true,
            user: userData.user
        });
    } catch (error) {
        console.error('Onboarding error:', error);
        return NextResponse.json(
            { error: 'Failed to complete onboarding' },
            { status: 500 }
        );
    }
}