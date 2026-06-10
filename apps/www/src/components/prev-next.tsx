import { Card } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type LinkConfig = {
    url: string;
    title: string;
};

export function PrevNext({
    className = "",
    prev,
    next,
}: {
    className?: string;
    prev: LinkConfig;
    next: LinkConfig;
}) {
    return (
        <div className={cn("xs:grid-cols-2 grid grid-cols-1 gap-4", className)}>
            <a className="grid" href={prev.url}>
                <Card className="w-full justify-center py-4" doHover={true}>
                    <p className="mt-1.5 flex items-center gap-1.5">
                        <ChevronLeft className="size-5" />
                        <span>{prev.title}</span>
                    </p>
                </Card>
            </a>
            <a className="grid" href={next.url}>
                <Card
                    className="w-full items-end justify-center py-4"
                    doHover={true}
                >
                    <p className="mt-1.5 flex items-center gap-1.5">
                        <span>{next.title}</span>
                        <ChevronRight className="size-5" />
                    </p>
                </Card>
            </a>
        </div>
    );
}
