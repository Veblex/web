import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./input";
import { cn } from "../lib/utils";

function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
    const [visible, setVisible] = useState(false);
    return (
        <div className="relative">
            <Input
                type={visible ? "text" : "password"}
                className={cn("bg-background/60 pr-10", className)}
                {...props}
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={visible ? "Hide password" : "Show password"}
                tabIndex={-1}
            >
                {visible ? (
                    <EyeOff className="h-4 w-4" />
                ) : (
                    <Eye className="h-4 w-4" />
                )}
            </button>
        </div>
    );
}

export { PasswordInput };
