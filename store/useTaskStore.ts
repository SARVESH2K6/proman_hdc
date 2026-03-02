import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, Status, Priority } from "@/types";
import { addDays, parseISO, formatISO } from "date-fns";
import { useProjectStore } from "./useProjectStore";

// Helper to calculate End Date based on Start Date and Duration
function computeEndDate(startDate: string, duration: number) {
    if (!startDate) return null;
    return formatISO(addDays(parseISO(startDate), duration));
}

// ── Mock seed data ────────────────────────────────────────────────────────────
const MOCK_TASKS: Task[] = [
    {
        id: "task-1",
        title: "Phase 1: Research",
        description: "Initial research and competitor analysis.",
        project_id: "proj-1",
        dependency_id: null,
        status: "completed",
        priority: "high",
        duration: 5,
        assignee_id: "user-1",
        original_start_date: "2026-01-15T00:00:00.000Z",
        original_end_date: computeEndDate("2026-01-15T00:00:00.000Z", 5) || "",
        revised_start_date: null,
        revised_end_date: null,
        created_at: "2026-01-10T09:00:00.000Z",
        updated_at: "2026-01-20T16:00:00.000Z"
    },
    {
        id: "task-2",
        title: "Phase 2: Design",
        description: "UI/UX wireframing based on Phase 1.",
        project_id: "proj-1",
        dependency_id: "task-1", // Depends on task-1
        status: "in_progress",
        priority: "high",
        duration: 14,
        assignee_id: "user-2",
        original_start_date: computeEndDate("2026-01-15T00:00:00.000Z", 5 + 1) || "", // Parent end + 1
        original_end_date: computeEndDate(computeEndDate("2026-01-15T00:00:00.000Z", 5 + 1) || "", 14) || "",
        revised_start_date: null,
        revised_end_date: null,
        created_at: "2026-01-20T09:00:00.000Z",
        updated_at: "2026-01-31T14:00:00.000Z"
    }
];

// ── Store interface ───────────────────────────────────────────────────────────
interface TaskStore {
    tasks: Task[];
    addTask: (data: Omit<Task, "id" | "created_at" | "updated_at" | "original_end_date" | "revised_start_date" | "revised_end_date">) => void;
    updateTask: (id: string, data: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    moveTask: (id: string, newStatus: Status) => void;
    cascadeTaskDates: (taskId: string) => void;
    getTasksByProject: (projectId: string) => Task[];
    getTasksByProjectAndStatus: (projectId: string, status: Status) => Task[];
}

export const useTaskStore = create<TaskStore>()(
    persist(
        (set, get) => ({
            tasks: MOCK_TASKS,

            addTask: (data) => {
                let start = data.original_start_date;
                let end = start ? computeEndDate(start, data.duration) : null;

                // If dependent, auto calculate original dates overrides from parent
                if (data.dependency_id) {
                    const parent = get().tasks.find(t => t.id === data.dependency_id);
                    if (parent) {
                        const parentEnd = parent.revised_end_date || parent.original_end_date;
                        if (parentEnd) {
                            start = formatISO(addDays(parseISO(parentEnd), 1));
                            end = computeEndDate(start, data.duration);
                        }
                    }
                }

                const newTask: Task = {
                    ...data,
                    original_start_date: start,
                    original_end_date: end,
                    revised_start_date: null, // Remains null until deviation
                    revised_end_date: null,
                    id: `task-${Date.now()}`,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };

                set((state) => ({ tasks: [newTask, ...state.tasks] }));

                // If it has children somehow? (Not possible on creation)

                // Tell project to recompute
                useProjectStore.getState().recomputeProjectDates(newTask.project_id);
            },

            updateTask: (id, data) => {
                let currentTasks = get().tasks;
                const existingTask = currentTasks.find(t => t.id === id);
                if (!existingTask) return;

                // If duration changes, we should auto-compute revised_end_date if not explicitly changed
                // (Since original_end_date cannot change)
                let revisedEnd = data.revised_end_date !== undefined ? data.revised_end_date : existingTask.revised_end_date;

                if (data.duration && data.duration !== existingTask.duration) {
                    const activeStart = data.revised_start_date || existingTask.revised_start_date || existingTask.original_start_date;
                    if (activeStart) {
                        revisedEnd = computeEndDate(activeStart, data.duration);
                    }
                }

                set((state) => ({
                    tasks: state.tasks.map((t) =>
                        t.id === id ? {
                            ...t,
                            ...data,
                            revised_end_date: revisedEnd,
                            updated_at: new Date().toISOString()
                        } : t
                    ),
                }));

                // Cascade changes to dependents
                get().cascadeTaskDates(id);

                // Recompute project dates
                useProjectStore.getState().recomputeProjectDates(existingTask.project_id);
            },

            deleteTask: (id) => {
                const existingTask = get().tasks.find(t => t.id === id);
                set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));

                if (existingTask) {
                    // Recompute project
                    useProjectStore.getState().recomputeProjectDates(existingTask.project_id);
                }
            },

            moveTask: (id, newStatus) => {
                set((state) => ({
                    tasks: state.tasks.map((t) =>
                        t.id === id ? { ...t, status: newStatus, updated_at: new Date().toISOString() } : t,
                    ),
                }));
            },

            cascadeTaskDates: (taskId) => {
                const state = get();
                const parent = state.tasks.find(t => t.id === taskId);
                if (!parent) return;

                const parentEnd = parent.revised_end_date || parent.original_end_date;
                if (!parentEnd) return;

                const children = state.tasks.filter(t => t.dependency_id === taskId);
                if (children.length === 0) return;

                let updatedTasks = [...state.tasks];
                const mutatedChildrenIds: string[] = [];

                for (const child of children) {
                    const newStart = formatISO(addDays(parseISO(parentEnd), 1));
                    const newEnd = computeEndDate(newStart, child.duration);

                    updatedTasks = updatedTasks.map(t =>
                        t.id === child.id
                            ? { ...t, revised_start_date: newStart, revised_end_date: newEnd }
                            : t
                    );
                    mutatedChildrenIds.push(child.id);
                }

                set({ tasks: updatedTasks });

                // Recursively cascade for each child
                for (const id of mutatedChildrenIds) {
                    get().cascadeTaskDates(id);
                }
            },

            getTasksByProject: (projectId) =>
                get().tasks.filter((t) => t.project_id === projectId),

            getTasksByProjectAndStatus: (projectId, status) =>
                get().tasks.filter((t) => t.project_id === projectId && t.status === status),
        }),
        { name: "proman-tasks" },
    ),
);

// ── Constants ─────────────────────────────────────────────────────────────────
export const STATUSES: Status[] = [
    "not_started",
    "in_progress",
    "on_hold",
    "completed",
    "cancelled",
];

export const STATUS_LABELS: Record<Status, string> = {
    not_started: "Not Started",
    in_progress: "In Progress",
    on_hold: "On Hold",
    completed: "Completed",
    cancelled: "Cancelled",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
    urgent: "Urgent",
    high: "High",
    medium: "Medium",
    low: "Low",
};
