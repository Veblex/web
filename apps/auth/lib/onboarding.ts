export const ONBOARDING_PENDING_COOKIE = "onboardingPending";
export const ONBOARDING_COMPLETE_COOKIE = "onboardingComplete";

export const ONBOARDING_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const onboardingCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONBOARDING_COOKIE_MAX_AGE,
} as const;

export const AVATAR_HUES = [
    "chart-1",
    "chart-2",
    "chart-3",
    "chart-4",
    "chart-5",
] as const;

export type AvatarHue = (typeof AVATAR_HUES)[number];

export const INTERESTS = ["gym", "calendar", "moviestix", "auth"] as const;

export type Interest = (typeof INTERESTS)[number];

export type OnboardingPayload = {
    displayName: string;
    avatarHue: AvatarHue;
    interests: Interest[];
};

export const DEFAULT_ONBOARDING_PAYLOAD: OnboardingPayload = {
    displayName: "",
    avatarHue: "chart-3",
    interests: [],
};

export const INTEREST_OPTIONS: {
    id: Interest;
    category: string;
    title: string;
    description: string;
}[] = [
    {
        id: "gym",
        category: "Fitness",
        title: "Veblex Gym",
        description:
            "Track workouts, set goals, and analyze performance.",
    },
    {
        id: "calendar",
        category: "Productivity",
        title: "Veblex Calendar",
        description: "Smart scheduling with cross-service sync.",
    },
    {
        id: "moviestix",
        category: "Watchlist",
        title: "Moviestix",
        description: "Track what you're watching and manage your watchlist.",
    },
    {
        id: "auth",
        category: "Security",
        title: "Veblex Auth",
        description: "One account across every Veblex product.",
    },
];
