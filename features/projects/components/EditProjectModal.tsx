"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useProjectStore } from "@/store/useProjectStore";
import { updateProjectSchema, type UpdateProjectInput } from "@/lib/validations";
import type { Project } from "@/types";

interface EditProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project;
}

export function EditProjectModal({ open, onOpenChange, project }: EditProjectModalProps) {
    const updateProject = useProjectStore((s) => s.updateProject);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdateProjectInput>({
        resolver: zodResolver(updateProjectSchema),
        defaultValues: {
            name: project.name,
            description: project.description || "",
            status: project.status,
            priority: project.priority,
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                name: project.name,
                description: project.description || "",
                status: project.status,
                priority: project.priority,
            });
        }
    }, [open, project, reset]);

    function onSubmit(data: any) {
        const payload = data as UpdateProjectInput;
        updateProject(project.id, {
            name: payload.name,
            description: payload.description || null,
            status: payload.status,
            priority: payload.priority,
        });
        onOpenChange(false);
    }

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Project"
            description="Update your project settings."
            footer={
                <div className="flex w-full items-center justify-end gap-2">
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
                        form="edit-project-form"
                        size="sm"
                        disabled={isSubmitting}
                        className="h-8 rounded-lg bg-indigo-500 text-[13px] text-white hover:bg-indigo-600"
                    >
                        Save Changes
                    </Button>
                </div>
            }
        >
            <form id="edit-project-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-zinc-700">
                        Project Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                        {...register("name")}
                        placeholder="e.g. Marketing Campaign Q2"
                        className="h-9 rounded-lg text-sm border-zinc-200 bg-zinc-50 focus-visible:ring-indigo-400"
                    />
                    {errors.name && (
                        <p className="text-[12px] text-red-500">{errors.name.message}</p>
                    )}
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-zinc-700">Description</label>
                    <textarea
                        {...register("description")}
                        rows={2}
                        placeholder="What is this project about?"
                        className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                </div>

                <div className="flex gap-3">
                    <div className="flex flex-1 flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-zinc-700">Status</label>
                        <Select
                            value={project.status}
                            onValueChange={(val) =>
                                setValue("status", val as any)
                            }
                        >
                            <SelectTrigger className="h-9 rounded-lg text-sm border-zinc-200 bg-zinc-50 focus:ring-indigo-400">
                                <SelectValue />
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

                    <div className="flex flex-1 flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-zinc-700">Priority</label>
                        <Select
                            defaultValue={project.priority}
                            onValueChange={(val) =>
                                setValue("priority", val as any)
                            }
                        >
                            <SelectTrigger className="h-9 rounded-lg text-sm border-zinc-200 bg-zinc-50 focus:ring-indigo-400">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
