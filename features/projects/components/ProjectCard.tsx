"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Calendar, ChevronRight, MoreHorizontal, Trash2, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useTaskStore } from "@/store/useTaskStore";
import { useProjectStore } from "@/store/useProjectStore";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const allTasks = useTaskStore((s) => s.tasks);
    const tasks = allTasks.filter((t) => t.project_id === project.id);
    const deleteProject = useProjectStore((s) => s.deleteProject);

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t) => t.status === "completed").length;
    const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    const endDate = project.revised_end_date || project.original_end_date;
    const isOverdue =
        endDate &&
        new Date(endDate) < new Date() &&
        project.status !== "completed" &&
        project.status !== "cancelled";

    return (
        <Card className="group relative flex flex-col gap-0 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
            {/* ── Header ───────────────────────────────────── */}
            <CardHeader className="flex flex-row items-start justify-between gap-3 px-5 pt-5 pb-3">
                <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <StatusBadge status={project.status} />
                    </div>
                    <Link
                        href={`/projects/${project.id}`}
                        className="mt-1.5 line-clamp-1 text-[15px] font-semibold text-zinc-900 hover:text-indigo-600 transition-colors"
                    >
                        {project.name}
                    </Link>
                    {project.description && (
                        <p className="line-clamp-2 text-[13px] leading-relaxed text-zinc-500">
                            {project.description}
                        </p>
                    )}
                </div>

                {/* 3-dot menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="gap-2 text-[13px]" asChild>
                            <Link href={`/projects/${project.id}`}>
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="gap-2 text-[13px] text-red-600 focus:text-red-600"
                            onClick={() => deleteProject(project.id)}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>

            {/* ── Content ──────────────────────────────────── */}
            <CardContent className="flex flex-1 flex-col gap-4 px-5 pb-5">
                {/* Progress */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span>Progress</span>
                        <span className="font-medium text-zinc-700">
                            {doneTasks}/{totalTasks} tasks
                        </span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <div
                        className={cn(
                            "flex items-center gap-1 text-xs font-medium",
                            isOverdue ? "text-red-500" : "text-zinc-400",
                        )}
                    >
                        <Calendar className="h-3.5 w-3.5" />
                        {endDate
                            ? isOverdue
                                ? `Overdue · ${formatDistanceToNow(new Date(endDate))} ago`
                                : `Due ${formatDistanceToNow(new Date(endDate), { addSuffix: true })}`
                            : "No due date"}
                    </div>

                    <Link
                        href={`/projects/${project.id}`}
                        className="flex items-center gap-0.5 text-[12px] font-medium text-indigo-500 hover:text-indigo-700 transition-colors"
                    >
                        View
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
