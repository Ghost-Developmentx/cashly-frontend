import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks(.*)',
    '/complete-auth'
])

export default clerkMiddleware(async (auth, request) => {
    // For sign-in and sign-up pages, always allow access
    if (request.nextUrl.pathname.startsWith('/sign-in') ||
        request.nextUrl.pathname.startsWith('/sign-up')) {
        return NextResponse.next()
    }

    // For other public routes
    if (isPublicRoute(request)) {
        return NextResponse.next()
    }

    // All other routes require authentication
    const authObject = await auth()

    if (!authObject.userId) {
        // Redirect to sign-in if not authenticated
        const signInUrl = new URL('/sign-in', request.url)
        signInUrl.searchParams.set('redirect_url', request.url)
        return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}