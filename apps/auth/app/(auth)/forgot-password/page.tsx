import { ForgotPassword } from "@/components/auth/forgot-password";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reset your password",
    description: "",
    alternates: {
        canonical: "/forgot-password"
    }
};

export default function Page() {
    return <ForgotPassword/>
}
