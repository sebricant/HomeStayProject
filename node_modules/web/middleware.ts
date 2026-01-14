import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define paths that are protected
    if (path.startsWith('/admin')) {
        // Exclude login page itself
        if (path === '/admin/login') {
            return NextResponse.next();
        }

        // Check for auth cookie or token (Simplified for demo: similar to legacy localstorage check but server-side would need cookies)
        // Since legacy used localStorage, middleware can't see it easily.
        // We'll rely on Client Components redirects for this demo migration unless we switch to Cookies.
        // For a cleaner migration, we'll let the layout handle it or just allow it and let client redirect if 401.
        // BUT, for real "production" feel, let's look for a cookie named 'token'.

        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
