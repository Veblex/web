"use server";

import { z } from "zod";
import { cookies } from "next/headers";

type LoginResult =
    | { success: true }
    | {
          success: false;
          error: string;
      };

const schema = z.object({
    identifier: z.string().min(3),
    password: z.string().min(3),
});

export async function login(data: {
    identifier: string;
    password: string;
}): Promise<LoginResult> {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: "Invalid identifier or password" };
    }

    const res = await fetch(`${process.env.API_URL!}/auth/v1/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY_AUTH!,
        },
        body: JSON.stringify(parsed.data),
        cache: "no-store",
    });

    if (res.status === 401 || res.status === 400) {
        return {
            success: false,
            error: "Incorrect username/email or password.",
        };
    }

    if (!res.ok) {
        return { success: false, error: "Something went wrong. Please try again." };
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
