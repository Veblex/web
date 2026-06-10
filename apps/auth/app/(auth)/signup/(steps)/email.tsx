import { Input } from "@workspace/ui/components/input";

import { z } from "zod";

const schema = z.object({
    step: z.literal(1),
    email: z.string().email("Invalid email address"),
});

export function Email({ onStageChange }: { onStageChange: (stage: string) => void }) {
    return (
        <div>
            <button onClick={() => onStageChange("verify")}>Email</button>
            <Input type="text" />
        </div>
    )
}