export function decodeJwtPayload(token: string): { exp?: number } | null {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;
        const json = Buffer.from(payload, "base64url").toString("utf8");
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function isExpired(token?: string): boolean {
    if (!token) return true;
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
}
