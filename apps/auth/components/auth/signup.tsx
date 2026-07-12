"use client";

import Link from "next/link";
import { Header } from "@/components/auth/header";
import { JSX, useState } from "react";
import {
    ArrowLeft,
    CheckCircle2,
    KeyRound,
    Mail,
    UserPlus,
} from "lucide-react";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { PasswordInput } from "@workspace/ui/components/password-input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@workspace/ui/components/input-otp";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@workspace/ui/components/field";
import { complete, request, verify } from "@/lib/actions/signup";

const emailSchema = z.object({
    email: z.string().email("Enter a valid email").max(255),
});
type EmailData = z.infer<typeof emailSchema>;

const profileSchema = z
    .object({
        username: z
            .string()
            .min(3, "Username must be at least 3 characters")
            .max(32, "Username is too long")
            .regex(/^[a-zA-Z0-9_-]+$/, "Letters, numbers, _ and - only"),
        name: z.string().min(1, "Name is required").max(80, "Name is too long"),
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
type ProfileData = z.infer<typeof profileSchema>;

type Step = "email" | "code" | "profile";

const STEP_META: Record<
    Step,
    { title: string; subtitle: string; icon: JSX.Element; index: number }
> = {
    email: {
        title: "Create your account",
        subtitle: "Verify your email first, then complete your account",
        icon: <Mail className="h-5 w-5 text-foreground/90" />,
        index: 1,
    },
    code: {
        title: "Verify your email",
        subtitle: "Enter the 6-digit code we just sent you",
        icon: <KeyRound className="h-5 w-5 text-foreground/90" />,
        index: 2,
    },
    profile: {
        title: "Complete your account",
        subtitle: "Just a few more details to secure your account",
        icon: <UserPlus className="h-5 w-5 text-foreground/90" />,
        index: 3,
    },
};

export function Signup() {
    const router = useRouter();

    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [token, setToken] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [sending, setSending] = useState(false);

    const emailForm = useForm<EmailData>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSendCode = async (data: EmailData) => {
        setSending(true);

        const res = await request(data);
        if (!res.success) {
            toast.error(res.error);

            emailForm.setError("email", { type: "server", message: res.error });

            return;
        }
        setEmail(data.email);

        setSending(false);
        setStep("code");
        toast("Code sent", {
            description: `We sent a 6-digit code to ${data.email}`,
        });
    };

    const onVerifyCode = async () => {
        if (code.length !== 6) return;
        setVerifying(true);

        const res = await verify({ email, code });
        if (!res.success) {
            toast.error(res.error);
            return;
        }

        setToken(res.token!);
        setVerifying(false);
        setStep("profile");
        toast("Email verified", {
            description: "Now finish setting up your account",
        });
    };

    const onResend = async () => {
        setSending(true);

        const res = await request({ email });
        if (!res.success) {
            toast.error(res.error);
            return;
        }

        setSending(false);
        toast("Code resent", {
            description: `A new code was sent to ${email}`,
        });
    };

    const profileForm = useForm<ProfileData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: "",
            name: "",
            password: "",
            confirm: "",
        },
    });

    const onCreate = async (data: ProfileData) => {
        const res = await complete({
            email,
            token,
            username: data.username,
            password: data.password,
        });
        if (!res.success) {
            toast.error(res.error);
            return;
        }

        router.push("/dashboard");
    };

    const meta = STEP_META[step];

    return (
        <>
            <Header title={meta.title} description={meta.subtitle} />

            {/* Step indicator */}
            <div
                className="-mt-2 mb-3 flex items-center justify-center gap-2"
                aria-label={`Step ${meta.index} of 3`}
            >
                {[1, 2, 3].map((i) => {
                    const isDone = i < meta.index;
                    const isActive = i === meta.index;
                    return (
                        <div key={i} className="flex items-center gap-2">
                            <div
                                className={`flex size-7 items-center justify-center rounded-full font-mono text-[14px] transition-colors ${
                                    isActive
                                        ? "bg-foreground text-background"
                                        : isDone
                                          ? "bg-foreground/80 text-background"
                                          : "bg-border text-muted-foreground"
                                }`}
                            >
                                {isDone ? (
                                    <CheckCircle2 className="size-4.5" />
                                ) : (
                                    i
                                )}
                            </div>
                            {i < 3 && (
                                <div
                                    className={`h-px w-10 ${i < meta.index ? "bg-foreground/60" : "bg-border"}`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {step === "email" && (
                <form
                    onSubmit={emailForm.handleSubmit(onSendCode)}
                    className="space-y-5"
                    noValidate
                >
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={emailForm.control}
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
                        disabled={sending}
                        className="h-11 w-full font-medium"
                    >
                        {sending ? "Sending code…" : "Verify email"}
                    </Button>
                </form>
            )}

            {step === "code" && (
                <div className="mb-2 space-y-6">
                    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-background/40 px-3 py-2.5 text-xs text-muted-foreground">
                        <span className="truncate">
                            Code sent to{" "}
                            <span className="text-foreground/90">{email}</span>
                        </span>
                        <button
                            type="button"
                            onClick={() => setStep("email")}
                            className="inline-flex shrink-0 items-center gap-1 text-foreground/80 transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="h-3 w-3" /> Change
                        </button>
                    </div>

                    <div className="space-y-1">
                        <FieldLabel className="block w-full text-center">
                            Verification code
                        </FieldLabel>
                        <div className="flex justify-center pt-2">
                            <InputOTP
                                maxLength={6}
                                value={code}
                                onChange={setCode}
                                autoComplete="one-time-code"
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Enter" &&
                                        code.length === 6
                                    ) {
                                        onVerifyCode();
                                    }
                                }}
                            >
                                <InputOTPGroup>
                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                        <InputOTPSlot
                                            key={i}
                                            index={i}
                                            className="h-12 w-12"
                                        />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={onVerifyCode}
                        disabled={code.length !== 6 || verifying}
                        className="h-11 w-full font-medium"
                    >
                        {verifying ? "Verifying…" : "Verify code"}
                    </Button>

                    <div className="flex items-center justify-center gap-1 text-xs">
                        <p className="text-muted-foreground">
                            Didn{"'"}t get a code?
                        </p>
                        <button
                            type="button"
                            onClick={onResend}
                            disabled={sending}
                            className="text-foreground/80 hover:underline disabled:opacity-50"
                        >
                            {sending ? "Sending…" : "Resend code"}
                        </button>
                    </div>
                </div>
            )}

            {step === "profile" && (
                <form
                    onSubmit={profileForm.handleSubmit(onCreate)}
                    className="space-y-5"
                    noValidate
                >
                    <div className="rounded-md border border-border bg-background/40 px-3 py-2 text-xs text-muted-foreground">
                        Verified:{" "}
                        <span className="text-foreground/80">{email}</span>
                    </div>

                    <FieldGroup>
                        <Controller
                            name="name"
                            control={profileForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="name">Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id="name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Ola Nordman"
                                        autoComplete="name"
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
                            name="username"
                            control={profileForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="username">
                                        Username
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="username"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="your-handle"
                                        autoComplete="username"
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
                            control={profileForm.control}
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
                            control={profileForm.control}
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
                        disabled={profileForm.formState.isSubmitting}
                        className="h-11 w-full font-medium"
                    >
                        {profileForm.formState.isSubmitting
                            ? "Creating account…"
                            : "Create account"}
                    </Button>

                    <p className="-mb-4 text-center text-[11px] text-muted-foreground">
                        By creating an account you agree to the Veblex{" "}
                        <Link
                            href="https://www.veblex.com/legal/terms"
                            className="text-foreground/80 hover:underline"
                            target="_blank"
                        >
                            Terms
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="https://www.veblex.com/legal/privacy"
                            className="text-foreground/80 hover:underline"
                            target="_blank"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </form>
            )}

            <p className="text-center text-muted-foreground">
                Already have an account?{" "}
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
