"use client";

import { useEffect, useState } from "react";
import type { UptimeData } from "./fetch-uptime";

export function useUptime(pollInterval = 0) {
    const [data, setData] = useState<UptimeData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = () =>
            fetch("/api/health/uptime")
                .then((r) => r.json())
                .then(setData)
                .catch(() => setError("Failed to load uptime"));

        load();
        if (pollInterval > 0) {
            const id = setInterval(load, pollInterval);
            return () => clearInterval(id);
        }
    }, [pollInterval]);

    return { data, error };
}
