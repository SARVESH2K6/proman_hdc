import { cn } from "@/lib/utils";
import type { Status } from "@/types";

const statusConfig: Record<
    Status,
    { label: string; className: string }
> = {
    not_started: {
        label: "Not Started",
        className: "bg-zinc-100 text-zinc-600 ring-zinc-200",
    },
    in_progress: {
        label: "In Progress",
        className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    on_hold: {
        label: "On Hold",
        className: "bg-amber-50 text-amber-700 ring-amber-200",
    },
    completed: {
        label: "Completed",
        className: "bg-blue-50 text-blue-700 ring-blue-200",
    },
    cancelled: {
        label: "Cancelled",
        className: "bg-zinc-50 text-zinc-400 ring-zinc-200",
    },
};

interface StatusBadgeProps {
    status: Status;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status];
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1",
                config.className,
                className,
            )}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
            {config.label}
        </span>
    );
}
