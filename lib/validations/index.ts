import { z } from "zod";

// ─── Shared Schemas ────────────────────────────────────────────────────────────

export const statusSchema = z.enum(["not_started", "in_progress", "on_hold", "completed", "cancelled"]);
export const prioritySchema = z.enum(["low", "medium", "high", "urgent"]);

// ─── Project Schemas ─────────────────────────────────────────────────────────

export const createProjectSchema = z.object({
    name: z.string().min(1, "Project name is required").max(100),
    description: z.string().max(500).optional(),
    status: statusSchema.default("not_started"),
    priority: prioritySchema.default("medium"),
});

export const updateProjectSchema = createProjectSchema.partial();

// ─── Task Schemas ─────────────────────────────────────────────────────────────

export const createTaskSchema = z.object({
    title: z.string().min(1, "Task title is required").max(200),
    description: z.string().max(2000).optional(),
    project_id: z.string().min(1),
    dependency_id: z.string().nullable().optional(),
    status: statusSchema.default("not_started"),
    priority: prioritySchema.default("medium"),
    duration: z.coerce.number().min(1, "Duration must be at least 1 day").default(1),
    original_start_date: z.string().optional(),
    assignee_id: z.string().optional(),
});

// Since Original Dates are fixed, updating only applies to revised dates and duration
export const updateTaskSchema = createTaskSchema.partial().extend({
    revised_start_date: z.string().optional(),
});

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signUpSchema = signInSchema
    .extend({
        full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
        confirm_password: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match",
        path: ["confirm_password"],
    });

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type Status = z.infer<typeof statusSchema>;
export type Priority = z.infer<typeof prioritySchema>;

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
