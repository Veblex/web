import { ArrowRight, ChevronRight } from "lucide-react";
import { buttonVariants } from "@workspace/ui/components/button";
import { cn, mergeWithDefaults } from "@workspace/ui/lib/utils";

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
        title: "Create Your Account",
        href: "https://auth.veblex.com/",
    },
    secondary: {
        variant: "outline",
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
        <section className={cn("border-t border-border", className)}>
            <div className="container mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
                <div className="flex max-w-lg flex-col space-y-6 md:space-y-8 lg:mx-auto lg:max-w-2xl lg:items-center lg:text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Ready to join the ecosystem?
                    </h2>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        Create your free Veblex account and get access to all
                        our services with a single sign-on.
                    </p>

                    <div className="grid items-center gap-4 sm:flex">
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
