import { headers } from "next/headers";

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly body: unknown
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export type ApiResult<T> =
    | { ok: true; data: T; status: number }
    | { ok: false; error: ApiError; status: number };

function getEnvVar(name: string): string | null {
    const value = process.env[name];
    if (!value) {
        return null;
    }
    return value;
}

function stripTrailingSlashes(value: string): string {
    return value.replace(/\/+$/, "");
}

function ensureLeadingSlash(value: string): string {
    return value.startsWith("/") ? value : `/${value}`;
}

async function getForwardedClientHeaders(): Promise<HeadersInit> {
    try {
        const incoming = await headers();

        const forwardedFor =
            incoming.get("x-forwarded-for") ?? incoming.get("x-real-ip");
        const userAgent = incoming.get("user-agent");

        const result: Record<string, string> = {};
        if (forwardedFor) result["x-forwarded-for"] = forwardedFor;
        if (userAgent) result["user-agent"] = userAgent;

        return result;
    } catch {
        return {};
    }
}

export const fetchApi = async <TResponse = unknown, TBody = unknown>(
    method: string,
    endpoint: string,
    body: TBody,
    headers?: HeadersInit
): Promise<ApiResult<TResponse>> => {
    try {
        const apiUrl = stripTrailingSlashes(getEnvVar("API_URL") ?? "");
        const apiBasic = getEnvVar("API_BASIC");
        const apiKey = getEnvVar("API_KEY_AUTH");
        const normalizedEndpoint = ensureLeadingSlash(endpoint);

        if (!apiUrl) {
            return {
                ok: false,
                error: new ApiError(
                    "Missing required environment variable: API_URL",
                    null
                ),
                status: 400,
            };
        }
        if (!apiKey) {
            return {
                ok: false,
                error: new ApiError(
                    "Missing required environment variable: API_KEY_AUTH",
                    null
                ),
                status: 400,
            };
        }

        const forwardedClientHeaders = await getForwardedClientHeaders();

        const response = await fetch(`${apiUrl}${normalizedEndpoint}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                ...(apiBasic ? { Authorization: `Basic ${apiBasic}` } : {}),
                ...forwardedClientHeaders,
                ...headers,
            },
            body: JSON.stringify(body),
            cache: "no-store",
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            return {
                ok: false,
                error: new ApiError(
                    `API request to ${normalizedEndpoint} failed with status ${response.status}`,
                    errorBody
                ),
                status: response.status,
            };
        }

        const text = await response.text();
        return {
            ok: true,
            data: (text ? JSON.parse(text) : undefined) as TResponse,
            status: response.status,
        };
    } catch (err) {
        return {
            ok: false,
            error:
                err instanceof Error
                    ? new ApiError(err.message, null)
                    : new ApiError("Unknown error", null),
            status: 0,
        };
    }
};
