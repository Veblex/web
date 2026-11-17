import { buttonVariants } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import {
    Calendar,
    CodeXml,
    Dumbbell,
    EyeOff,
    Film,
    KeyRound,
    ShieldCheck,
} from "lucide-react";

export function AuthShowcase() {
    return (
        <section>
            <div className="container mx-auto grid items-center gap-16 px-6 py-24 sm:px-6 sm:py-40 lg:grid-cols-2 lg:px-8">
                <div
                    className="hidden items-center justify-center lg:flex"
                    aria-hidden="true"
                >
                    <div className="glow-box flex w-full max-w-96 flex-col gap-6 rounded-xl bg-card p-8">
                        <div className="space-y-2 text-center">
                            <p className="text-2xl font-semibold">Sign in</p>
                            <p className="text-muted-foreground">
                                Sign in to your Veblex account
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Username or email
                                </p>
                                <div className="flex min-h-11 items-center rounded-lg border border-input bg-background/60 px-4 py-2">
                                    <span className="pointer-events-none text-sm text-muted-foreground">
                                        you@example.com
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Password
                                </p>
                                <div className="flex min-h-11 items-center rounded-lg border border-input bg-background/60 px-4 py-2">
                                    <span className="pointer-events-none text-sm text-muted-foreground">
                                        ••••••••••
                                    </span>
                                </div>
                            </div>

                            <span
                                className={cn(
                                    buttonVariants({
                                        variant: "default",
                                        size: "lg",
                                    }),
                                    "hover:bg-primary hover:cursor-default"
                                )}
                            >
                                Sign in
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            <div className="flex gap-2">
                                <div
                                    className="w-fit rounded-lg bg-accent/30 p-2.5"
                                    aria-hidden="true"
                                >
                                    <Dumbbell className="size-4 text-primary" />
                                </div>
                                <div
                                    className="w-fit rounded-lg bg-accent/30 p-2.5"
                                    aria-hidden="true"
                                >
                                    <Calendar className="size-4 text-primary" />
                                </div>
                                <div
                                    className="w-fit rounded-lg bg-accent/30 p-2.5"
                                    aria-hidden="true"
                                >
                                    <Film className="size-4 text-primary" />
                                </div>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                One login for all of these
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-3xl font-bold md:text-5xl">
                            Free, secure sign-in for everything Veblex
                        </h2>
                        <p className="text-muted-foreground">
                            Veblex Auth is the key to our whole ecosystem.
                            Create it once, and every Veblex app just works. No
                            new accounts, no extra passwords.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div
                                className="rounded-xl bg-accent/60 p-3"
                                aria-hidden="true"
                            >
                                <KeyRound className="size-5 text-primary" />
                            </div>

                            <div>
                                <p>One account</p>
                                <p className="text-sm text-muted-foreground">
                                    Sign in once and move between services
                                    freely.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div
                                className="rounded-xl bg-accent/60 p-3"
                                aria-hidden="true"
                            >
                                <ShieldCheck className="size-5 text-primary" />
                            </div>

                            <div>
                                <p>Built for security</p>
                                <p className="text-sm text-muted-foreground">
                                    Modern protection for your account, by
                                    default.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div
                                className="rounded-xl bg-accent/60 p-3"
                                aria-hidden="true"
                            >
                                <EyeOff className="size-5 text-primary" />
                            </div>

                            <div>
                                <p>Private by design</p>
                                <p className="text-sm text-muted-foreground">
                                    Your data isn't for sale. Ever.
                                </p>
                            </div>
                        </div>
                    </div>

                    <a
                        className="flex items-center gap-3 rounded-xl border border-dashed p-4"
                        href="/docs"
                    >
                        <CodeXml className="size-4 text-primary" />
                        <p className="text-sm">
                            <strong>For developers:</strong> add “Sign in with
                            Veblex” to your own app with our SSO integrations.
                        </p>
                    </a>
                </div>
            </div>
        </section>
    );
}
