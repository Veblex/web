import { Signup } from "@/components/auth/signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create your account",
    description: "Create your Veblex account to gain access to all Veblex services",
    alternates: {
        canonical: "/signup"
    }
};

export default function Page() {
    return <Signup />;
}
