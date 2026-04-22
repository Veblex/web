import { Geist_Mono, Oxanium } from "next/font/google";

import "@workspace/ui/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@workspace/ui/lib/utils";
import { TooltipProvider } from "@workspace/ui/components/tooltip";

const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

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
                "font-sans",
                oxanium.variable
            )}
        >
            <head>
                <link rel="icon" href="/favicon.svg" sizes="any" />
            </head>
            <body>
                <ThemeProvider>
                    <TooltipProvider>{children}</TooltipProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
