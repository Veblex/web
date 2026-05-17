import type { APIRoute } from "astro";
import { fetchUptime } from "@workspace/ui/lib/fetch-uptime";

export const GET: APIRoute = async () => {
    const apiKey = import.meta.env.API_KEY_UPTIME;

    if (!apiKey) {
        return new Response(JSON.stringify({ error: "Missing API key" }), {
            status: 500,
        });
    }

    try {
        const data = await fetchUptime(apiKey);
        return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("[uptime] Upstream fetch failed:", err);
        return new Response(
            JSON.stringify({ error: "Upstream failed", detail: String(err) }),
            { status: 502 }
        );
    }
};
