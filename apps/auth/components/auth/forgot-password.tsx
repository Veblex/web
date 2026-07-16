"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@workspace/ui/components/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import Link from "next/link";
import { Header } from "@/components/auth/header";

import { requestPasswordReset } from "@/lib/actions/reset-password";

const formSchema = z.object({
    email: z.string().email("Enter a valid email").max(255),
});

export function ForgotPassword() {
    const [sent, setSent] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const result = await requestPasswordReset(data);

        if (!result.success) {
            toast.error(result.error.toString());
            return;
        }

        setSent(true);
    }

    return (
        <>
            <Header
                title={sent ? "Check your inbox" : "Reset your password"}
                description={
                    sent
                        ? "If an account exists for that email, we've sent reset instructions."
                        : "Enter the email associated with your Veblex account."
                }
            />

            {!sent ? (
                <form
                    id="forgot-password"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <Button
                        type="submit"
                        form="forgot-password"
                        className="h-11 w-full font-medium"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting
                            ? "Sending…"
                            : "Send reset link"}
                    </Button>
                </form>
            ) : (
                <Button className="h-11 w-full font-medium" asChild>
                    <Link href="/login">Back to sign in</Link>
                </Button>
            )}

            <p className="text-center text-muted-foreground">
                Remember it?{" "}
                <Link
                    className="text-foreground underline-offset-2 hover:underline"
                    href={"/login"}
                >
                    Sign in
                </Link>
            </p>
        </>
    );
}
