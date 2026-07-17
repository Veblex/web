import type { Metadata } from "next";
import { Login } from "@/components/auth/login";

export const metadata: Metadata = {
    title: "Login",
    description: "Sign in to your Veblex account",
    alternates: {
        canonical: "/login"
    }
};

export default function Page() {
    return <Login />;
}
