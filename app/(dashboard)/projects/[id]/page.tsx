"use client";

import { useState, use } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { KanbanBoard } from "@/features/tasks/components/KanbanBoard";
import { useProjectStore } from "@/store/useProjectStore";
import { useTaskStore } from "@/store/useTaskStore";
import { formatDistanceToNow, format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditProjectModal } from "@/features/projects/components/EditProjectModal";

interface ProjectDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { id } = use(params);

    return <ProjectDetailClient id={id} />;
}

function ProjectDetailClient({ id }: { id: string }) {
    const project = useProjectStore((s) => s.projects.find(p => p.id === id));
    // Avoid inline filter selectors in Zustand to prevent infinite loops (or use useShallow)
    const allTasks = useTaskStore((s) => s.tasks);
    const tasks = allTasks.filter((t) => t.project_id === id);

    if (!project) {
        notFound();
    }

    const router = useRouter();
    const deleteProject = useProjectStore((s) => s.deleteProject);
    const [editOpen, setEditOpen] = useState(false);

    const doneTasks = tasks.filter((t) => t.status === "completed").length;

    const handleDeleteProject = () => {
        if (confirm("Are you sure you want to delete this project?")) {
            deleteProject(project.id);
            router.push("/projects");
        }
    };

    return (
        <div className="flex flex-col gap-6 px-8 py-8 max-w-full">
            {/* ── Back + Header ─────────────────────────────── */}
            <div className="flex flex-col gap-4">
                <Link
                    href="/projects"
                    className="flex w-fit items-center gap-1.5 text-[13px] font-medium text-zinc-500 hover:text-zinc-800 transition-colors"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    All Projects
                </Link>

                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                                {project.name}
                            </h1>
                            <StatusBadge status={project.status} />
                        </div>
                        {project.description && (
                            <p className="text-sm text-zinc-500 max-w-2xl">{project.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-[13px] text-zinc-400">
                            <span>
                                <span className="font-medium text-zinc-700">{doneTasks}</span> of{" "}
                                <span className="font-medium text-zinc-700">{tasks.length}</span> tasks complete
                            </span>
                            {(project.revised_end_date || project.original_end_date) && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Due {formatDistanceToNow(new Date((project.revised_end_date || project.original_end_date)!), { addSuffix: true })}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            {/* Actual Dates */}
                            <div className="flex items-center gap-4 text-[13px] text-zinc-600 bg-zinc-50 border border-zinc-100 px-3 py-2 rounded-lg w-fit">
                                <span className="font-medium text-zinc-500 w-[55px]">Actual:</span>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                                    <span>Start: <span className="font-medium text-zinc-900">
                                        {format(new Date(project.original_start_date || project.created_at), 'PP')}
                                    </span></span>
                                </div>
                                <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                                    <span>End: <span className="font-medium text-zinc-900">
                                        {project.original_end_date ? format(new Date(project.original_end_date), 'PP') : <span className="text-zinc-400 italic">Not set</span>}
                                    </span></span>
                                </div>
                            </div>

                            {/* Revised Dates */}
                            <div className="flex items-center gap-4 text-[13px] text-zinc-600 bg-indigo-50/50 border border-indigo-100 px-3 py-2 rounded-lg w-fit transition-all duration-300">
                                <span className="font-medium text-indigo-500 w-[55px]">Revised:</span>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-indigo-300" />
                                    <span>Start: <span className="font-medium text-indigo-900">
                                        {project.revised_start_date ? format(new Date(project.revised_start_date), 'PP') : <span className="text-zinc-400 italic">Not set</span>}
                                    </span></span>
                                </div>
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-200" />
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-indigo-300" />
                                    <span>End: <span className="font-medium text-indigo-900">
                                        {project.revised_end_date ? format(new Date(project.revised_end_date), 'PP') : <span className="text-zinc-400 italic">Not set</span>}
                                    </span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1.5 rounded-lg border-zinc-200 text-[13px]"
                            >
                                <MoreHorizontal className="h-3.5 w-3.5" />
                                Options
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditOpen(true)}>
                                Edit Project
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600" onClick={handleDeleteProject}>
                                Delete Project
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* ── Kanban Board ─────────────────────────────── */}
            <div className="w-full">
                <KanbanBoard projectId={id} />
            </div>

            <EditProjectModal
                open={editOpen}
                onOpenChange={setEditOpen}
                project={project}
            />
        </div>
    );
}
