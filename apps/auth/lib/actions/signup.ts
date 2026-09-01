"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { fetchApi } from "../fetch-api";
import {
    ONBOARDING_COMPLETE_COOKIE,
    ONBOARDING_PENDING_COOKIE,
    onboardingCookieOptions,
} from "../onboarding";

type SignupResult =
    | { success: true; token?: string }
    | {
          success: false;
          error: string;
      };

const requestSchema = z.object({
    email: z.string().email().min(3),
});
const verifySchema = z.object({
    email: z.string().email().min(3),
    code: z.string().min(3),
});
const completeSchema = z.object({
    email: z.string().email().min(3),
    token: z.string().min(3),
    username: z.string().min(3).max(32),
    password: z.string().min(3).max(72),
});

export async function request(data: { email: string }): Promise<SignupResult> {
    const parsed = requestSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: "Invalid email" };
    }

    const res = await fetchApi("POST", "/auth/v1/signup", {
        step: "request",
        ...parsed.data,
    });

    if (!res.ok) {
        return {
            success: false,
            error: "Something went wrong. Please try again.",
        };
    }

    return { success: true };
}
export async function verify(data: {
    email: string;
    code: string;
}): Promise<SignupResult> {
    const parsed = verifySchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: "Invalid email or code" };
    }

    const res = await fetchApi<{
        token: string;
    }>("POST", "/auth/v1/signup", {
        step: "verify",
        ...parsed.data,
    });

    if (!res.ok) {
        return {
            success: false,
            error: "Something went wrong. Please try again.",
        };
    }

    return { success: true, token: res.data.token };
}
export async function complete(data: {
    email: string;
    token: string;
    username: string;
    password: string;
}): Promise<SignupResult> {
    const parsed = completeSchema.safeParse(data);
    if (!parsed.success) {
        return {
            success: false,
            error: "Invalid email, token, username or password",
        };
    }

    const res = await fetchApi<{
        session: {
            accessToken: string;
            refreshToken: string;
            accessTokenExpiresIn: number;
            refreshTokenExpiresIn: number;
        };
    }>("POST", "/auth/v1/signup", {
        step: "complete",
        ...parsed.data,
    });

    if (!res.ok) {
        return {
            success: false,
            error: "Something went wrong. Please try again.",
        };
    }

    const cookieStore = await cookies();
    cookieStore.set("accessToken", res.data.session.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: res.data.session.accessTokenExpiresIn,
    });
    cookieStore.set("refreshToken", res.data.session.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: res.data.session.refreshTokenExpiresIn,
    });
    cookieStore.delete(ONBOARDING_COMPLETE_COOKIE);
    cookieStore.set(ONBOARDING_PENDING_COOKIE, "1", onboardingCookieOptions);

    return { success: true };
}
