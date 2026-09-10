export type Project = {
    id: string;
    name: string;
    client: string;
    createdAt: string;
};

export type Session = {
    id: string;
    projectId: string;
    date: string;
    start: string;
    end: string | null;
    notes: string;
};

export type TimeLogStore = {
    version: 1;
    projects: Project[];
    sessions: Session[];
};
