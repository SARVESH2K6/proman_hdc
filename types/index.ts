// ─── Database Entity Types ────────────────────────────────────────────────────

export type Status = "not_started" | "in_progress" | "on_hold" | "completed" | "cancelled";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface User {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: string;
    name: string;
    description: string | null;
    status: Status;
    priority: Priority;
    owner_id: string;
    original_start_date: string | null;
    original_end_date: string | null;
    revised_start_date: string | null;
    revised_end_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface Task {
    id: string;
    title: string;
    description: string | null;
    project_id: string;
    dependency_id: string | null;
    status: Status;
    priority: Priority;
    duration: number; // in days
    assignee_id: string | null;
    original_start_date: string | null;
    original_end_date: string | null;
    revised_start_date: string | null;
    revised_end_date: string | null;
    created_at: string;
    updated_at: string;
}

// ─── API / Utility Types ──────────────────────────────────────────────────────

export type ApiResponse<T> = {
    data: T | null;
    error: string | null;
};

export type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    per_page: number;
};
