"use client";

import { CSSProperties } from "react";
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
import { useRouter } from "next/navigation";
import { PasswordInput } from "@workspace/ui/components/password-input";

const formSchema = z.object({
    username: z
        .string()
        .min(3, "The username or email must be at least 3 characters long"),
    password: z
        .string()
        .min(3, "The password must be at least 3 characters long"),
});

export default function Page() {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        await new Promise((r) => setTimeout(r, 600));

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

        router.push("/dashboard");
    }

    return (
        <>
            <Header
                title="Sign in"
                description="Sign in to your Veblex account"
            />

            <form
                id="form-login"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <FieldGroup>
                    <Controller
                        name="username"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="username">
                                    Username or email
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="username"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="you@example.com"
                                    autoComplete="username email"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel
                                    htmlFor="password"
                                    className="justify-between"
                                >
                                    Password
                                    <Link
                                        href={"/forgot-password"}
                                        className="text-sm font-medium text-muted-foreground underline-offset-2 hover:underline"
                                    >
                                        Forgot?
                                    </Link>
                                </FieldLabel>
                                <PasswordInput
                                    {...field}
                                    id="password"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="••••••••••••"
                                    autoComplete="password"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>

                <Button
                    type="submit"
                    form="form-login"
                    className="h-11 w-full font-medium"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
            </form>

            <p className="text-center text-muted-foreground">
                New to Veblex?{" "}
                <Link
                    className="text-foreground underline-offset-2 hover:underline"
                    href={"/signup"}
                >
                    Create an account
                </Link>
            </p>
        </>
    );
}
