"use client";

import { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Check,
    CheckCircle2,
    Clapperboard,
    Dumbbell,
    ShieldCheck,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@workspace/ui/components/field";
import { cn } from "@workspace/ui/lib/utils";

import {
    completeOnboarding,
    skipOnboarding,
} from "@/lib/actions/onboarding";
import {
    AVATAR_HUES,
    DEFAULT_ONBOARDING_PAYLOAD,
    INTEREST_OPTIONS,
    type AvatarHue,
    type Interest,
    type OnboardingPayload,
} from "@/lib/onboarding";

type Step = "profile" | "interests" | "ready";

const STEP_ORDER: Step[] = ["profile", "interests", "ready"];

const STEP_META: Record<
    Step,
    { title: string; accent: string; subtitle: string; index: number }
> = {
    profile: {
        title: "Tell us",
        accent: "who you are",
        subtitle: "A display name and color help your account feel like yours.",
        index: 1,
    },
    interests: {
        title: "What are you",
        accent: "here for?",
        subtitle: "Pick the tools you care about. You can change this later.",
        index: 2,
    },
    ready: {
        title: "You're",
        accent: "in.",
        subtitle: "Your Veblex account is ready. Here's a quick look.",
        index: 3,
    },
};

const profileSchema = z.object({
    displayName: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(48, "Name is too long"),
});
type ProfileData = z.infer<typeof profileSchema>;

const AVATAR_HUE_CLASS: Record<AvatarHue, string> = {
    "chart-1": "bg-chart-1",
    "chart-2": "bg-chart-2",
    "chart-3": "bg-chart-3",
    "chart-4": "bg-chart-4",
    "chart-5": "bg-chart-5",
};

const INTEREST_ICONS: Record<Interest, JSX.Element> = {
    gym: <Dumbbell className="size-5" />,
    calendar: <CalendarDays className="size-5" />,
    moviestix: <Clapperboard className="size-5" />,
    auth: <ShieldCheck className="size-5" />,
};

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0];
    if (!first) return "?";
    const second = parts[1];
    if (!second) {
        return first.slice(0, 2).toUpperCase();
    }
    return `${first[0] ?? ""}${second[0] ?? ""}`.toUpperCase();
}

export function Onboarding() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("profile");
    const [payload, setPayload] = useState<OnboardingPayload>(
        DEFAULT_ONBOARDING_PAYLOAD
    );
    const [skipping, setSkipping] = useState(false);
    const [finishing, setFinishing] = useState(false);

    const profileForm = useForm<ProfileData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: payload.displayName,
        },
    });

    const initials = getInitials(payload.displayName);

    const meta = STEP_META[step];
    const stepIndex = STEP_ORDER.indexOf(step);

    const goBack = () => {
        const previous = STEP_ORDER[stepIndex - 1];
        if (!previous) return;
        setStep(previous);
    };

    const onSkip = async () => {
        setSkipping(true);
        const res = await skipOnboarding();
        if (!res.success) {
            toast.error(res.error);
            setSkipping(false);
            return;
        }
        router.push("/dashboard");
    };

    const onProfileContinue = (data: ProfileData) => {
        setPayload((prev) => ({ ...prev, displayName: data.displayName }));
        setStep("interests");
    };

    const toggleInterest = (id: Interest) => {
        setPayload((prev) => {
            const has = prev.interests.includes(id);
            return {
                ...prev,
                interests: has
                    ? prev.interests.filter((item) => item !== id)
                    : [...prev.interests, id],
            };
        });
    };

    const onInterestsContinue = () => {
        setStep("ready");
    };

    const onFinish = async () => {
        setFinishing(true);
        const res = await completeOnboarding(payload);
        if (!res.success) {
            toast.error(res.error);
            setFinishing(false);
            return;
        }
        router.push("/dashboard");
    };

    const selectedInterests = INTEREST_OPTIONS.filter((option) =>
        payload.interests.includes(option.id)
    );

    const busy = skipping || finishing;

    return (
        <div className="space-y-8">
            <div className="space-y-3 text-center">
                <p className="font-mono text-sm text-muted-foreground uppercase">
                    Step 0{meta.index} of 03
                </p>
                <h1 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                    {meta.title}{" "}
                    <span className="text-gradient">{meta.accent}</span>
                </h1>
                <p className="mx-auto max-w-md text-base leading-relaxed text-muted-foreground">
                    {meta.subtitle}
                </p>
            </div>

            <div
                className="flex items-center justify-center gap-2"
                aria-label={`Step ${meta.index} of 3`}
            >
                {STEP_ORDER.map((id, i) => {
                    const index = i + 1;
                    const isDone = index < meta.index;
                    const isActive = index === meta.index;
                    return (
                        <div key={id} className="flex items-center gap-2">
                            <div
                                className={cn(
                                    "flex size-7 items-center justify-center rounded-full font-mono text-[14px] transition-colors",
                                    isActive
                                        ? "bg-foreground text-background"
                                        : isDone
                                          ? "bg-foreground/80 text-background"
                                          : "bg-border text-muted-foreground"
                                )}
                            >
                                {isDone ? (
                                    <CheckCircle2 className="size-4.5" />
                                ) : (
                                    index
                                )}
                            </div>
                            {index < STEP_ORDER.length && (
                                <div
                                    className={cn(
                                        "h-px w-10",
                                        index < meta.index
                                            ? "bg-foreground/60"
                                            : "bg-border"
                                    )}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <div key={step} className="animate-fade-in">
                {step === "profile" && (
                    <Card className="glow-box mx-auto w-full max-w-lg space-y-6 p-4 xs:p-6">
                        <form
                            onSubmit={profileForm.handleSubmit(
                                onProfileContinue
                            )}
                            className="space-y-6"
                            noValidate
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div
                                    className={cn(
                                        "flex size-24 items-center justify-center rounded-full font-heading text-3xl font-semibold text-primary shadow-xs ring-1 ring-foreground/10",
                                        AVATAR_HUE_CLASS[payload.avatarHue]
                                    )}
                                    aria-hidden="true"
                                >
                                    {initials}
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    {AVATAR_HUES.map((hue) => {
                                        const selected =
                                            payload.avatarHue === hue;
                                        return (
                                            <button
                                                key={hue}
                                                type="button"
                                                aria-label={`Choose ${hue} avatar color`}
                                                aria-pressed={selected}
                                                onClick={() =>
                                                    setPayload((prev) => ({
                                                        ...prev,
                                                        avatarHue: hue,
                                                    }))
                                                }
                                                className={cn(
                                                    "size-8 rounded-full ring-offset-2 ring-offset-background transition-[box-shadow,scale] hover:scale-105",
                                                    AVATAR_HUE_CLASS[hue],
                                                    selected
                                                        ? "ring-2 ring-foreground"
                                                        : "ring-1 ring-foreground/15"
                                                )}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            <FieldGroup>
                                <Controller
                                    name="displayName"
                                    control={profileForm.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="displayName">
                                                Display name
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="displayName"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Ada Lovelace"
                                                autoComplete="name"
                                                autoFocus
                                                onChange={(event) => {
                                                    field.onChange(event);
                                                    setPayload((prev) => ({
                                                        ...prev,
                                                        displayName:
                                                            event.target.value,
                                                    }));
                                                }}
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

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="h-11 flex-1 font-medium"
                                    disabled={busy}
                                >
                                    Continue
                                    <ArrowRight />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    className="h-11 font-medium sm:flex-1"
                                    onClick={onSkip}
                                    disabled={busy}
                                >
                                    {skipping ? "Skipping…" : "Skip for now"}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {step === "interests" && (
                    <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            {INTEREST_OPTIONS.map((option) => {
                                const selected = payload.interests.includes(
                                    option.id
                                );
                                return (
                                    <Card
                                        key={option.id}
                                        doHover
                                        role="checkbox"
                                        aria-checked={selected}
                                        tabIndex={0}
                                        onClick={() =>
                                            toggleInterest(option.id)
                                        }
                                        onKeyDown={(event) => {
                                            if (
                                                event.key === "Enter" ||
                                                event.key === " "
                                            ) {
                                                event.preventDefault();
                                                toggleInterest(option.id);
                                            }
                                        }}
                                        className={cn(
                                            "relative cursor-pointer",
                                            selected &&
                                                "glow-box ring-1 ring-foreground/20"
                                        )}
                                    >
                                        {selected && (
                                            <span className="absolute top-4 right-4 inline-flex size-6 items-center justify-center rounded-full bg-foreground text-background">
                                                <Check className="size-3.5" />
                                            </span>
                                        )}
                                        <p className="flex items-center gap-2 font-mono text-sm text-muted-foreground uppercase">
                                            {INTEREST_ICONS[option.id]}
                                            {option.category}
                                        </p>
                                        <p className="font-heading text-2xl font-semibold">
                                            {option.title}
                                        </p>
                                        <p className="leading-relaxed text-muted-foreground">
                                            {option.description}
                                        </p>
                                    </Card>
                                );
                            })}
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Button
                                type="button"
                                variant="ghost"
                                className="h-11 font-medium"
                                onClick={goBack}
                                disabled={busy}
                            >
                                <ArrowLeft />
                                Back
                            </Button>
                            <Button
                                type="button"
                                size="lg"
                                className="h-11 font-medium sm:min-w-48"
                                onClick={onInterestsContinue}
                                disabled={busy}
                            >
                                Continue
                                <ArrowRight />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                className="h-11 font-medium"
                                onClick={onSkip}
                                disabled={busy}
                            >
                                {skipping ? "Skipping…" : "Skip for now"}
                            </Button>
                        </div>
                    </div>
                )}

                {step === "ready" && (
                    <Card className="glow-box mx-auto w-full max-w-lg space-y-6 p-4 xs:p-6">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div
                                className={cn(
                                    "flex size-20 items-center justify-center rounded-full font-heading text-2xl font-semibold text-primary shadow-xs ring-1 ring-foreground/10",
                                    AVATAR_HUE_CLASS[payload.avatarHue]
                                )}
                                aria-hidden="true"
                            >
                                {getInitials(payload.displayName)}
                            </div>
                            <div className="space-y-2">
                                <p className="font-heading text-xl font-semibold">
                                    {payload.displayName
                                        ? `Welcome, ${payload.displayName}`
                                        : "Your account is ready"}
                                </p>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {selectedInterests.length > 0
                                        ? "We'll tailor things around the tools you picked."
                                        : "Jump into the dashboard whenever you're ready."}
                                </p>
                            </div>
                            {selectedInterests.length > 0 && (
                                <ul className="flex flex-wrap justify-center gap-2">
                                    {selectedInterests.map((option) => (
                                        <li
                                            key={option.id}
                                            className="rounded-full bg-secondary px-3 py-1.5 font-mono text-[11px] tracking-wide text-muted-foreground uppercase"
                                        >
                                            {option.title}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                type="button"
                                size="lg"
                                className="h-12 w-full font-medium"
                                onClick={onFinish}
                                disabled={busy}
                            >
                                {finishing
                                    ? "Finishing…"
                                    : "Go to dashboard"}
                                <ArrowRight />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                className="h-11 font-medium"
                                onClick={goBack}
                                disabled={busy}
                            >
                                <ArrowLeft />
                                Back
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
