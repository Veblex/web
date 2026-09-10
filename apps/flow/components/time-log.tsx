"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Pencil,
    Play,
    Plus,
    Square,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { FullDark, FullLight } from "@workspace/ui/brand-icons";
import { cn } from "@workspace/ui/lib/utils";

import { SessionSheet } from "@/components/session-sheet";
import { useTimeLog } from "@/lib/store";
import type { Project, Session } from "@/lib/types";
import {
    addDays,
    formatClock,
    formatDayHeading,
    formatDuration,
    isInInclusiveRange,
    isToday,
    projectLabel,
    sessionMinutes,
    todayISO,
    weekRange,
} from "@/lib/time";

const HUE = [
    "bg-chart-1",
    "bg-chart-2",
    "bg-chart-3",
    "bg-chart-4",
    "bg-chart-5",
] as const;

function hueFor(id: string) {
    let hash = 0;
    for (const char of id) hash = (hash + char.charCodeAt(0)) % HUE.length;
    return HUE[hash] ?? "bg-chart-3";
}

export function TimeLog() {
    const {
        projects,
        sessions,
        addProject,
        addSession,
        updateSession,
        deleteSession,
        startSession,
        stopSession,
    } = useTimeLog();

    const [date, setDate] = useState(todayISO);
    const [now, setNow] = useState(() => new Date());
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editing, setEditing] = useState<Session | null>(null);
    const [defaultProjectId, setDefaultProjectId] = useState<string | undefined>();

    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 30_000);
        return () => window.clearInterval(timer);
    }, []);

    const daySessions = useMemo(
        () =>
            sessions
                .filter((session) => session.date === date)
                .slice()
                .sort((a, b) => a.start.localeCompare(b.start)),
        [sessions, date]
    );

    const groups = useMemo(() => {
        const byProject = new Map<string, Session[]>();
        for (const session of daySessions) {
            const list = byProject.get(session.projectId) ?? [];
            list.push(session);
            byProject.set(session.projectId, list);
        }

        return [...byProject.entries()]
            .map(([projectId, projectSessions]) => {
                const project = projects.find((item) => item.id === projectId);
                const minutes = projectSessions.reduce(
                    (sum, session) =>
                        sum + sessionMinutes(session.start, session.end, now),
                    0
                );
                return { projectId, project, sessions: projectSessions, minutes };
            })
            .sort((a, b) =>
                projectLabel(
                    a.project?.name ?? "",
                    a.project?.client ?? ""
                ).localeCompare(
                    projectLabel(b.project?.name ?? "", b.project?.client ?? "")
                )
            );
    }, [daySessions, projects, now]);

    const dayTotal = groups.reduce((sum, group) => sum + group.minutes, 0);
    const week = weekRange(date);
    const weekTotal = sessions
        .filter((session) => isInInclusiveRange(session.date, week.start, week.end))
        .reduce(
            (sum, session) => sum + sessionMinutes(session.start, session.end, now),
            0
        );

    const lastEnd =
        daySessions.filter((session) => session.end).at(-1)?.end ??
        formatClock(now);

    const running = daySessions.find((session) => session.end === null);

    const openNew = (projectId?: string) => {
        setEditing(null);
        setDefaultProjectId(projectId);
        setSheetOpen(true);
    };

    const openEdit = (session: Session) => {
        setEditing(session);
        setDefaultProjectId(undefined);
        setSheetOpen(true);
    };

    const saveSheet = (input: {
        projectId?: string;
        newProject?: { name: string; client: string };
        start: string;
        end: string | null;
        notes: string;
    }) => {
        let projectId = input.projectId;
        if (input.newProject) {
            const created = addProject(input.newProject);
            if (!created) {
                toast.error("Could not create project");
                return false;
            }
            projectId = created.id;
        }
        if (!projectId) {
            toast.error("Pick a project");
            return false;
        }

        if (editing) {
            updateSession(editing.id, {
                projectId,
                start: input.start,
                end: input.end,
                notes: input.notes,
            });
            toast("Session updated");
            return true;
        }

        addSession({
            projectId,
            date,
            start: input.start,
            end: input.end,
            notes: input.notes,
        });
        toast("Session added");
        return true;
    };

    const startNow = (project: Project) => {
        if (running) {
            toast.error("Stop the running session first");
            return;
        }
        startSession(project.id, date, formatClock(now));
        toast("Session started");
    };

    const stopRunning = () => {
        if (!running) return;
        stopSession(running.id, formatClock(now));
        toast("Session stopped");
    };

    return (
        <div className="relative min-h-screen">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 size-64 -translate-1/3 animate-pulse-glow rounded-full bg-chart-4/6 blur-3xl md:size-96" />
                <div className="absolute right-0 bottom-0 size-48 translate-1/3 animate-float rounded-full bg-chart-2/5 blur-3xl md:size-72" />
            </div>

            <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
                    <Link href="/" className="flex items-end gap-1.5">
                        <span className="w-26">
                            <FullLight className="not-dark:hidden" />
                            <FullDark className="dark:hidden" />
                        </span>
                        <span className="font-mono text-lg leading-3.5">
                            Flow
                        </span>
                    </Link>
                    <p className="font-mono text-xs text-muted-foreground uppercase">
                        Week {formatDuration(weekTotal)}
                    </p>
                </div>
            </header>

            <main className="relative z-10 mx-auto max-w-3xl space-y-8 px-4 py-8">
                <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-mono text-sm text-muted-foreground uppercase">
                            Daily log
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Previous day"
                                onClick={() => setDate((prev) => addDays(prev, -1))}
                            >
                                <ChevronLeft />
                            </Button>
                            <div className="text-center">
                                <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                                    {formatDayHeading(date)}
                                </h1>
                                {isToday(date) && (
                                    <p className="text-xs text-muted-foreground">
                                        Today
                                    </p>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Next day"
                                onClick={() => setDate((prev) => addDays(prev, 1))}
                            >
                                <ChevronRight />
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="date"
                            value={date}
                            onChange={(event) => setDate(event.target.value)}
                            className="h-9 rounded-md border border-input bg-transparent px-2.5 font-mono text-sm"
                        />
                        <p className="font-heading text-lg font-semibold">
                            {formatDuration(dayTotal)}
                        </p>
                    </div>
                </section>

                <div className="flex flex-wrap gap-3">
                    <Button onClick={() => openNew()}>
                        <Plus />
                        Log session
                    </Button>
                    {running && (
                        <Button variant="outline" onClick={stopRunning}>
                            <Square />
                            Stop current
                        </Button>
                    )}
                </div>

                {groups.length === 0 ? (
                    <Card className="glow-box space-y-3 p-6">
                        <p className="font-mono text-sm text-muted-foreground uppercase">
                            No sessions
                        </p>
                        <h2 className="font-heading text-xl font-semibold">
                            Start this day&apos;s log
                        </h2>
                        <p className="max-w-md leading-relaxed text-muted-foreground">
                            Add a project, then log timed blocks as you work.
                            Pause for lunch by stopping a session and starting
                            another later — notes stay on each block.
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {groups.map((group) => (
                            <ProjectCard
                                key={group.projectId}
                                project={group.project}
                                sessions={group.sessions}
                                minutes={group.minutes}
                                now={now}
                                canStart={!running}
                                onEdit={openEdit}
                                onStart={() => {
                                    if (group.project) startNow(group.project);
                                }}
                                onAdd={() => openNew(group.projectId)}
                            />
                        ))}
                    </div>
                )}
            </main>

            <SessionSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                date={date}
                projects={projects}
                session={editing}
                defaultStart={lastEnd}
                defaultProjectId={defaultProjectId}
                onSave={saveSheet}
                onDelete={
                    editing
                        ? () => {
                              deleteSession(editing.id);
                              toast("Session deleted");
                          }
                        : undefined
                }
            />
        </div>
    );
}

function ProjectCard({
    project,
    sessions,
    minutes,
    now,
    canStart,
    onEdit,
    onStart,
    onAdd,
}: {
    project?: Project;
    sessions: Session[];
    minutes: number;
    now: Date;
    canStart: boolean;
    onEdit: (session: Session) => void;
    onStart: () => void;
    onAdd: () => void;
}) {
    const title = project
        ? projectLabel(project.name, project.client)
        : "Unknown project";

    return (
        <Card className="relative overflow-hidden p-0">
            <span
                className={cn(
                    "absolute inset-y-0 left-0 w-1",
                    hueFor(project?.id ?? "x")
                )}
            />
            <div className="space-y-4 p-5 pl-6">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        {project?.client && (
                            <p className="font-mono text-xs text-muted-foreground uppercase">
                                {project.client}
                            </p>
                        )}
                        <h2 className="font-heading text-xl font-semibold">
                            {project?.name ?? title}
                        </h2>
                    </div>
                    <p className="font-mono text-sm text-muted-foreground">
                        Total {formatDuration(minutes)}
                    </p>
                </div>

                <ol className="space-y-3">
                    {sessions.map((session, index) => {
                        const running = session.end === null;
                        return (
                            <li
                                key={session.id}
                                className="rounded-lg border border-border/70 bg-background/40 px-3 py-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="flex items-center gap-2 font-mono text-sm">
                                            {running && (
                                                <span className="size-2 animate-pulse rounded-full bg-chart-1" />
                                            )}
                                            Session {index + 1}: {session.start}{" "}
                                            – {session.end ?? "now"}{" "}
                                            <span className="text-muted-foreground">
                                                (
                                                {formatDuration(
                                                    sessionMinutes(
                                                        session.start,
                                                        session.end,
                                                        now
                                                    )
                                                )}
                                                )
                                            </span>
                                        </p>
                                        {session.notes ? (
                                            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                                                {session.notes}
                                            </p>
                                        ) : (
                                            <p className="mt-1 text-sm text-muted-foreground/70">
                                                No notes
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        aria-label="Edit session"
                                        onClick={() => onEdit(session)}
                                    >
                                        <Pencil />
                                    </Button>
                                </div>
                            </li>
                        );
                    })}
                </ol>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={onAdd}>
                        <Plus />
                        Add session
                    </Button>
                    {canStart && (
                        <Button variant="ghost" size="sm" onClick={onStart}>
                            <Play />
                            Start now
                        </Button>
                    )}
                    {!canStart && sessions.some((item) => item.end === null) && (
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="size-3.5" />
                            Running
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}
