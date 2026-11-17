import "@workspace/ui/globals.css";

import type { Metadata } from "next";
import { Manrope, Noto_Sans_Symbols_2, JetBrains_Mono } from "next/font/google";

import { cn } from "@workspace/ui/lib/utils";
import { THEME_INIT_SCRIPT } from "@workspace/ui/lib/theme-storage";
import { ThemeProvider } from "@workspace/ui/components/theme-provider";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { Toaster } from "@workspace/ui/components/sonner";

const fontSans = Manrope({
    subsets: ["latin"],
    variable: "--font-sans",
});
const fontHeading = Noto_Sans_Symbols_2({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-heading",
});

const fontMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://auth.veblex.com"),
    title: {
        template: "%s | Veblex",
        default: "Veblex",
    },
    description: "Sign in to your Veblex account",
    applicationName: "Veblex Auth",
    referrer: "origin-when-cross-origin",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
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
                fontHeading.variable,
                "font-sans",
                fontSans.variable
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
