"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@workspace/ui/components/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@workspace/ui/components/sheet";

import type { Project, Session } from "@/lib/types";
import { formatClock, parseMinutes, projectLabel } from "@/lib/time";

const NEW_PROJECT = "__new__";

export type SessionDraft = {
    projectId: string;
    start: string;
    end: string;
    notes: string;
    running: boolean;
    newName: string;
    newClient: string;
};

function emptyDraft(
    projects: Project[],
    start: string,
    preferredProjectId?: string
): SessionDraft {
    const preferred = preferredProjectId
        ? projects.find((project) => project.id === preferredProjectId)
        : undefined;
    return {
        projectId: preferred?.id ?? projects[0]?.id ?? NEW_PROJECT,
        start,
        end: "",
        notes: "",
        running: false,
        newName: "",
        newClient: "",
    };
}

function draftFromSession(session: Session): SessionDraft {
    return {
        projectId: session.projectId,
        start: session.start,
        end: session.end ?? "",
        notes: session.notes,
        running: session.end === null,
        newName: "",
        newClient: "",
    };
}

export function SessionSheet({
    open,
    onOpenChange,
    date,
    projects,
    session,
    defaultStart,
    defaultProjectId,
    onSave,
    onDelete,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    date: string;
    projects: Project[];
    session: Session | null;
    defaultStart: string;
    defaultProjectId?: string;
    onSave: (input: {
        projectId?: string;
        newProject?: { name: string; client: string };
        start: string;
        end: string | null;
        notes: string;
    }) => boolean;
    onDelete?: () => void;
}) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {open && (
                <SessionSheetForm
                    key={session?.id ?? `new-${defaultProjectId ?? "none"}-${defaultStart}`}
                    date={date}
                    projects={projects}
                    session={session}
                    defaultStart={defaultStart}
                    defaultProjectId={defaultProjectId}
                    onOpenChange={onOpenChange}
                    onSave={onSave}
                    onDelete={onDelete}
                />
            )}
        </Sheet>
    );
}

function SessionSheetForm({
    date,
    projects,
    session,
    defaultStart,
    defaultProjectId,
    onOpenChange,
    onSave,
    onDelete,
}: {
    date: string;
    projects: Project[];
    session: Session | null;
    defaultStart: string;
    defaultProjectId?: string;
    onOpenChange: (open: boolean) => void;
    onSave: (input: {
        projectId?: string;
        newProject?: { name: string; client: string };
        start: string;
        end: string | null;
        notes: string;
    }) => boolean;
    onDelete?: () => void;
}) {
    const [draft, setDraft] = useState<SessionDraft>(() =>
        session
            ? draftFromSession(session)
            : emptyDraft(projects, defaultStart, defaultProjectId)
    );

    const creatingProject = draft.projectId === NEW_PROJECT;
    const isEdit = Boolean(session);

    const error = useMemo(() => {
        if (creatingProject && !draft.newName.trim()) {
            return "Give the project a name";
        }
        if (!creatingProject && !draft.projectId) {
            return "Pick a project";
        }
        if (parseMinutes(draft.start) === null) {
            return "Start time must be HH:mm";
        }
        if (!draft.running) {
            const end = parseMinutes(draft.end);
            if (end === null) return "End time must be HH:mm";
            const start = parseMinutes(draft.start);
            if (start !== null && end <= start) {
                return "End must be after start";
            }
        }
        return null;
    }, [creatingProject, draft]);

    const submit = () => {
        if (error) {
            toast.error(error);
            return;
        }

        const ok = onSave({
            projectId: creatingProject ? undefined : draft.projectId,
            newProject: creatingProject
                ? { name: draft.newName, client: draft.newClient }
                : undefined,
            start: draft.start,
            end: draft.running ? null : draft.end,
            notes: draft.notes,
        });

        if (ok) onOpenChange(false);
    };

    return (
        <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="font-heading text-xl">
                        {isEdit ? "Edit session" : "Log a session"}
                    </SheetTitle>
                    <SheetDescription>
                        {isEdit
                            ? "Change times, notes, or move this block to another project."
                            : `Add a timed block for ${date}. Leave it running if you are still on it.`}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4">
                    <FieldGroup className="gap-5">
                        <Field>
                            <FieldLabel>Project</FieldLabel>
                            <Select
                                value={draft.projectId}
                                onValueChange={(projectId) =>
                                    setDraft((prev) => ({ ...prev, projectId }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choose a project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map((project) => (
                                        <SelectItem
                                            key={project.id}
                                            value={project.id}
                                        >
                                            {projectLabel(
                                                project.name,
                                                project.client
                                            )}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value={NEW_PROJECT}>
                                        New project…
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        {creatingProject && (
                            <>
                                <Field>
                                    <FieldLabel>Client</FieldLabel>
                                    <Input
                                        value={draft.newClient}
                                        onChange={(event) =>
                                            setDraft((prev) => ({
                                                ...prev,
                                                newClient: event.target.value,
                                            }))
                                        }
                                        placeholder="Optional"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Project name</FieldLabel>
                                    <Input
                                        value={draft.newName}
                                        onChange={(event) =>
                                            setDraft((prev) => ({
                                                ...prev,
                                                newName: event.target.value,
                                            }))
                                        }
                                        placeholder="Website rebuild"
                                        autoFocus
                                    />
                                </Field>
                            </>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <Field>
                                <FieldLabel>Start</FieldLabel>
                                <Input
                                    type="time"
                                    value={draft.start}
                                    onChange={(event) =>
                                        setDraft((prev) => ({
                                            ...prev,
                                            start: event.target.value,
                                        }))
                                    }
                                />
                            </Field>
                            <Field>
                                <FieldLabel>End</FieldLabel>
                                <Input
                                    type="time"
                                    value={draft.running ? "" : draft.end}
                                    disabled={draft.running}
                                    onChange={(event) =>
                                        setDraft((prev) => ({
                                            ...prev,
                                            end: event.target.value,
                                            running: false,
                                        }))
                                    }
                                />
                            </Field>
                        </div>

                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                            <input
                                type="checkbox"
                                className="size-4 accent-primary"
                                checked={draft.running}
                                onChange={(event) =>
                                    setDraft((prev) => ({
                                        ...prev,
                                        running: event.target.checked,
                                        end: event.target.checked
                                            ? ""
                                            : prev.end || formatClock(),
                                    }))
                                }
                            />
                            Session is still running
                        </label>

                        <Field>
                            <FieldLabel>Notes</FieldLabel>
                            <Textarea
                                value={draft.notes}
                                onChange={(event) =>
                                    setDraft((prev) => ({
                                        ...prev,
                                        notes: event.target.value,
                                    }))
                                }
                                placeholder="What did you work on?"
                                className="min-h-24"
                            />
                        </Field>
                    </FieldGroup>
                </div>

                <SheetFooter>
                    {isEdit && onDelete && (
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                                onDelete();
                                onOpenChange(false);
                            }}
                        >
                            Delete session
                        </Button>
                    )}
                    <Button type="button" onClick={submit}>
                        {isEdit ? "Save changes" : "Add session"}
                    </Button>
                </SheetFooter>
            </SheetContent>
    );
}
