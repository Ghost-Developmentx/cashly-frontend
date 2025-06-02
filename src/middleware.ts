// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * Public routes ─ those that must remain unauthenticated.
 * 1.  "/"  – marketing / landing
 * 2.  "/sign-in(.*)" & "/sign-up(.*)"
 *     ─ "(.*)" makes every sub‑path public: /verify-email, /sso-callback, etc.
 * 3.  "/complete-auth" – final redirect after Clerk flow
 * 4.  "/api/webhooks(.*)" – Stripe / Clerk / etc. webhooks
 */
const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/complete-auth',
    '/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
    // ▸ Allow all public routes (including every nested step) to proceed
    if (isPublicRoute(request)) return NextResponse.next();

    // ▸ For every other route, require a valid Clerk session
    const { userId } = await auth();
    if (!userId) {
        const signInUrl = new URL('/sign-in', request.url);
        signInUrl.searchParams.set('redirect_url', request.url); // return here after login
        return NextResponse.redirect(signInUrl);
    }

    // ▸ User authenticated → continue
    return NextResponse.next();
});

/**
 * Matcher configuration:
 *   • Protect *every* pathname that isn’t a static asset or `_next/` file
 *   • Also run on /api & /trpc endpoints
 */
export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
