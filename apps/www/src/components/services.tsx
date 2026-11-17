import { services, type Service } from "@/data/services";
import { Card } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { Plus } from "lucide-react";

function Status({
    className,
    children,
}: Readonly<{
    className?: string;
    children: React.ReactNode;
}>) {
    return (
        <span
            className={cn(
                "grid items-center justify-center rounded-full border bg-transparent px-3 py-1 text-[9px] leading-snug tracking-widest text-muted-foreground uppercase",
                className
            )}
        >
            {children}
        </span>
    );
}

export function Services({
    titleTag = "p",
    showDescription = true,
    showFeatures = true,
    showIcon = true,
    onlyCore = false,
    limit = 0,
    status = "all",
    showServicesLink = true,
}: {
    titleTag?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    showDescription?: boolean;
    showFeatures?: boolean;
    showIcon?: boolean;
    showServicesLink?: boolean;
    onlyCore?: boolean;
    limit?: number;
    status?: "all" | Service["status"] | Service["status"][];
}) {
    let filtered = services.filter((s) => {
        if (!onlyCore) {
            return true;
        }

        return s.isCore === true;
    });

    if (limit !== 0) {
        filtered = filtered.slice(...(limit > 0 ? [0, limit] : [limit]));
    }

    if (status !== "all") {
        filtered = filtered.filter((s) =>
            Array.isArray(status)
                ? status.includes(s.status)
                : s.status === status
        );
    }

    const TitleTag = titleTag;

    const cards = filtered.map((service) => {
        const isReleased = service.status === "released";
        const card = (
            <Card
                doHover={isReleased}
                className="relative h-full gap-2 border-foreground/10"
                key={service.title}
            >
                {!isReleased && service.status && !showIcon && (
                    <Status className="absolute top-4 right-4">
                        {service.status}
                    </Status>
                )}

                {service.icon && showIcon && (
                    <div className="flex items-center justify-between">
                        <div
                            className="mr-auto mb-2 w-fit rounded-lg bg-accent/30 p-2.5"
                            aria-hidden="true"
                        >
                            <service.icon className="size-6 text-primary" />
                        </div>

                        {!isReleased && service.status && (
                            <Status>{service.status}</Status>
                        )}
                    </div>
                )}

                <p className="font-mono text-xs text-muted-foreground uppercase">
                    {service.category}
                </p>

                <TitleTag className="font-heading text-2xl font-semibold">
                    {service.title}
                </TitleTag>

                {showDescription && (
                    <p className="leading-relaxed text-muted-foreground">
                        {service.description}
                    </p>
                )}

                {showFeatures && (
                    <ul className="mt-2 space-y-1">
                        {service.features.map((f) => (
                            <li
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                                key={f}
                            >
                                <span className="h-1 w-1 rounded-full bg-primary/60" />
                                {f}
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        );

        return isReleased ? <a href={service.href}>{card}</a> : card;
    });

    if (showServicesLink) {
        return (
            <>
                {cards}
                <a href="/services">
                    <Card
                        doHover={true}
                        className="relative h-full items-center justify-center gap-2 text-center border-dashed border-foreground/20"
                    >
                        {showIcon && (
                            <div
                                className="mb-2 w-fit rounded-lg bg-accent/30 p-2.5"
                                aria-hidden="true"
                            >
                                <Plus className="size-6 text-primary" />
                            </div>
                        )}

                        <TitleTag className="font-heading text-2xl font-semibold">
                            See all services
                        </TitleTag>

                        <p className="text-muted-foreground">
                            New services join the family regularly, your account
                            already works with them.
                        </p>
                    </Card>
                </a>
            </>
        );
    }

    return cards;
}
