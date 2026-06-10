import { ResetPassword } from "@/components/auth/reset-password";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Change password",
    description: "Change your Veblex account password",
    alternates: {
        canonical: "/reset-password",
    },
};

export default function Page() {
    return <ResetPassword />;
}
