export function getOrigin(request: Request): string {
    const host =
        request.headers.get("x-forwarded-host") ??
        request.headers.get("host") ??
        new URL(request.url).host;

    const proto =
        request.headers.get("x-forwarded-proto")?.split(",")[0].trim() ??
        "https";

    return `${proto}://${host}`;
}
