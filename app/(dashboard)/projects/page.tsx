"use client";

import { useState } from "react";
import { FolderKanban, Plus, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProjectList } from "@/features/projects/components/ProjectList";
import { CreateProjectModal } from "@/features/projects/components/CreateProjectModal";
import { useProjectStore } from "@/store/useProjectStore";

export default function ProjectsPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const projects = useProjectStore((s) => s.projects);

    return (
        <div className="flex flex-col gap-6 px-8 py-8 max-w-7xl mx-auto w-full">
            {/* ── Page Header ──────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Projects</h1>
                    <p className="mt-0.5 text-sm text-zinc-500">
                        {projects.length} project{projects.length !== 1 ? "s" : ""} in your workspace
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 rounded-lg text-[13px] font-medium border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                    >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        Filter
                    </Button>
                    <Button
                        size="sm"
                        className="h-8 gap-1.5 rounded-lg bg-indigo-500 px-3 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-600"
                        onClick={() => setModalOpen(true)}
                    >
                        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                        New Project
                    </Button>
                </div>
            </div>

            {/* ── Content ──────────────────────────────────── */}
            {projects.length === 0 ? (
                <EmptyState
                    icon={<FolderKanban className="h-5 w-5" />}
                    title="No projects yet"
                    description="Create your first project to start organizing tasks, tracking milestones, and collaborating with your team."
                    action={
                        <Button
                            size="sm"
                            className="h-8 gap-1.5 rounded-lg bg-indigo-500 px-4 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-600"
                            onClick={() => setModalOpen(true)}
                        >
                            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                            Create Project
                        </Button>
                    }
                />
            ) : (
                <ProjectList projects={projects} />
            )}

            <CreateProjectModal open={modalOpen} onOpenChange={setModalOpen} />
        </div>
    );
}
