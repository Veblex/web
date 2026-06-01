export function Verify({
    onStageChange,
}: {
    onStageChange: (stage: string) => void;
}) {
    return <button onClick={() => onStageChange("register")}>Verify</button>;
}
