"use client";

import { useUptime } from "@workspace/ui/lib/use-uptime";

import { cva } from "class-variance-authority";
import { cn } from "@workspace/ui/lib/utils";

interface Props {
    className?: string;
    pollInterval?: number;
}

const badgeVariants = cva("flex size-2.5 rounded-full ring-3", {
    variants: {
        status: {
            ok: "bg-green-500 ring-green-300 dark:ring-green-800",
            degraded: "bg-yellow-500 ring-yellow-500/40",
            down: "bg-red-500 ring-red-500/35",
            unkown: "animate-pulse bg-blue-400 ring-blue-400/30 animation-duration-[4s]",
        },
    },
    defaultVariants: {
        status: "ok",
    },
});

export function UptimeWidget({ className, pollInterval = 0 }: Props) {
    const { data, error } = useUptime(pollInterval);

    const status = error || !data || "error" in data ? "unkown" : data.status;

    const messages: Record<string, string> = {
        ok: "All services up",
        degraded: "Degraded services",
        down: "Services are down",
    };
    const statusMessage = messages[status] ?? "Checking status";

    return (
        <a
            href="https://status.veblex.com/"
            target="_blank"
            rel="noreferrer"
            className={cn(
                "flex items-center gap-2.5 text-sm text-muted-foreground",
                className
            )}
        >
            <span className={cn(badgeVariants({ status }))}></span>
            {statusMessage}
        </a>
    );
}
