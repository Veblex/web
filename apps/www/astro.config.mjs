// @ts-check

import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";

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
            name: "Rubik",
            cssVariable: "--font-sans",
        },
    ],
    integrations: [react()],
});
