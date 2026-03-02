"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    size?: "sm" | "md" | "lg";
}

const sizeMap = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
};

export function Modal({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    className,
    size = "md",
}: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "w-full rounded-xl border bg-white p-0 shadow-sm",
                    sizeMap[size],
                    className,
                )}
            >
                {/* ── Header ─────────────────────────────────── */}
                <DialogHeader className="border-b px-6 py-4">
                    <DialogTitle className="text-[15px] font-semibold tracking-tight text-zinc-900">
                        {title}
                    </DialogTitle>
                    {description && (
                        <DialogDescription className="mt-0.5 text-[13px] text-zinc-500">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                {/* ── Body ───────────────────────────────────── */}
                <div className="px-6 py-5">{children}</div>

                {/* ── Footer ─────────────────────────────────── */}
                {footer && (
                    <DialogFooter className="border-t px-6 py-4">{footer}</DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
