import { NextRequest, NextResponse } from "next/server";
import { isExpired } from "./lib/jwt";

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

export async function proxy(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const { pathname } = request.nextUrl;

    const isLogout = pathname.startsWith("/logout");
    const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
    const isProtectedRoute = PROTECTED_ROUTES.some((r) =>
        pathname.startsWith(r)
    );

    if (isLogout) {
        if (refreshToken) {
            try {
                await fetch(`${process.env.API_URL!}/auth/v1/logout`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": process.env.API_KEY_AUTH!,
                    },
                    body: JSON.stringify({
                        refreshToken: refreshToken,
                    }),
                    cache: "no-store",
                });
            } catch {
                /* empty */
            }
        }

        const redirect = NextResponse.redirect(new URL("/login", request.url), {
            status: 308,
        });

        if (accessToken || refreshToken) {
            redirect.cookies.delete("accessToken");
            redirect.cookies.delete("refreshToken");
        }

        return redirect;
    }

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
        } catch {
            /* empty */
        }
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
