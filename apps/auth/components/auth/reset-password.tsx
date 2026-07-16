"use client";

import { CSSProperties, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
    ResetPassword as ResetPasswordAction,
} from "@/lib/actions/reset-password";

import { Button } from "@workspace/ui/components/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@workspace/ui/components/field";
import Link from "next/link";
import { Header } from "@/components/auth/header";
import { PasswordInput } from "@workspace/ui/components/password-input";

const formSchema = z
    .object({
        password: z
            .string()
            .min(8, "At least 8 characters")
            .max(128, "Password is too long")
            .regex(/[A-Z]/, "Must contain an uppercase letter")
            .regex(/[0-9]/, "Must contain a number"),
        confirm: z.string(),
    })
    .refine((d) => d.password === d.confirm, {
        message: "Passwords do not match",
        path: ["confirm"],
    });

export function ResetPassword({
    validCode,
    token,
    email,
}: {
    validCode: boolean;
    token?: string;
    email: string;
}) {
    const [sent, setSent] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirm: "",
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        if (!token) {
            toast.error("Something went wrong, try again later");
            return;
        }

        const resetResult = await ResetPasswordAction({
            email,
            token,
            password: data.password,
        });
        if (!resetResult.success) {
            toast.error(resetResult.error.toString());
            return;
        }

        setSent(true);

        toast("Password reset complete", {
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
        <>
            <Header
                title={
                    validCode ? "Change password" : "Invalid or expired link"
                }
                description={
                    validCode
                        ? "Set your new Veblex account password"
                        : "The provided link is either expired or invalid"
                }
            />

            {validCode ? (
                !sent ? (
                    <form
                        id="reset-password"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FieldGroup>
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="password">
                                            Password
                                        </FieldLabel>

                                        <PasswordInput
                                            {...field}
                                            id="password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="••••••••••••"
                                            autoComplete="password"
                                        />

                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="confirm"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="confirm">
                                            Confirm password
                                        </FieldLabel>
                                        <PasswordInput
                                            {...field}
                                            id="confirm"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="••••••••••••"
                                            autoComplete="new-password"
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
                            form="reset-password"
                            className="h-11 w-full font-medium"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting
                                ? "Sending…"
                                : "Change password"}
                        </Button>
                    </form>
                ) : (
                    <Button className="h-11 w-full font-medium" asChild>
                        <Link href="/login">Back to sign in</Link>
                    </Button>
                )
            ) : (
                <Button className="h-11 w-full font-medium" asChild>
                    <Link href="/forgot-password">Go back</Link>
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
