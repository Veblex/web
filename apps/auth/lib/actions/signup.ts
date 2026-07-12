"use server";

import { z } from "zod";
import { cookies } from "next/headers";

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

    const res = await fetch(`${process.env.API_URL!}/auth/v1/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY_AUTH!,
        },
        body: JSON.stringify({
            step: "request",
            ...parsed.data,
        }),
        cache: "no-store",
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

    const res = await fetch(`${process.env.API_URL!}/auth/v1/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY_AUTH!,
        },
        body: JSON.stringify({
            step: "verify",
            ...parsed.data,
        }),
        cache: "no-store",
    });

    if (!res.ok) {
        return {
            success: false,
            error: "Something went wrong. Please try again.",
        };
    }

    const payload = await res.json();

    return { success: true, token: payload.token };
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

    const res = await fetch(`${process.env.API_URL!}/auth/v1/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY_AUTH!,
        },
        body: JSON.stringify({
            step: "complete",
            ...parsed.data,
        }),
        cache: "no-store",
    });

    if (!res.ok) {
        return {
            success: false,
            error: "Something went wrong. Please try again.",
        };
    }

    const payload = await res.json();

    const cookieStore = await cookies();
    cookieStore.set("session", payload.token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true };
}
