const TIME_RE = /^([01]?\d|2[0-3]):([0-5]\d)$/;

export function pad2(value: number) {
    return String(value).padStart(2, "0");
}

export function todayISO(now = new Date()) {
    return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}

export function formatClock(now = new Date()) {
    return `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
}

export function parseMinutes(hhmm: string) {
    const match = TIME_RE.exec(hhmm.trim());
    if (!match) return null;
    return Number(match[1]) * 60 + Number(match[2]);
}

export function sessionMinutes(
    start: string,
    end: string | null,
    now = new Date()
) {
    const startMins = parseMinutes(start);
    if (startMins === null) return 0;
    const endMins = end
        ? parseMinutes(end)
        : now.getHours() * 60 + now.getMinutes();
    if (endMins === null) return 0;
    const diff = endMins - startMins;
    return diff > 0 ? diff : 0;
}

export function formatDuration(totalMinutes: number) {
    const minutes = Math.max(0, Math.round(totalMinutes));
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    if (hours === 0) return `${rest}m`;
    if (rest === 0) return `${hours}h`;
    return `${hours}h ${rest}m`;
}

export function addDays(iso: string, delta: number) {
    const [year, month, day] = iso.split("-").map(Number);
    const date = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
    date.setDate(date.getDate() + delta);
    return todayISO(date);
}

export function formatDayHeading(iso: string) {
    const [year, month, day] = iso.split("-").map(Number);
    const date = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
    return date.toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function isToday(iso: string) {
    return iso === todayISO();
}

export function weekRange(iso: string) {
    const [year, month, day] = iso.split("-").map(Number);
    const date = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
    const weekday = date.getDay();
    const mondayOffset = weekday === 0 ? -6 : 1 - weekday;
    const start = addDays(iso, mondayOffset);
    const end = addDays(start, 6);
    return { start, end };
}

export function isInInclusiveRange(iso: string, start: string, end: string) {
    return iso >= start && iso <= end;
}

export function projectLabel(name: string, client: string) {
    const trimmedName = name.trim();
    const trimmedClient = client.trim();
    if (trimmedClient && trimmedName) {
        return `${trimmedClient} / ${trimmedName}`;
    }
    return trimmedName || trimmedClient || "Untitled";
}
