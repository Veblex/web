import { ArrowRight, ChevronRight } from "lucide-react";
import { buttonVariants } from "@workspace/ui/components/button";
import { mergeWithDefaults } from "@workspace/ui/lib/utils";

type ButtonConfig = {
    variant?:
        | "default"
        | "outline"
        | "secondary"
        | "ghost"
        | "destructive"
        | "link"
        | null;
    size?:
        | "default"
        | "lg"
        | "xs"
        | "sm"
        | "icon"
        | "icon-xs"
        | "icon-sm"
        | "icon-lg"
        | null;
    title?: string;
    href?: string;
};
type DefaultButtons = {
    primary?: ButtonConfig;
    secondary?: ButtonConfig;
};

const defaultButtons: DefaultButtons = {
    primary: {
        variant: "default",
        size: "lg",
        title: "Create your free account",
        href: "https://auth.veblex.com/",
    },
    secondary: {
        variant: "secondary",
        size: "lg",
        title: "Explore services",
        href: "/services",
    },
};

type CTAProps = {
    className?: string;
    buttons?: DefaultButtons;
};

function CTA({ className = "", buttons = defaultButtons }: CTAProps) {
    const buttonConfig = mergeWithDefaults(defaultButtons, buttons);

    return (
        <section className={className}>
            <div className="container mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
                <div className="glow-box relative flex flex-col overflow-hidden rounded-2xl bg-brand p-6 sm:p-8 md:p-10 lg:items-center lg:p-16 lg:text-center">
                    <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl"></div>

                    <h2 className="mb-2 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl lg:text-4xl text-brand-foreground">
                        Ready to join the ecosystem?
                    </h2>
                    <p className="max-w-124 leading-relaxed text-brand-foreground/70 md:text-lg">
                        Create your free Veblex account and get access to all
                        our services with a single sign-on.
                    </p>

                    <div className="z-10 mt-6 grid items-center gap-4 sm:mt-8 sm:flex">
                        <a
                            className={buttonVariants({
                                variant: buttonConfig.primary?.variant,
                                size: buttonConfig.primary?.size,
                            })}
                            href={buttonConfig.primary?.href}
                        >
                            {buttonConfig.primary?.title}
                            <ArrowRight className="size-4" />
                        </a>
                        <a
                            className={buttonVariants({
                                variant: buttonConfig.secondary?.variant,
                                size: buttonConfig.secondary?.size,
                            })}
                            href={buttonConfig.secondary?.href}
                        >
                            {buttonConfig.secondary?.title}
                            <ChevronRight className="size-4" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { CTA, type DefaultButtons, type CTAProps };
