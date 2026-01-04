import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    const url = request.nextUrl;

    // 1. Check for tenantId in query params (useful for dev/testing)
    let tenantId = url.searchParams.get("tenantId");

    // 2. Fallback: Check hostname (e.g. tenant.domain.com)
    const host = request.headers.get("host");
    if (!tenantId && host) {
        // Basic subdomain extraction logic
        // Localhost: tenant.localhost means nothing unless /etc/hosts is set.
        // This is just a placeholder logic.
        const parts = host.split(".");
        if (parts.length > 2) {
            // e.g. tenant.example.com
            tenantId = parts[0];
        }
    }

    // 3. Fallback: Header (from upstream proxy)
    if (!tenantId && request.headers.has("x-tenant-id")) {
        tenantId = request.headers.get("x-tenant-id");
    }

    if (tenantId) {
        requestHeaders.set("x-tenant-id", tenantId);
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        // Match all request paths except for static files/assets
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
