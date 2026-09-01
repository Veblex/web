import { NextRequest, NextResponse } from "next/server";
import { isExpired } from "./lib/jwt";
import { fetchApi } from "./lib/fetch-api";
import {
    ONBOARDING_COMPLETE_COOKIE,
    ONBOARDING_PENDING_COOKIE,
} from "./lib/onboarding";

const AUTH_ROUTES = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
];
const PROTECTED_ROUTES = [
    "/dashboard",
    "/settings",
    "/profile",
    "/change-password",
    "/onboarding",
];

function withRefreshedCookies(
    target: NextResponse,
    refreshed: NextResponse | null
) {
    if (refreshed) {
        refreshed.cookies.getAll().forEach((cookie) => {
            target.cookies.set(cookie);
        });
    }
    return target;
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
            const refreshRes = await fetchApi<{
                session: {
                    accessToken: string;
                    refreshToken: string;
                    accessTokenExpiresIn: number;
                    refreshTokenExpiresIn: number;
                };
            }>("POST", "/auth/v1/refresh", {
                refreshToken,
            });

            if (refreshRes.ok) {
                validAccessToken = refreshRes.data.session.accessToken;

                response = NextResponse.next();
                response.cookies.set(
                    "accessToken",
                    refreshRes.data.session.accessToken,
                    {
                        httpOnly: true,
                        secure: true,
                        sameSite: "lax",
                        path: "/",
                        maxAge: refreshRes.data.session.accessTokenExpiresIn,
                    }
                );
                response.cookies.set(
                    "refreshToken",
                    refreshRes.data.session.refreshToken,
                    {
                        httpOnly: true,
                        secure: true,
                        sameSite: "lax",
                        path: "/",
                        maxAge: refreshRes.data.session.refreshTokenExpiresIn,
                    }
                );
            }
        } catch {
            /* empty */
        }
    }

    const authenticated = Boolean(validAccessToken);
    const onboardingPending =
        request.cookies.get(ONBOARDING_PENDING_COOKIE)?.value === "1";
    const onboardingComplete =
        request.cookies.get(ONBOARDING_COMPLETE_COOKIE)?.value === "1";
    const authedHome = onboardingPending ? "/onboarding" : "/dashboard";

    if (authenticated && isAuthRoute) {
        return withRefreshedCookies(
            NextResponse.redirect(new URL(authedHome, request.url)),
            response
        );
    }

    if (
        authenticated &&
        pathname.startsWith("/onboarding") &&
        onboardingComplete &&
        !onboardingPending
    ) {
        return withRefreshedCookies(
            NextResponse.redirect(new URL("/dashboard", request.url)),
            response
        );
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
        return withRefreshedCookies(
            NextResponse.redirect(
                new URL(authenticated ? authedHome : "/login", request.url),
                { status: authenticated ? 302 : 308 }
            ),
            response
        );
    }

    return response ?? NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
