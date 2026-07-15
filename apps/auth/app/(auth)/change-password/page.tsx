import { ChangePassword } from "@/components/auth/change-password";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Change password",
    description: "Change your Veblex account password",
    alternates: {
        canonical: "/change-password",
    },
};

export default function Page() {
    return <ChangePassword />;
}
