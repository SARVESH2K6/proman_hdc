"use client";

import { useTaskStore, STATUSES, STATUS_LABELS } from "@/store/useTaskStore";
import { KanbanColumn } from "./KanbanColumn";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import type { Status } from "@/types";

interface KanbanBoardProps {
    projectId: string;
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
    const allTasks = useTaskStore((s) => s.tasks);
    const updateTask = useTaskStore((s) => s.updateTask);
    const tasks = allTasks.filter((t) => t.project_id === projectId);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // Optimistically update task status locally via Zustand
        updateTask(draggableId, { status: destination.droppableId as Status });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col gap-6 w-full">
                {STATUSES.map((status) => (
                    <KanbanColumn
                        key={status}
                        status={status}
                        label={STATUS_LABELS[status]}
                        tasks={tasks.filter((t) => t.status === status)}
                        projectId={projectId}
                    />
                ))}
            </div>
        </DragDropContext>
    );
}
