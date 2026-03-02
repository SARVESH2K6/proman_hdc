"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./TaskCard";
import { CreateTaskModal } from "./CreateTaskModal";
import { cn } from "@/lib/utils";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import type { Task, Status } from "@/types";

const COLUMN_STYLES: Record<Status, { dot: string; bg: string; count: string }> = {
    not_started: { dot: "bg-zinc-400", bg: "bg-zinc-50", count: "bg-zinc-100 text-zinc-500" },
    in_progress: { dot: "bg-blue-400", bg: "bg-blue-50/40", count: "bg-blue-100 text-blue-600" },
    on_hold: { dot: "bg-amber-400", bg: "bg-amber-50/40", count: "bg-amber-100 text-amber-700" },
    completed: { dot: "bg-emerald-400", bg: "bg-emerald-50/40", count: "bg-emerald-100 text-emerald-700" },
    cancelled: { dot: "bg-red-400", bg: "bg-red-50/40", count: "bg-red-100 text-red-700" },
};

interface KanbanColumnProps {
    status: Status;
    label: string;
    tasks: Task[];
    projectId: string;
}

export function KanbanColumn({ status, label, tasks, projectId }: KanbanColumnProps) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const styles = COLUMN_STYLES[status];

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm w-full">
            {/* Column Header */}
            <div className={cn("flex items-center justify-between rounded-lg px-3 py-2 shrink-0", styles.bg)}>
                <div className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", styles.dot)} />
                    <span className="text-[13px] font-semibold text-zinc-700">{label}</span>
                    <span className={cn("rounded-md px-1.5 py-0.5 text-[11px] font-semibold", styles.count)}>
                        {tasks.length}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-zinc-400 hover:text-zinc-700"
                    onClick={() => setCreateOpen(true)}
                    aria-label={`Add task to ${label}`}
                >
                    <Plus className="h-3.5 w-3.5" />
                </Button>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={status} direction="horizontal">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                            "flex gap-3 overflow-x-auto min-h-[140px] items-start pb-2 transition-colors duration-200",
                            snapshot.isDraggingOver ? "bg-zinc-50/50 rounded-lg p-2" : ""
                        )}
                    >
                        {tasks.length === 0 && !snapshot.isDraggingOver && (
                            <div className="flex h-[120px] w-full items-center justify-center rounded-xl border border-dashed border-zinc-200 text-[12px] text-zinc-400 flex-1">
                                No tasks
                            </div>
                        )}
                        {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={cn(
                                            "w-[280px] shrink-0",
                                            snapshot.isDragging ? "opacity-90 scale-[1.02] shadow-xl cursor-grabbing z-50" : ""
                                        )}
                                        style={{ ...provided.draggableProps.style }}
                                    >
                                        <TaskCard task={task} onClick={setEditingTask} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            <CreateTaskModal
                open={createOpen || !!editingTask}
                onOpenChange={(v: boolean) => {
                    if (!v) {
                        setCreateOpen(false);
                        setEditingTask(null);
                    }
                }}
                projectId={projectId}
                defaultStatus={status}
                taskToEdit={editingTask || undefined}
            />
        </div>
    );
}
