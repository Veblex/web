"use client";

import { useSyncExternalStore } from "react";
import type { Project, Session, TimeLogStore } from "./types";

const STORAGE_KEY = "veblex-flow:v1";

const EMPTY_STORE: TimeLogStore = {
    version: 1,
    projects: [],
    sessions: [],
};

const listeners = new Set<() => void>();
let cache: TimeLogStore | null = null;

function emit() {
    listeners.forEach((listener) => listener());
}

function isStore(value: unknown): value is TimeLogStore {
    if (!value || typeof value !== "object") return false;
    const record = value as TimeLogStore;
    return (
        record.version === 1 &&
        Array.isArray(record.projects) &&
        Array.isArray(record.sessions)
    );
}

function load(): TimeLogStore {
    if (typeof window === "undefined") return EMPTY_STORE;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...EMPTY_STORE, projects: [], sessions: [] };
        const parsed: unknown = JSON.parse(raw);
        if (!isStore(parsed)) {
            return { ...EMPTY_STORE, projects: [], sessions: [] };
        }
        return parsed;
    } catch {
        return { ...EMPTY_STORE, projects: [], sessions: [] };
    }
}

function persist(next: TimeLogStore) {
    cache = next;
    if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    emit();
}

function current() {
    if (!cache) cache = load();
    return cache;
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot() {
    return current();
}

function getServerSnapshot() {
    return EMPTY_STORE;
}

function createId() {
    return crypto.randomUUID();
}

export function addProject(input: { name: string; client?: string }) {
    const name = input.name.trim();
    if (!name) return null;

    const project: Project = {
        id: createId(),
        name,
        client: input.client?.trim() ?? "",
        createdAt: new Date().toISOString(),
    };

    const store = current();
    persist({ ...store, projects: [...store.projects, project] });
    return project;
}

export function updateProject(
    id: string,
    patch: Partial<Pick<Project, "name" | "client">>
) {
    const store = current();
    persist({
        ...store,
        projects: store.projects.map((project) =>
            project.id === id
                ? {
                      ...project,
                      name:
                          patch.name !== undefined
                              ? patch.name.trim()
                              : project.name,
                      client:
                          patch.client !== undefined
                              ? patch.client.trim()
                              : project.client,
                  }
                : project
        ),
    });
}

export function addSession(input: {
    projectId: string;
    date: string;
    start: string;
    end: string | null;
    notes?: string;
}) {
    const session: Session = {
        id: createId(),
        projectId: input.projectId,
        date: input.date,
        start: input.start,
        end: input.end,
        notes: input.notes?.trim() ?? "",
    };

    const store = current();
    persist({ ...store, sessions: [...store.sessions, session] });
    return session;
}

export function updateSession(
    id: string,
    patch: Partial<Pick<Session, "projectId" | "date" | "start" | "end" | "notes">>
) {
    const store = current();
    persist({
        ...store,
        sessions: store.sessions.map((session) =>
            session.id === id
                ? {
                      ...session,
                      ...patch,
                      notes:
                          patch.notes !== undefined
                              ? patch.notes.trim()
                              : session.notes,
                  }
                : session
        ),
    });
}

export function deleteSession(id: string) {
    const store = current();
    persist({
        ...store,
        sessions: store.sessions.filter((session) => session.id !== id),
    });
}

export function startSession(projectId: string, date: string, start: string) {
    return addSession({
        projectId,
        date,
        start,
        end: null,
        notes: "",
    });
}

export function stopSession(id: string, end: string) {
    updateSession(id, { end });
}

export function useTimeLog() {
    const store = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    );

    return {
        projects: store.projects,
        sessions: store.sessions,
        addProject,
        updateProject,
        addSession,
        updateSession,
        deleteSession,
        startSession,
        stopSession,
    };
}
