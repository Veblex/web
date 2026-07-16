"use server";

import { z } from "zod";
import { ApiError, fetchApi } from "../fetch-api";

type Result =
    | { success: true }
    | {
          success: false;
          error: string|ApiError;
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

    const res = await fetchApi("POST", "/auth/v1/lost-password", {
        step: "request",
        email: data.email,
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

    const res = await fetchApi<{
        token: string;
    }>("POST", "/auth/v1/lost-password", {
        step: "verify",
        email: data.email,
        code: data.code,
    });

    if (!res.ok) {
        return {
            success: false,
            error: "Something went wrong. Please try again.",
        };
    }

    return { success: true, token: res.data.token };
}

export async function ResetPassword(data: {
    email: string;
    token: string;
    password: string;
}): Promise<Result> {
    const parsed = resetSchema.safeParse(data);
    if (!parsed.success)
        return { success: false, error: "Invalid email, token or password" };

    const res = await fetchApi("POST", "/auth/v1/lost-password", {
        step: "reset",
        email: data.email,
        token: data.token,
        password: data.password,
    });

    if (!res.ok) {
        return {
            success: false,
            error: res.error,
        };
    }

    return { success: true };
}
