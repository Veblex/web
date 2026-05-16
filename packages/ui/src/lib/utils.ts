import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function mergeWithDefaults<T extends Record<string, unknown>>(
    defaults: T,
    overrides?: Partial<T>
): T {
    if (!overrides) return defaults;

    return (Object.keys(defaults) as (keyof T)[]).reduce((acc, key) => {
        const defaultVal = defaults[key];
        const overrideVal = overrides[key];

        if (
            overrideVal !== null &&
            typeof overrideVal === "object" &&
            !Array.isArray(overrideVal) &&
            typeof defaultVal === "object" &&
            defaultVal !== null
        ) {
            acc[key] = mergeWithDefaults(
                defaultVal as Record<string, unknown>,
                overrideVal as Record<string, unknown>
            ) as T[keyof T];
        } else {
            acc[key] = (
                overrideVal !== undefined ? overrideVal : defaultVal
            ) as T[keyof T];
        }

        return acc;
    }, {} as T);
}
