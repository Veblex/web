// @ts-check

import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";
import vercelStatic from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
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
            name: "IBM Plex Sans",
            cssVariable: "--font-heading",
        },
        {
            provider: fontProviders.fontsource(),
            name: "Oxanium",
            cssVariable: "--font-sans",
        },
    ],
    integrations: [react()],
    output: "static",
    adapter: vercelStatic(),
});
