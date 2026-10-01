// @ts-check

import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";
import vercelStatic from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
    security: {
        csp: {
            scriptDirective: {
                hashes: ["sha256-HhvVly3UHsTe6nCRESGrH8miX/za8Qy/gmp7tLHwBvQ="],
            },
            styleDirective: {
                hashes: ["sha256-skqujXORqzxt1aE0NNXxujEanPTX6raoqSscTV/Ww/Y="],
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
            cssVariable: "--font-sans",
        },
        {
            provider: fontProviders.fontsource(),
            name: "Space Grotesk",
            cssVariable: "--font-heading",
        },
        {
            provider: fontProviders.fontsource(),
            name: "JetBrains Mono",
            cssVariable: "--font-mono",
        },
    ],
    integrations: [react()],
    output: "static",
    adapter: vercelStatic(),
});
