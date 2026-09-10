import { TimeLog } from "@/components/time-log";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Time log",
    description: "Log work sessions by client and project",
};

export default function Page() {
    return <TimeLog />;
}
