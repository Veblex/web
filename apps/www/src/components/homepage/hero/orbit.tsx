import { cn } from "@workspace/ui/lib/utils";
import { Calendar, Dumbbell, Film, Lock } from "lucide-react";
import type { ComponentType } from "react";

type Item = {
    icon?: ComponentType<{ className?: string }>;
    label?: string;
    angle: number;
};

const inner: Item[] = [
    { icon: Dumbbell, label: "Gym", angle: 20 },
    { icon: Calendar, label: "Calendar", angle: 140 },
    { icon: Film, label: "Moviestix", angle: 260 },
];
const outer: Item[] = [0, 60, 120, 180, 240, 300].map((a) => ({
    angle: a + 30,
}));

function Ring({
    items,
    radius,
    dur,
    reverse,
}: {
    items: Item[];
    radius: number;
    dur: string;
    reverse?: boolean;
}) {
    const spin = reverse ? "animate-orbit-ccw" : "animate-orbit-cw";
    const counter = reverse ? "animate-orbit-cw" : "animate-orbit-ccw";
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div
                className="absolute rounded-full border border-dashed border-primary/30"
                style={{ width: `${radius * 2}%`, height: `${radius * 2}%` }}
            />
            <div
                className={`absolute inset-0 ${spin}`}
                style={{ ["--dur" as string]: dur }}
            >
                {items.map((it, i) => {
                    const rad = (it.angle * Math.PI) / 180;
                    const x = 50 + radius * Math.cos(rad);
                    const y = 50 + radius * Math.sin(rad);
                    const Icon = it.icon;
                    return (
                        <div
                            key={i}
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${x}%`, top: `${y}%` }}
                        >
                            <div
                                className={counter}
                                style={{ ["--dur" as string]: dur }}
                            >
                                {Icon ? (
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-card text-primary shadow-lg sm:h-16 sm:w-16">
                                            <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                                        </div>
                                        <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                                            {it.label}
                                        </span>
                                    </div>
                                ) : (
                                    <div
                                        className="h-3 w-3 rounded-sm bg-primary/25"
                                        title="Coming soon"
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function Orbit({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "relative mx-auto aspect-square w-full max-w-130",
                className
            )}
            aria-hidden="true"
        >
            <Ring items={outer} radius={47} dur="70s" reverse />
            <Ring items={inner} radius={33} dur="45s" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute h-[34%] w-[34%] animate-lock-glow rounded-full bg-primary/40 blur-3xl" />
                <div className="relative flex h-[30%] w-[30%] flex-col items-center justify-center gap-1 rounded-[28%] bg-brand text-brand-foreground shadow-2xl ring-1 ring-primary/40">
                    <Lock
                        className="h-1/3 w-1/3 text-primary"
                        strokeWidth={2.2}
                    />
                    <span className="font-mono text-xs font-semibold tracking-[0.2em] uppercase">
                        Auth
                    </span>
                </div>
            </div>
        </div>
    );
}
