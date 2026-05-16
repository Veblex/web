type Roadmap = {
    phase: string;
    title: string;
    description: string;
};

const roadmap: Roadmap[] = [
    {
        phase: "Phase 1",
        title: "Foundation",
        description: "Veblex Auth, Gym, and Calendar launch as the core trio.",
    },
    {
        phase: "Phase 2",
        title: "Expansion",
        description:
            "New services join the ecosystem with deeper cross-service integrations.",
    },
    {
        phase: "Phase 3",
        title: "Platform",
        description:
            "Open APIs and a developer marketplace to extend every Veblex service.",
    },
];

export { roadmap, type Roadmap };
