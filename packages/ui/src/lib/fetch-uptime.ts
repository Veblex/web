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

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: UptimeData; expiresAt: number }>();

export async function fetchUptime(apiKey: string): Promise<UptimeData> {
    const cacheKey = apiKey.trim();
    const cached = cache.get(cacheKey);

    if (cached && Date.now() < cached.expiresAt) {
        return cached.data;
    }

    const res = await fetch("https://api.veblex.com/health/uptime", {
        headers: { "x-api-key": apiKey.trim() },
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Uptime fetch failed: ${res.status} — ${body}`);
    }

    const data: UptimeData = await res.json();
    cache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });

    return data;
}
