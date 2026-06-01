import { cn } from "@workspace/ui/lib/utils";

export function Header({
    className,
    title,
    description,
}: {
    className?: string;
    title: string;
    description?: string;
}) {
    return (
        <div className={cn("space-y-2", className)}>
            <h1 className="font-heading text-xl font-semibold sm:text-2xl">
                {title}
            </h1>
            <p className="text-base text-muted-foreground">{description}</p>
        </div>
    );
}
