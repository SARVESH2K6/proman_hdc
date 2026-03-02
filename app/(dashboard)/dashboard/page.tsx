"use client";

import Link from "next/link";
import {
    FolderKanban,
    CheckCircle2,
    Clock,
    ListTodo,
    ChevronRight,
    TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { useProjectStore } from "@/store/useProjectStore";
import { useTaskStore } from "@/store/useTaskStore";
import { formatDistanceToNow } from "date-fns";

function StatCard({
    icon: Icon,
    label,
    value,
    sub,
    color,
}: {
    icon: React.ElementType;
    label: string;
    value: number;
    sub?: string;
    color: string;
}) {
    return (
        <Card className="rounded-xl border border-zinc-200 bg-white shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-zinc-900">{value}</p>
                    <p className="text-[13px] text-zinc-500">{label}</p>
                    {sub && <p className="text-[11px] text-zinc-400 mt-0.5">{sub}</p>}
                </div>
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
    const projects = useProjectStore((s) => s.projects);
    const tasks = useTaskStore((s) => s.tasks);

    const activeProjects = projects.filter((p) => p.status === "in_progress").length;
    const completedProjects = projects.filter((p) => p.status === "completed").length;
    const doneTasks = tasks.filter((t) => t.status === "completed").length;
    const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;

    const recentProjects = [...projects]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 5);

    return (
        <div className="flex flex-col gap-8 px-8 py-8 max-w-6xl mx-auto w-full">
            {/* ── Welcome ─────────────────────────────────── */}
            <div>
                <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Dashboard</h1>
                <p className="mt-0.5 text-sm text-zinc-500">
                    Here&apos;s what&apos;s happening across your workspace.
                </p>
            </div>

            {/* ── Stat Cards ──────────────────────────────── */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <StatCard
                    icon={FolderKanban}
                    label="Total Projects"
                    value={projects.length}
                    color="bg-indigo-50 text-indigo-600"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Active"
                    value={activeProjects}
                    sub="in progress now"
                    color="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Completed"
                    value={completedProjects}
                    color="bg-zinc-100 text-zinc-500"
                />
                <StatCard
                    icon={ListTodo}
                    label="Total Tasks"
                    value={tasks.length}
                    sub={`${doneTasks} done · ${inProgressTasks} in progress`}
                    color="bg-amber-50 text-amber-600"
                />
            </div>

            {/* ── Recent Projects ──────────────────────────── */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-[15px] font-semibold text-zinc-800">Recent Projects</h2>
                    <Link
                        href="/projects"
                        className="flex items-center gap-0.5 text-[13px] font-medium text-indigo-500 hover:text-indigo-700 transition-colors"
                    >
                        View all
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                <Card className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
                    <div className="divide-y divide-zinc-100">
                        {recentProjects.map((project) => {
                            const projectTasks = tasks.filter((t) => t.project_id === project.id);
                            const done = projectTasks.filter((t) => t.status === "completed").length;
                            const progress =
                                projectTasks.length > 0
                                    ? Math.round((done / projectTasks.length) * 100)
                                    : 0;

                            return (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.id}`}
                                    className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50 transition-colors group"
                                >
                                    {/* Name + status */}
                                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                                        <span className="text-[14px] font-medium text-zinc-800 truncate group-hover:text-indigo-600 transition-colors">
                                            {project.name}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={project.status} />
                                            <span className="text-[11px] text-zinc-400">
                                                Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="flex w-32 flex-col gap-1 shrink-0">
                                        <div className="flex justify-between text-[11px] text-zinc-400">
                                            <span>Progress</span>
                                            <span className="font-medium text-zinc-600">{progress}%</span>
                                        </div>
                                        <Progress value={progress} className="h-1.5" />
                                    </div>

                                    {/* Tasks count */}
                                    <div className="flex flex-col items-end shrink-0">
                                        <span className="text-[13px] font-semibold text-zinc-700">
                                            {done}/{projectTasks.length}
                                        </span>
                                        <span className="text-[11px] text-zinc-400">tasks</span>
                                    </div>

                                    <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-indigo-400 transition-colors" />
                                </Link>
                            );
                        })}
                    </div>
                </Card>
            </div>

            {/* ── Quick Actions ─────────────────────────────── */}
            <div className="flex flex-col gap-3">
                <h2 className="text-[15px] font-semibold text-zinc-800">Quick Actions</h2>
                <div className="flex gap-3">
                    <Link
                        href="/projects"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-white py-5 text-[13px] font-medium text-zinc-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                    >
                        <FolderKanban className="h-4 w-4" />
                        Go to Projects
                    </Link>
                    <Link
                        href="/projects"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-white py-5 text-[13px] font-medium text-zinc-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                    >
                        <Clock className="h-4 w-4" />
                        View In-Progress Tasks
                    </Link>
                </div>
            </div>
        </div>
    );
}
