"use client";

import Link from "next/link";
import { Header } from "@/components/auth/form";
import { Email, Register, Verify } from "./(steps)";
import { useState } from "react";

export default function Page() {
    const [stage, setStage] = useState("");

    const Step =
        stage === "register" ? Register : stage === "verify" ? Verify : Email;

    return (
        <div className="space-y-6">
            <Header
                title="Create your account"
                description="Start with your email — we'll send a verification code."
            />

            {/* Stage */}
            <div></div>

            <Step onStageChange={setStage} />

            <p className="text-center text-muted-foreground">
                Already have an account?{" "}
                <Link
                    className="text-foreground underline-offset-2 hover:underline"
                    href={"/login"}
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}
