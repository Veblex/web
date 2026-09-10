"use client";

import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { FullDark, FullLight } from "@workspace/ui/brand-icons";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
            <header className="fixed top-0 z-50 w-full">
                <div className="mx-auto flex h-16 max-w-3xl items-center px-4">
                    <Link href="/" className="flex items-end gap-1.5">
                        <span className="w-26">
                            <FullLight className="not-dark:hidden" />
                            <FullDark className="dark:hidden" />
                        </span>
                        <span className="font-mono text-lg leading-3.5">
                            Flow
                        </span>
                    </Link>
                </div>
            </header>
            <div className="space-y-4 text-center">
                <p className="font-mono text-sm text-muted-foreground uppercase">
                    404
                </p>
                <h1 className="font-heading text-3xl font-semibold">
                    Page not found
                </h1>
                <Button onClick={() => router.push("/")}>
                    <ArrowLeft />
                    Back to the log
                </Button>
            </div>
        </div>
    );
}
