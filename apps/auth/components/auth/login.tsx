"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { login } from "@/lib/actions/login";

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
import { PasswordInput } from "@workspace/ui/components/password-input";

const formSchema = z.object({
    identifier: z
        .string()
        .min(3, "The username or email must be at least 3 characters long"),
    password: z
        .string()
        .min(3, "The password must be at least 3 characters long"),
});

export function Login() {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const res = await login(data);

        if (!res.success) {
            toast.error(res.error);

            form.setError("identifier", { type: "server", message: "" });
            form.setError("password", { type: "server", message: res.error });

            return;
        }

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
                        name="identifier"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="identifier">
                                    Username or email
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="identifier"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="you@example.com"
                                    autoComplete="username email identifier"
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
                            <Field
                                data-invalid={fieldState.invalid}
                                className="grid grid-cols-[1fr_auto] items-center gap-x-2"
                            >
                                <FieldLabel
                                    htmlFor="password"
                                    className="col-start-1 row-start-1"
                                >
                                    Password
                                </FieldLabel>

                                <PasswordInput
                                    {...field}
                                    id="password"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="••••••••••••"
                                    autoComplete="password"
                                    parentClassName="col-span-2 row-start-2"
                                />

                                <Link
                                    href={"/forgot-password"}
                                    className="col-start-2 row-start-1 justify-self-end text-sm font-medium text-muted-foreground underline-offset-2 hover:underline"
                                >
                                    Forgot?
                                </Link>

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} className="col-span-2" />
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
