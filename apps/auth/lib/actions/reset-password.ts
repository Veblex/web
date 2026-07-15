"use server";

import { z } from "zod";

type Result =
    | { success: true }
    | {
          success: false;
          error: string;
      };
type TokenResult =
    | { success: true; token: string }
    | {
          success: false;
          error: string;
      };

const emailSchema = z.object({ email: z.string().email().max(255).min(3) });
const verifySchema = z.object({
    email: z.string().email().max(255).min(3),
    code: z.string().length(6),
});
const resetSchema = z.object({
    email: z.string().email().max(255).min(3),
    token: z.string().min(3),
    password: z
        .string()
        .min(8, "At least 8 characters")
        .max(128, "Password is too long")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[0-9]/, "Must contain a number"),
});

export async function requestPasswordReset(data: {
    email: string;
}): Promise<Result> {
    const parsed = emailSchema.safeParse(data);
    if (!parsed.success) return { success: false, error: "Invalid email" };

    const res = await fetch(`${process.env.API_URL!}/auth/v1/lost-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY_AUTH!,
        },
        body: JSON.stringify({
            step: "request",
            email: data.email,
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

export async function verifyResetToken(data: {
    email: string;
    code: string;
}): Promise<TokenResult> {
    const parsed = verifySchema.safeParse(data);
    if (!parsed.success)
        return { success: false, error: "Invalid email or code" };

    const res = await fetch(`${process.env.API_URL!}/auth/v1/lost-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY_AUTH!,
        },
        body: JSON.stringify({
            step: "verify",
            email: data.email,
            code: data.code,
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

export async function ResetPassword(data: {
    email: string;
    token: string;
    password: string;
}): Promise<Result> {
    const parsed = resetSchema.safeParse(data);
    if (!parsed.success)
        return { success: false, error: "Invalid email, token or password" };

    const res = await fetch(`${process.env.API_URL!}/auth/v1/lost-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY_AUTH!,
        },
        body: JSON.stringify({
            step: "reset",
            email: data.email,
            token: data.token,
            password: data.password,
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
