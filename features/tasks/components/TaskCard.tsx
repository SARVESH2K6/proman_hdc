import { formatDistanceToNow } from "date-fns";
import { Calendar } from "lucide-react";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

// Mock assignee map (replace with real users later)
const ASSIGNEES: Record<string, string> = {
    "user-1": "JD",
    "user-2": "SA",
};

interface TaskCardProps {
    task: Task;
    onClick?: (task: Task) => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
    const endDate = task.revised_end_date || task.original_end_date;
    const isOverdue =
        endDate &&
        new Date(endDate) < new Date() &&
        task.status !== "completed";

    return (
        <div
            onClick={() => onClick?.(task)}
            className="group flex flex-col gap-2.5 rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm transition-shadow duration-150 hover:shadow-md cursor-pointer"
        >
            {/* Priority */}
            <div className="flex items-center justify-between">
                <PriorityBadge priority={task.priority} />
            </div>

            {/* Title */}
            <p className="text-[13px] font-medium leading-snug text-zinc-800 line-clamp-2">
                {task.title}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-0.5">
                {/* Due date */}
                <div
                    className={cn(
                        "flex items-center gap-1 text-[11px] font-medium",
                        isOverdue ? "text-red-500" : "text-zinc-400",
                    )}
                >
                    {endDate && (
                        <>
                            <Calendar className="h-3 w-3" />
                            {isOverdue
                                ? formatDistanceToNow(new Date(endDate), { addSuffix: true })
                                : formatDistanceToNow(new Date(endDate), { addSuffix: true })}
                        </>
                    )}
                </div>

                {/* Assignee avatar */}
                {task.assignee_id && (
                    <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[9px] font-semibold bg-indigo-100 text-indigo-700">
                            {ASSIGNEES[task.assignee_id] ?? "?"}
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>
        </div>
    );
}
