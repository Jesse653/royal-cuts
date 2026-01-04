import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    const url = request.nextUrl;

    // --- Tenant Logic ---
    let tenantId = url.searchParams.get("tenantId");

    // Fallback: Check hostname
    const host = request.headers.get("host");
    if (!tenantId && host) {
        const parts = host.split(".");
        // This makes an assumption about the domain structure: tenant.domain.com
        if (parts.length > 2) {
            tenantId = parts[0];
        }
    }

    // Fallback: Header
    if (!tenantId && request.headers.has("x-tenant-id")) {
        tenantId = request.headers.get("x-tenant-id");
    }

    if (tenantId) {
        requestHeaders.set("x-tenant-id", tenantId);
    }

    // --- RBAC Logic ---

    // Mock Session - In a real app, verify JWT/Session
    // We are reading a cookie named 'user_role' for demonstration/MVP
    const userRoleCookie = request.cookies.get("user_role");
    const userRole = userRoleCookie ? userRoleCookie.value : null;

    const pathname = url.pathname;

    // Protected Routes Definition
    const barberRoutes = ["/barber"];
    const customerRoutes = ["/customer"];

    const isBarberRoute = barberRoutes.some(route => pathname.startsWith(route));
    const isCustomerRoute = customerRoutes.some(route => pathname.startsWith(route));

    // 1. Protect Barber Routes
    if (isBarberRoute) {
        if (userRole !== "BARBER") {
            // Redirect to home if not authorized
            // Ideally redirect to login with a ?redirect= param
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // 2. Protect Customer Routes
    if (isCustomerRoute) {
        if (userRole !== "CUSTOMER") {
            // Redirect to home if not authorized
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders
        }
    });
}

export const config = {
    matcher: [
        // Match all request paths except for static files/assets
        "/((?!_next/static|_next/image|favicon.ico).*)"
    ]
};
