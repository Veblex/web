import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function Page() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8">
            <div className="flex gap-4">
                <Loader2 className="size-6 animate-spin" />
                <p>Redirecting...</p>
            </div>

            <div>
                <p className="text-muted-foreground">
                    Is the redirect not working?{" "}
                    <Link
                        href={"/"}
                        className="text-foreground/90 underline-offset-3 hover:text-foreground hover:underline"
                    >
                        Login directly
                    </Link>
                </p>
            </div>
        </div>
    );
}
