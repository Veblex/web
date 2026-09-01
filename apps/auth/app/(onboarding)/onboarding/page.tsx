import { Onboarding } from "@/components/onboarding/onboarding";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Set up your account",
    description: "Complete your Veblex account so everything feels like yours",
    alternates: {
        canonical: "/onboarding",
    },
};

export default function Page() {
    return <Onboarding />;
}
