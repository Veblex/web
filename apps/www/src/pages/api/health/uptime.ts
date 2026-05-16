import type { APIRoute } from "astro";
import { fetchUptime } from "@workspace/ui/lib/fetch-uptime";

export const GET: APIRoute = async () => {
    try {
        const data = await fetchUptime(import.meta.env.API_KEY_UPTIME);
        return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json" },
        });
    } catch {
        return new Response(JSON.stringify({ error: "Upstream failed" }), {
            status: 502,
        });
    }
};
