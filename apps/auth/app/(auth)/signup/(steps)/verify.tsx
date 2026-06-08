import { Input } from "@workspace/ui/components/input";

import { z } from "zod";

const schema = z.object({
    step: z.literal(2),
    email: z.string().email(),
    verificationCode: z
        .string()
        .length(6, "Code must be 6 digits")
        .regex(/^\d+$/, "Code must be numeric"),
});

export function Verify({
    onStageChange,
}: {
    onStageChange: (stage: string) => void;
}) {
    return (
        <div>
            <button onClick={() => onStageChange("register")}>Verify</button>
            <Input type="text" />
            <button onClick={() => onStageChange("email")}>Back</button>
        </div>
    );
}
