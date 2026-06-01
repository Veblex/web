"use client";

import { CSSProperties, useState } from "react";
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
import { Header } from "@/components/auth/form";

const formSchema = z.object({
    email: z.string().email(),
});

export default function Page() {
    const [sent, setSent] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        await new Promise((r) => setTimeout(r, 600));
        setSent(true);

        toast("The form is not yet complete", {
            description: (
                <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
                    <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
            position: "bottom-right",
            classNames: {
                content: "flex flex-col gap-2",
            },
            style: {
                "--border-radius": "calc(var(--radius)  + 4px)",
            } as CSSProperties,
        });
    }

    return (
        <div className="space-y-6">
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
                    id="form-forgot-password"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-forgot-password-email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-forgot-password-email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="you@example.com"
                                        autoComplete="username email"
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
                        form="form-forgot-password"
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
        </div>
    );
}
