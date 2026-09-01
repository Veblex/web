"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import {
    AVATAR_HUES,
    DEFAULT_ONBOARDING_PAYLOAD,
    INTERESTS,
    ONBOARDING_COMPLETE_COOKIE,
    ONBOARDING_PENDING_COOKIE,
    onboardingCookieOptions,
    type OnboardingPayload,
} from "../onboarding";

type OnboardingResult =
    | { success: true }
    | { success: false; error: string };

const payloadSchema = z.object({
    displayName: z.string().max(48),
    avatarHue: z.enum(AVATAR_HUES),
    interests: z.array(z.enum(INTERESTS)),
});

async function persistOnboarding(payload: OnboardingPayload): Promise<void> {
    // await fetchApi("PATCH", "/auth/v1/profile", payload);
    void payload;

    const cookieStore = await cookies();
    cookieStore.delete(ONBOARDING_PENDING_COOKIE);
    cookieStore.set(ONBOARDING_COMPLETE_COOKIE, "1", onboardingCookieOptions);
}

export async function completeOnboarding(
    payload: OnboardingPayload
): Promise<OnboardingResult> {
    const parsed = payloadSchema.safeParse(payload);
    if (!parsed.success) {
        return { success: false, error: "Invalid onboarding details" };
    }

    await persistOnboarding(parsed.data);
    return { success: true };
}

export async function skipOnboarding(): Promise<OnboardingResult> {
    await persistOnboarding(DEFAULT_ONBOARDING_PAYLOAD);
    return { success: true };
}
