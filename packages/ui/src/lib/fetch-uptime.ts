type Service = {
    service: string;
    status: "paused" | "pending" | "maintenance" | "up" | "validating" | "down";
    lastCheckedAt: string;
};

interface SuccessData {
    status: "ok" | "degraded";
    services: Service[];
}
interface ErrorData {
    error: string;
}

export type UptimeData = ErrorData | SuccessData;

export async function fetchUptime(apiKey: string): Promise<UptimeData> {
    const res = await fetch("https://api.veblex.com/health/uptime", {
        headers: { "x-api-key": apiKey },
    });
    if (!res.ok) throw new Error(`Uptime fetch failed: ${res.status}`);
    return res.json();
}
