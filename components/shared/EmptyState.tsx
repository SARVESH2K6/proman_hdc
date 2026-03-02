import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-16 text-center",
                className,
            )}
        >
            {icon && (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-zinc-200 text-zinc-400">
                    {icon}
                </div>
            )}
            <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-zinc-800">{title}</p>
                {description && (
                    <p className="max-w-sm text-[13px] text-zinc-500 leading-relaxed">{description}</p>
                )}
            </div>
            {action && <div className="mt-1">{action}</div>}
        </div>
    );
}
