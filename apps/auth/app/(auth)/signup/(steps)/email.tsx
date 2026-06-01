export function Email({ onStageChange }: { onStageChange: (stage: string) => void }) {
    return <button onClick={() => onStageChange("verify")}>Email</button>
}