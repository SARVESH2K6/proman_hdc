import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project, Status } from "@/types";
import { useTaskStore } from "./useTaskStore";

// ── Mock seed data ────────────────────────────────────────────────────────────
const MOCK_PROJECTS: Project[] = [
    {
        id: "proj-1",
        name: "Website Redesign",
        description: "Full redesign of the marketing website with a modern look and improved performance.",
        status: "in_progress",
        priority: "high",
        owner_id: "user-1",
        original_start_date: "2026-01-15T00:00:00.000Z",
        original_end_date: "2026-03-31T00:00:00.000Z",
        revised_start_date: null,
        revised_end_date: null,
        created_at: "2026-01-10T09:00:00.000Z",
        updated_at: "2026-02-20T14:30:00.000Z",
    },
    {
        id: "proj-2",
        name: "Mobile App v2.0",
        description: "Major release of the mobile app with new onboarding flow, push notifications, and dark mode.",
        status: "in_progress",
        priority: "urgent",
        owner_id: "user-1",
        original_start_date: "2026-02-01T00:00:00.000Z",
        original_end_date: "2026-05-15T00:00:00.000Z",
        revised_start_date: null,
        revised_end_date: "2026-06-01T00:00:00.000Z",
        created_at: "2026-01-25T09:00:00.000Z",
        updated_at: "2026-02-22T10:00:00.000Z",
    },
];

// ── Store interface ───────────────────────────────────────────────────────────
interface ProjectStore {
    projects: Project[];
    addProject: (data: Omit<Project, "id" | "created_at" | "updated_at" | "owner_id" | "original_start_date" | "original_end_date" | "revised_start_date" | "revised_end_date">) => void;
    updateProject: (id: string, data: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    getProject: (id: string) => Project | undefined;
    recomputeProjectDates: (projectId: string) => void;
}

export const useProjectStore = create<ProjectStore>()(
    persist(
        (set, get) => ({
            projects: MOCK_PROJECTS,

            addProject: (data) => {
                const newProject: Project = {
                    ...data,
                    id: `proj-${Date.now()}`,
                    owner_id: "user-1",
                    original_start_date: null,
                    original_end_date: null,
                    revised_start_date: null,
                    revised_end_date: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                set((state) => ({ projects: [newProject, ...state.projects] }));
            },

            updateProject: (id, data) => {
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p,
                    ),
                }));
            },

            deleteProject: (id) => {
                set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
            },

            getProject: (id) => get().projects.find((p) => p.id === id),

            recomputeProjectDates: (projectId) => {
                // To avoid circular dependency loading issues at initialization, we access tasks dynamically
                const allTasks = useTaskStore.getState().tasks.filter(t => t.project_id === projectId);

                if (allTasks.length === 0) {
                    // No tasks, clear dates
                    set((state) => ({
                        projects: state.projects.map(p =>
                            p.id === projectId ? {
                                ...p,
                                original_start_date: null,
                                original_end_date: null,
                                revised_start_date: null,
                                revised_end_date: null,
                                updated_at: new Date().toISOString()
                            } : p
                        )
                    }));
                    return;
                }

                // Compute Original Dates
                const validOrigStarts = allTasks.map(t => t.original_start_date).filter(Boolean) as string[];
                const validOrigEnds = allTasks.map(t => t.original_end_date).filter(Boolean) as string[];

                const origStart = validOrigStarts.length > 0
                    ? new Date(Math.min(...validOrigStarts.map(d => new Date(d).getTime()))).toISOString()
                    : null;
                const origEnd = validOrigEnds.length > 0
                    ? new Date(Math.max(...validOrigEnds.map(d => new Date(d).getTime()))).toISOString()
                    : null;

                // Compute Revised Dates
                const validRevStarts = allTasks.map(t => t.revised_start_date || t.original_start_date).filter(Boolean) as string[];
                const validRevEnds = allTasks.map(t => t.revised_end_date || t.original_end_date).filter(Boolean) as string[];

                const revStart = validRevStarts.length > 0
                    ? new Date(Math.min(...validRevStarts.map(d => new Date(d).getTime()))).toISOString()
                    : null;
                const revEnd = validRevEnds.length > 0
                    ? new Date(Math.max(...validRevEnds.map(d => new Date(d).getTime()))).toISOString()
                    : null;

                // Update Project
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === projectId ? {
                            ...p,
                            original_start_date: origStart,
                            original_end_date: origEnd,
                            // If revised equals original we can store null to keep it clean, but storing the exact date is fine too
                            revised_start_date: revStart !== origStart ? revStart : null,
                            revised_end_date: revEnd !== origEnd ? revEnd : null,
                            updated_at: new Date().toISOString()
                        } : p
                    ),
                }));
            }
        }),
        { name: "proman-projects" },
    ),
);

// ── Derived helpers ───────────────────────────────────────────────────────────
export const STATUS_LABELS: Record<Status, string> = {
    not_started: "Not Started",
    in_progress: "In Progress",
    on_hold: "On Hold",
    completed: "Completed",
    cancelled: "Cancelled",
};
