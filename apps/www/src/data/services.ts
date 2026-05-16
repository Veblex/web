type Service = {
    title: string;
    description: string;
    category: string;
    features: string[];
    href: string;
    status: "released" | "in progress" | "coming soon" | "on hold";
    isCore: boolean;
};

const services: Service[] = [
    {
        title: "Veblex Auth",
        description:
            "Single sign-on service providing secure, unified authentication across all Veblex products.",
        category: "Security",
        features: ["SSO", "OAuth 2.0", "Role-based access", "Two-factor auth"],
        href: "https://auth.veblex.com",
        status: "in progress",
        isCore: true,
    },
    {
        title: "Veblex Gym",
        description:
            "Track workouts, set goals, and analyze performance with a complete fitness management platform.",
        category: "Fitness",
        features: [
            "Workout tracking",
            "Goal setting",
            "Performance analytics",
            "Progress reports",
        ],
        status: "in progress",
        href: "https://gym.veblex.com",
        isCore: true,
    },
    {
        title: "Veblex Calendar",
        description:
            "Smart scheduling with cross-service sync. Plan across your entire Veblex ecosystem effortlessly.",
        category: "Productivity",
        features: [
            "Cross-service sync",
            "Smart scheduling",
            "Team calendars",
            "Reminders",
        ],
        status: "coming soon",
        href: "https://calendar.veblex.com",
        isCore: true,
    },
    {
        title: "Moviestix",
        description:
            "Track what you're watching, manage your watchlist, see detailed progress on shows.",
        category: "Productivity",
        features: ["Watchlist", "Tracking", "Recommendation", "Movies/shows"],
        status: "in progress",
        href: "https://www.moviestix.com",
        isCore: false,
    },
];

export { services, type Service };
