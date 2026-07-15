import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/logout",
];
const PROTECTED_ROUTES = [
    "/dashboard",
    "/settings",
    "/profile",
    "/change-password",
];

function decodeJwtPayload(token: string): { exp?: number } | null {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;
        const json = Buffer.from(payload, "base64url").toString("utf8");
        return JSON.parse(json);
    } catch {
        return null;
    }
}

function isExpired(token?: string): boolean {
    if (!token) return true;
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
}

export async function proxy(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const { pathname } = request.nextUrl;

    const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
    const isProtectedRoute = PROTECTED_ROUTES.some((r) =>
        pathname.startsWith(r)
    );

    let validAccessToken =
        accessToken && !isExpired(accessToken) ? accessToken : null;
    let response: NextResponse | null = null;

    if (!validAccessToken && refreshToken) {
        try {
            const refreshRes = await fetch(
                `${process.env.API_URL!}/auth/v1/refresh`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": process.env.API_KEY_AUTH!,
                    },
                    body: JSON.stringify({
                        refreshToken: refreshToken,
                    }),
                    cache: "no-store",
                }
            );

            if (refreshRes.ok) {
                const payload = await refreshRes.json();
                validAccessToken = payload.session.accessToken;

                response = NextResponse.next();
                response.cookies.set(
                    "accessToken",
                    payload.session.accessToken,
                    {
                        httpOnly: true,
                        secure: true,
                        sameSite: "lax",
                        path: "/",
                        maxAge: payload.session.accessTokenExpiresIn,
                    }
                );
                response.cookies.set(
                    "refreshToken",
                    payload.session.refreshToken,
                    {
                        httpOnly: true,
                        secure: true,
                        sameSite: "lax",
                        path: "/",
                        maxAge: payload.session.refreshTokenExpiresIn,
                    }
                );
            }
        } catch {}
    }

    const authenticated = Boolean(validAccessToken);

    if (authenticated && isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!authenticated && isProtectedRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        const redirect = NextResponse.redirect(loginUrl);
        if (accessToken || refreshToken) {
            redirect.cookies.delete("accessToken");
            redirect.cookies.delete("refreshToken");
        }
        return redirect;
    }

    if (pathname === "/") {
        return NextResponse.redirect(
            new URL(authenticated ? "/dashboard" : "/login", request.url),
            { status: authenticated ? 302 : 308 }
        );
    }

    return response ?? NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
