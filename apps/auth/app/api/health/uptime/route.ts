import { fetchUptime } from "@workspace/ui/lib/fetch-uptime";

export async function GET() {
    const apiKey = process.env.API_KEY_UPTIME;

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
}




