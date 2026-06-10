import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];
const PROTECTED_ROUTES = ["/dashboard", "/settings", "/profile"];

export function proxy(request: NextRequest) {
    const token = request.cookies.get("auth-token")?.value;
    const { pathname } = request.nextUrl;

    const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
    const isProtectedRoute = PROTECTED_ROUTES.some((r) =>
        pathname.startsWith(r)
    );

    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!token && isProtectedRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (pathname === "/") {
        return NextResponse.redirect(
            new URL(token ? "/dashboard" : "/login", request.url),
            { status: token ? 302 : 308 }
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
