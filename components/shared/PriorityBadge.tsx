import { cn } from "@/lib/utils";
import type { Priority } from "@/types";

const priorityConfig: Record<
    Priority,
    { label: string; className: string; dot: string }
> = {
    urgent: {
        label: "Urgent",
        className: "bg-red-50 text-red-700 ring-red-200",
        dot: "bg-red-500",
    },
    high: {
        label: "High",
        className: "bg-orange-50 text-orange-700 ring-orange-200",
        dot: "bg-orange-500",
    },
    medium: {
        label: "Medium",
        className: "bg-yellow-50 text-yellow-700 ring-yellow-200",
        dot: "bg-yellow-500",
    },
    low: {
        label: "Low",
        className: "bg-zinc-50 text-zinc-500 ring-zinc-200",
        dot: "bg-zinc-400",
    },
};

interface PriorityBadgeProps {
    priority: Priority;
    className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
    const config = priorityConfig[priority];
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1",
                config.className,
                className,
            )}
        >
            <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
            {config.label}
        </span>
    );
}
