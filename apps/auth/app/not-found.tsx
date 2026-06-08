"use client";

import { Button } from "@workspace/ui/components/button";

import Link from "next/link";
import { FullDark, FullLight } from "@workspace/ui/brand-icons";
import { ArrowLeft, ChevronRight } from "lucide-react";

import { useRouter } from "next/navigation";

type NavLink = {
    title: string;
    href?: string;
};

const navLinks: NavLink[] = [
    {
        title: "Secured by Veblex",
    },
    {
        title: "Privacy",
        href: "https://www.veblex.com/legal/privacy",
    },
    {
        title: "Terms",
        href: "https://www.veblex.com/legal/terms",
    },
];

export default function NotFound() {
    const router = useRouter();

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.replace("/");
        }
    };

    return (
        <div className="relative">
            <header className="fixed z-50 max-h-16 w-full">
                <div className="mx-auto flex h-16 items-center justify-between px-4 py-2 sm:px-12">
                    <Link href={"/"} className="flex items-end gap-1.5">
                        <span className="w-26">
                            <FullLight className="not-dark:hidden" />
                            <FullDark className="dark:hidden" />
                        </span>
                        <span className="font-mono text-lg leading-3.5">
                            Auth
                        </span>
                    </Link>
                </div>
            </header>

            {/* Decorational background pieces */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 size-64 translate-x-1/3 -translate-y-1/3 animate-pulse-glow rounded-full bg-chart-4/6 blur-3xl md:size-96 lg:size-128"></div>
                <div className="absolute bottom-0 left-0 size-48 -translate-x-1/3 translate-y-1/3 animate-float rounded-full bg-chart-2/5 blur-3xl md:size-72 lg:size-96"></div>
            </div>

            <div className="relative z-40 flex min-h-screen animate-fade-in flex-col items-center justify-center gap-8 pt-16">
                <main className="w-full max-w-lg px-4">
                    <div className="relative space-y-3">
                        <div className="absolute -top-[70%] -left-[20%] size-48 animate-float rounded-full bg-chart-2/2 blur-3xl md:size-48 lg:size-54"></div>

                        <span className="mb-4 flex text-6xl text-muted-foreground">
                            404
                        </span>

                        <h1 className="text-2xl sm:text-3xl">Page not found</h1>
                        <p className="text-base text-muted-foreground">
                            The page you are looking for has either moved, or
                            been deleted
                        </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                        <Button className="px-7 py-5" onClick={handleBack}>
                            <ArrowLeft className="size-4" />
                            <span>Go back</span>
                        </Button>
                        <Link href={"/login"}>
                            <Button variant={"outline"} className="px-7 py-5">
                                <span>Login to Veblex</span>
                                <ChevronRight className="size-4" />
                            </Button>
                        </Link>
                    </div>
                </main>
                <footer>
                    <nav className="flex gap-6">
                        {navLinks.map((link) => (
                            <li
                                key={link.title}
                                className="relative list-none font-mono text-xs text-muted-foreground after:absolute after:top-1/2 after:-right-3 after:size-0.5 after:translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-muted-foreground last:after:hidden"
                            >
                                {link.href ? (
                                    <Link
                                        href={link.href}
                                        className="transition-colors hover:text-foreground"
                                    >
                                        {link.title}
                                    </Link>
                                ) : (
                                    <p>{link.title}</p>
                                )}
                            </li>
                        ))}
                    </nav>
                </footer>
            </div>
        </div>
    );
}
