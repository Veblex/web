type Service = {
    service: string;
    status: string;
    lastCheckedAt: string;
};

export interface UptimeData {
    status: string;
    services: Service[];
}

export async function fetchUptime(apiKey: string): Promise<UptimeData> {
    const res = await fetch("http://localhost:3000/health/uptime", {
        headers: { "x-api-key": apiKey },
    });
    if (!res.ok) throw new Error(`Uptime fetch failed: ${res.status}`);
    return res.json();
}
