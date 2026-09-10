import "@workspace/ui/globals.css";

import type { Metadata } from "next";
import { Geist_Mono, Oxanium, IBM_Plex_Sans } from "next/font/google";

import { cn } from "@workspace/ui/lib/utils";
import { THEME_INIT_SCRIPT } from "@workspace/ui/lib/theme-storage";
import { ThemeProvider } from "@workspace/ui/components/theme-provider";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { Toaster } from "@workspace/ui/components/sonner";

const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" });
const ibm = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-heading" });

const fontMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://flow.veblex.com"),
    title: {
        template: "%s | Veblex Flow",
        default: "Veblex Flow",
    },
    description: "Log hours across clients and projects, session by session.",
    applicationName: "Veblex Flow",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn(
                "antialiased",
                fontMono.variable,
                "font-heading",
                ibm.variable,
                "font-sans",
                oxanium.variable
            )}
        >
            <head>
                <script
                    dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
                />
                <link rel="icon" href="/favicon.svg" sizes="any" />
            </head>
            <body>
                <ThemeProvider>
                    <TooltipProvider>
                        {children}
                        <Toaster />
                    </TooltipProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
