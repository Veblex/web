import { buttonVariants } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

import { Orbit } from "@components/homepage/hero/orbit";

export function Hero() {
    return (
        <section className="relative flex min-h-[50vh] flex-col items-center justify-center md:py-12">
            {/* Background color blobs */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,var(--accent),transparent_60%)] opacity-60"></div>

            <div className="relative container grid grid-cols-1 overflow-clip px-4 py-12 sm:px-6 sm:py-18 lg:grid-cols-2 lg:px-8">
                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl font-semibold text-balance sm:text-5xl lg:text-6xl">
                        Secure login, track workouts, movies, and more!
                    </h1>

                    <p className="mt-2 mb-6 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                        Sign up for Veblex at no cost and get access to our
                        growing family of apps — fitness, calendar, movies, and
                        plenty more on the way.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <a
                            href="https://auth.veblex.com/"
                            className={cn(
                                buttonVariants({
                                    variant: "default",
                                    size: "lg",
                                })
                            )}
                        >
                            Create your free account
                        </a>
                        <a
                            className={cn(
                                buttonVariants({
                                    variant: "secondary",
                                    size: "lg",
                                }),
                                "text-foreground"
                            )}
                            href="/services"
                        >
                            Explore all services
                        </a>
                    </div>
                </div>

                <Orbit className="hidden lg:flex" />
            </div>
        </section>
    );
}
