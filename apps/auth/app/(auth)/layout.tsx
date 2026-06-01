import { Card } from "@workspace/ui/components/card";
import Link from "next/link";
import { FullDark, FullLight } from "@workspace/ui/brand-icons";

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

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="relative">
            <header className="fixed z-50 max-h-16 w-full">
                <div className="container mx-auto flex h-16 items-center p-2">
                    <Link
                        href={"/"}
                        className="flex items-end gap-1.5"
                    >
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
                <div className="absolute top-0 left-0 size-64 -translate-1/3 rounded-full bg-chart-4/6 blur-3xl md:size-96 lg:size-128"></div>
                <div className="absolute right-0 bottom-0 size-48 translate-1/3 rounded-full bg-chart-1/3 blur-3xl md:size-72 lg:size-96"></div>
            </div>

            <div className="relative z-40 flex min-h-screen flex-col items-center justify-center gap-8 pt-16">
                <main className="w-full max-w-2xl px-2 sm:w-lg">
                    <Card className="glow-box w-full sm:p-8">{children}</Card>
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
