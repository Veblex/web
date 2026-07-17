import { ResetPassword } from "@/components/auth/reset-password";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { verifyResetToken } from "@/lib/actions/reset-password";

export const metadata: Metadata = {
    title: "Change password",
    description: "Change your Veblex account password",
    alternates: {
        canonical: "/reset-password",
    },
};

type PageProps = {
    searchParams: Promise<{ code?: string; email?: string; from?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
    const { code, email, from } = await searchParams;
    if (!code || !email) {
        redirect("/forgot-password");
    }

    let validCode = true;

    const tokenResult = await verifyResetToken({ code, email });
    if (!tokenResult.success) {
        if (from === "email") {
            redirect("/forgot-password");
        }
        validCode = false;
    }

    const token = tokenResult.success ? tokenResult.token : undefined;

    return <ResetPassword validCode={validCode} token={token} email={email} />;
}
