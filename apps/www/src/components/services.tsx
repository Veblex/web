import { services, type Service } from "@/data/services";
import { Card } from "@workspace/ui/components/card";

export function Services({
    titleTag = "p",
    showDescription = true,
    showFeatures = true,
    onlyCore = false,
    limit = 0,
    status = "all",
}: {
    titleTag?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    showDescription?: boolean;
    showFeatures?: boolean;
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

    return filtered.map((service) => {
        const TitleTag = titleTag;

        const isReleased = service.status === "released";

        const card = (
            <Card doHover={isReleased} className="relative" key={service.title}>
                {!isReleased && service.status && (
                    <span className="absolute top-4 right-4 grid items-center justify-center rounded-full bg-secondary px-3 py-1.5 font-heading text-[10px] leading-snug tracking-widest text-muted-foreground uppercase">
                        {service.status}
                    </span>
                )}

                <p className="font-mono text-sm text-muted-foreground uppercase">
                    {service.category}
                </p>

                <TitleTag className="text-2xl font-semibold">
                    {service.title}
                </TitleTag>

                {showDescription && (
                    <p className="leading-relaxed text-muted-foreground">
                        {service.description}
                    </p>
                )}

                {showFeatures && (
                    <ul className="mt-4 space-y-1">
                        {service.features.map((f) => (
                            <li className="flex items-center gap-2 text-sm text-muted-foreground" key={f}>
                                <span className="h-1 w-1 rounded-full bg-foreground" />
                                {f}
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        );

        return isReleased ? <a href={service.href}>{card}</a> : card;
    });
}
