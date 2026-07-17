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
import Link from "next/link";
import { Header } from "@/components/auth/header";
import { PasswordInput } from "@workspace/ui/components/password-input";

const formSchema = z
    .object({
        old: z
            .string()
            .min(3, "The password must be at least 3 characters long"),
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

export function ChangePassword() {
    const [sent, setSent] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            old: "",
            password: "",
            confirm: "",
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
        <>
            <Header
                title={"Change password"}
                description={"Change your Veblex account password"}
            />

            {!sent ? (
                <form
                    id="reset-password"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FieldGroup>
                        <Controller
                            name="old"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="old">
                                        Current password
                                    </FieldLabel>

                                    <PasswordInput
                                        {...field}
                                        id="old"
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
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="password">
                                        New password
                                    </FieldLabel>

                                    <PasswordInput
                                        {...field}
                                        id="password"
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
                    <Link href="/login">Go to sign in</Link>
                </Button>
            )}

            <p className="text-center text-muted-foreground">
                Second thoughts?{" "}
                <Link
                    className="text-foreground underline-offset-2 hover:underline"
                    href={"/dashboard"}
                >
                    Go back
                </Link>
            </p>
        </>
    );
}
