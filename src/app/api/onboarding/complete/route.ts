// src/app/api/onboarding/complete/route.ts
import { authenticatedFetch, createAuthenticatedResponse, createErrorResponse } from '@/lib/auth-helpers';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Send to your Rails backend
        const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
            method: 'PATCH',
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
                onboarding_completed: true,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update user profile');
        }

        return createAuthenticatedResponse({ success: true });
    } catch (error) {
        console.error('Onboarding error:', error);

        if (error instanceof Error && error.message === 'Authentication required') {
            return createErrorResponse('Unauthorized', 401);
        }

        return createErrorResponse('Failed to complete onboarding', 500);
    }
}