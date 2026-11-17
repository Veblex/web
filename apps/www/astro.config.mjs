// @ts-check

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";
import vercelStatic from "@astrojs/vercel";
import { THEME_INIT_SCRIPT } from "@workspace/ui/lib/theme-storage";

const requireFromUi = createRequire(
    fileURLToPath(new URL("../../packages/ui/package.json", import.meta.url)),
);

/**
 * @param {string} content
 * @returns {`sha256-${string}`}
 */
function sha256(content) {
    return /** @type {`sha256-${string}`} */ (
        `sha256-${createHash("sha256").update(content).digest("base64")}`
    );
}

// next-themes injects this style at runtime. The string literal survives the
// bundle, so the hash can be taken from the installed package. The inline
// script cannot: Vite rewrites that function, and root.astro hashes the
// rendered source instead.
function nextThemesStyleHash() {
    const bundlePath = join(
        dirname(requireFromUi.resolve("next-themes")),
        "index.mjs",
    );
    const src = readFileSync(bundlePath, "utf8");
    const cssMatch = src.match(/createTextNode\("([^"]+)"\)/);
    if (!cssMatch) {
        throw new Error(
            "next-themes bundle shape changed; update CSP hash extraction",
        );
    }

    return sha256(cssMatch[1]);
}

const nextThemesStyleHashValue = nextThemesStyleHash();

// https://astro.build/config
export default defineConfig({
    security: {
        csp: {
            scriptDirective: {
                hashes: [sha256(THEME_INIT_SCRIPT)],
            },
            styleDirective: {
                hashes: [nextThemesStyleHashValue],
                resources: [
                    { resource: "'unsafe-inline'", kind: "attribute" },
                ],
            },
        },
    },
    site: process.env.SITE_URL ?? "http://localhost:4321",
    vite: {
        plugins: [tailwindcss()],
        optimizeDeps: {
            include: ["react", "react-dom", "react-dom/client"],
        },
        ssr: {
            noExternal: ["@workspace/ui"],
        },
    },
    fonts: [
        {
            provider: fontProviders.fontsource(),
            name: "Manrope",
            cssVariable: "--font-manrope",
        },
        {
            provider: fontProviders.fontsource(),
            name: "Noto Sans Symbols 2",
            cssVariable: "--font-noto-sans-symbols-2",
        },
        {
            provider: fontProviders.fontsource(),
            name: "JetBrains Mono",
            cssVariable: "--font-jetbrains-mono",
        },
    ],
    integrations: [react()],
    output: "static",
    adapter: vercelStatic(),
});
