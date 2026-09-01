export const THEME_COOKIE_NAME = "veblex-theme";
export const THEME_STORAGE_KEY = "theme";
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const THEME_VALUES = ["light", "dark", "system"] as const;

export type ThemeValue = (typeof THEME_VALUES)[number];

export function isThemeValue(value: unknown): value is ThemeValue {
    return (
        value === "light" || value === "dark" || value === "system"
    );
}

export function getThemeCookieDomain(
    hostname: string
): string | undefined {
    if (hostname === "localhost" || hostname.endsWith(".localhost")) {
        return undefined;
    }
    if (hostname === "veblex.com" || hostname.endsWith(".veblex.com")) {
        return ".veblex.com";
    }
    return undefined;
}

function readCookie(name: string): string | null {
    if (typeof document === "undefined") {
        return null;
    }

    const match = document.cookie.match(
        new RegExp(`(?:^|; )${name}=([^;]*)`)
    );
    if (!match?.[1]) {
        return null;
    }

    try {
        return decodeURIComponent(match[1]);
    } catch {
        return null;
    }
}

export function readThemePreference(): ThemeValue | null {
    const fromCookie = readCookie(THEME_COOKIE_NAME);
    if (isThemeValue(fromCookie)) {
        return fromCookie;
    }

    if (typeof localStorage === "undefined") {
        return null;
    }

    try {
        const fromStorage = localStorage.getItem(THEME_STORAGE_KEY);
        return isThemeValue(fromStorage) ? fromStorage : null;
    } catch {
        return null;
    }
}

export function persistThemePreference(theme: ThemeValue): void {
    if (!isThemeValue(theme)) {
        return;
    }

    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        /* private mode / blocked storage */
    }

    if (typeof document === "undefined") {
        return;
    }

    const parts = [
        `${THEME_COOKIE_NAME}=${encodeURIComponent(theme)}`,
        "Path=/",
        `Max-Age=${THEME_COOKIE_MAX_AGE}`,
        "SameSite=Lax",
    ];

    const domain = getThemeCookieDomain(window.location.hostname);
    if (domain) {
        parts.push(`Domain=${domain}`);
    }
    if (window.isSecureContext) {
        parts.push("Secure");
    }

    document.cookie = parts.join("; ");
}

export const THEME_INIT_SCRIPT = `(function(){var n=${JSON.stringify(THEME_COOKIE_NAME)};var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=null;var parts=document.cookie.split("; ");for(var i=0;i<parts.length;i++){if(parts[i].indexOf(n+"=")===0){try{t=decodeURIComponent(parts[i].slice(n.length+1))}catch(e){t=null}break}}if(t!=="light"&&t!=="dark"&&t!=="system")t=null;if(t){try{localStorage.setItem(k,t)}catch(e){}}else{try{t=localStorage.getItem(k)}catch(e){t=null}}if(t!=="light"&&t!=="dark"&&t!=="system")t="system";var r=t==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):t;var el=document.documentElement;el.classList.remove("light","dark");el.classList.add(r);el.style.colorScheme=r})();`;
