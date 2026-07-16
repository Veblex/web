"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { fetchApi } from "../fetch-api";

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

    const res = await fetchApi<{
        session: {
            accessToken: string;
            refreshToken: string;
            accessTokenExpiresIn: number;
            refreshTokenExpiresIn: number;
        };
    }>("POST", "/auth/v1/login", parsed.data);

    if (res.status === 401 || res.status === 400) {
        return {
            success: false,
            error: "Incorrect username/email or password.",
        };
    }

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

    return { success: true };
}
