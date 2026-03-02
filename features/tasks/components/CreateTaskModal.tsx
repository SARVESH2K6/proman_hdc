"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, parseISO, formatISO } from "date-fns";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTaskStore } from "@/store/useTaskStore";
import { createTaskSchema, updateTaskSchema } from "@/lib/validations";
import { Trash2 } from "lucide-react";
import type { Status, Task } from "@/types";

interface CreateTaskModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    defaultStatus?: Status;
    taskToEdit?: Task;
}

export function CreateTaskModal({
    open,
    onOpenChange,
    projectId,
    defaultStatus = "not_started",
    taskToEdit,
}: CreateTaskModalProps) {
    const addTask = useTaskStore((s) => s.addTask);
    const updateTask = useTaskStore((s) => s.updateTask);
    const deleteTask = useTaskStore((s) => s.deleteTask);
    const tasks = useTaskStore((s) => s.tasks);

    const isEditing = !!taskToEdit;

    const projectTasks = tasks.filter(t => t.project_id === projectId && t.id !== taskToEdit?.id);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<any>({
        resolver: zodResolver(isEditing ? updateTaskSchema : createTaskSchema),
        defaultValues: {
            project_id: projectId,
            title: taskToEdit?.title || "",
            description: taskToEdit?.description || "",
            status: taskToEdit?.status || defaultStatus,
            priority: taskToEdit?.priority || "medium",
            duration: taskToEdit?.duration || 1,
            dependency_id: taskToEdit?.dependency_id || "none",
            assignee_name: taskToEdit?.assignee_name || "",
            original_start_date: taskToEdit?.original_start_date || "",
            revised_start_date: taskToEdit?.revised_start_date || "",
        },
    });

    const dependencyId = watch("dependency_id");
    const hasDependency = dependencyId && dependencyId !== "none";

    useEffect(() => {
        if (open) {
            reset({
                project_id: projectId,
                title: taskToEdit?.title || "",
                description: taskToEdit?.description || "",
                status: taskToEdit?.status || defaultStatus,
                priority: taskToEdit?.priority || "medium",
                duration: taskToEdit?.duration || 1,
                dependency_id: taskToEdit?.dependency_id || "none",
                assignee_name: taskToEdit?.assignee_name || "",
                original_start_date: taskToEdit?.original_start_date || "",
                revised_start_date: taskToEdit?.revised_start_date || "",
            });
        }
    }, [open, taskToEdit, defaultStatus, projectId, reset]);

    useEffect(() => {
        if (hasDependency) {
            const parent = projectTasks.find(t => t.id === dependencyId);
            if (parent) {
                const parentEnd = parent.revised_end_date || parent.original_end_date;
                if (parentEnd) {
                    const nextDay = formatISO(addDays(parseISO(parentEnd), 1)).split("T")[0];
                    setValue(isEditing ? "revised_start_date" : "original_start_date", nextDay, { shouldValidate: true });
                }
            }
        }
    }, [dependencyId, hasDependency, projectTasks, isEditing, setValue]);

    function onSubmit(data: any) {
        const payload = data;
        const finalDependencyId = payload.dependency_id === "none" ? null : payload.dependency_id;

        if (isEditing) {
            updateTask(taskToEdit.id, {
                title: payload.title,
                description: payload.description ?? null,
                status: payload.status,
                priority: payload.priority,
                duration: Number(payload.duration),
                dependency_id: finalDependencyId,
                assignee_name: payload.assignee_name,
                revised_start_date: hasDependency ? null : (payload.revised_start_date || null),
            });
        } else {
            addTask({
                title: payload.title,
                description: payload.description ?? null,
                project_id: projectId,
                status: payload.status || defaultStatus,
                priority: payload.priority || "medium",
                duration: Number(payload.duration) || 1,
                dependency_id: finalDependencyId,
                assignee_name: payload.assignee_name || "Unknown Assignee",
                original_start_date: hasDependency ? null : (payload.original_start_date || null),
            });
        }

        onOpenChange(false);
    }

    function handleDelete() {
        if (isEditing) {
            deleteTask(taskToEdit.id);
            onOpenChange(false);
        }
    }

    return (
        <Modal
            open={open}
            onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}
            title={isEditing ? "Edit Task" : "Create Task"}
            description={isEditing ? "Update task details below." : "Add a new task to this project."}
            size="md"
            footer={
                <div className="flex w-full items-center justify-between gap-2">
                    <div>
                        {isEditing && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 text-[13px] text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={handleDelete}
                            >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg text-[13px] border-zinc-200"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="create-task-form"
                            size="sm"
                            disabled={isSubmitting}
                            className="h-8 rounded-lg bg-indigo-500 text-[13px] text-white hover:bg-indigo-600"
                        >
                            {isEditing ? "Save Changes" : "Create Task"}
                        </Button>
                    </div>
                </div>
            }
        >
            <form id="create-task-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* Hidden project_id */}
                <input type="hidden" {...register("project_id")} />

                {/* Title */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-zinc-700">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                        {...register("title")}
                        placeholder="e.g. Design new landing page"
                        className="h-9 rounded-lg text-sm border-zinc-200 bg-zinc-50 focus-visible:ring-indigo-400"
                    />
                    {errors.title && (
                        <p className="text-[12px] text-red-500">{String(errors.title.message)}</p>
                    )}
                </div>

                {/* Assignee Name */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-zinc-700">
                        Assignee Name
                    </label>
                    <Input
                        {...register("assignee_name")}
                        placeholder="e.g. Sarah Jenkins"
                        className="h-9 rounded-lg text-sm border-zinc-200 bg-zinc-50 focus-visible:ring-indigo-400"
                    />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-zinc-700">Description</label>
                    <textarea
                        {...register("description")}
                        rows={2}
                        placeholder="Optional task details..."
                        className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm placeholder:text-zinc-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                </div>

                <div className="flex gap-3">
                    {/* Status */}
                    <div className="flex flex-1 flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-zinc-700">Status</label>
                        <Select
                            value={watch("status")}
                            onValueChange={(v) => setValue("status", v)}
                        >
                            <SelectTrigger className="h-9 rounded-lg text-sm border-zinc-200 bg-zinc-50">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="not_started">Not Started</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="on_hold">On Hold</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Priority */}
                    <div className="flex flex-1 flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-zinc-700">Priority</label>
                        <Select
                            value={watch("priority")}
                            onValueChange={(v) => setValue("priority", v)}
                        >
                            <SelectTrigger className="h-9 rounded-lg text-sm border-zinc-200 bg-zinc-50">
                                <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="urgent">Urgent</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex gap-3">
                    {/* Duration */}
                    <div className="flex flex-1 flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-zinc-700">Duration (Days)</label>
                        <Input
                            type="number"
                            min="1"
                            {...register("duration")}
                            className="h-9 rounded-lg text-sm border-zinc-200 bg-zinc-50 focus-visible:ring-indigo-400"
                        />
                        {errors.duration && <p className="text-[12px] text-red-500">{String(errors.duration.message)}</p>}
                    </div>

                    {/* Dependency */}
                    <div className="flex flex-1 flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-zinc-700">Dependency</label>
                        <Select
                            value={watch("dependency_id")}
                            onValueChange={(v) => setValue("dependency_id", v)}
                        >
                            <SelectTrigger className="h-9 rounded-lg text-sm border-zinc-200 bg-zinc-50">
                                <SelectValue placeholder="No Dependency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Independent Task</SelectItem>
                                {projectTasks.map((t) => (
                                    <SelectItem key={t.id} value={t.id}>Dependent on: {t.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Start Date */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-zinc-700">
                        {isEditing ? "Revised Start Date" : "Start Date"}
                        {hasDependency && <span className="text-zinc-400 ml-1">(Auto-calculated)</span>}
                    </label>
                    <input
                        type="date"
                        {...register(isEditing ? "revised_start_date" : "original_start_date")}
                        disabled={hasDependency}
                        className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all disabled:opacity-50"
                    />
                </div>
            </form>
        </Modal>
    );
}
