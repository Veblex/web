"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchApi } from "../fetch-api";

export async function logout() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken) {
        try {
            await fetchApi("POST", "/auth/v1/logout", {
                refreshToken,
            });
        } catch {
            /* empty */
        }
    }

    if (accessToken || refreshToken) {
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
    }

    redirect("/login");
}
