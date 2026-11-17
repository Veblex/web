import { Card } from "@workspace/ui/components/card";
import { LayoutGrid, LogIn, UserPlus, type LucideIcon } from "lucide-react";

type Stage = {
    icon: LucideIcon;
    title: string;
    description: string;
};

const stages: Stage[] = [
    {
        icon: UserPlus,
        title: "Create your free account",
        description: "Sign up for veblex Auth - it's free and always will be.",
    },
    {
        icon: LogIn,
        title: "Sign in once",
        description: "Your single login travels with you across Veblex.",
    },
    {
        icon: LayoutGrid,
        title: "Use every service",
        description:
            "Jump into Gym, Calendar, Moviestix and whatever comes next.",
    },
];

export function Stages() {
    return (
        <section>
            <div className="container mx-auto flex flex-col items-center px-4 py-24 sm:px-6 sm:py-40 sm:pb-0 lg:px-8">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                    Up and running in a minute
                </h2>

                <div className="mt-10 grid w-full gap-6 md:grid-cols-3">
                    {stages.map((stage) => (
                        <Card className="gap-2">
                            <div className="mb-2">
                                <stage.icon className="size-8 text-primary" />
                            </div>

                            <p className="text-lg font-semibold">
                                {stage.title}
                            </p>
                            <p className="text-muted-foreground">
                                {stage.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
