"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FolderKanban,
    Settings,
    ChevronLeft,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: FolderKanban },
];

const bottomItems = [{ href: "/settings", label: "Settings", icon: Settings }];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "sidebar-transition relative flex h-screen flex-col border-r border-zinc-200 bg-zinc-50",
                collapsed ? "w-[60px]" : "w-[220px]",
            )}
        >
            {/* ── Logo ─────────────────────────────────────── */}
            <div
                className={cn(
                    "flex h-14 items-center border-b border-zinc-200 px-4",
                    collapsed ? "justify-center" : "gap-2.5",
                )}
            >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-white shadow-sm">
                    <Zap className="h-3.5 w-3.5" strokeWidth={2.5} />
                </div>
                {!collapsed && (
                    <span className="text-[15px] font-semibold tracking-tight text-zinc-900">
                        ProMan
                    </span>
                )}
            </div>

            {/* ── Navigation ───────────────────────────────── */}
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2 pt-3">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || pathname.startsWith(href + "/");
                    const item = (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "group flex items-center rounded-lg px-2.5 py-2 text-sm font-medium transition-colors duration-100",
                                collapsed ? "justify-center" : "gap-2.5",
                                active
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-4 w-4 shrink-0",
                                    active ? "text-indigo-600" : "text-zinc-400 group-hover:text-zinc-600",
                                )}
                            />
                            {!collapsed && <span className="truncate">{label}</span>}
                            {active && !collapsed && (
                                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            )}
                        </Link>
                    );

                    return collapsed ? (
                        <Tooltip key={href}>
                            <TooltipTrigger asChild>{item}</TooltipTrigger>
                            <TooltipContent side="right" sideOffset={8}>
                                {label}
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        item
                    );
                })}
            </nav>

            {/* ── Bottom ───────────────────────────────────── */}
            <div className="p-2 pb-3">
                <Separator className="mb-2 bg-zinc-200" />
                {bottomItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    const item = (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "group flex items-center rounded-lg px-2.5 py-2 text-sm font-medium transition-colors duration-100",
                                collapsed ? "justify-center" : "gap-2.5",
                                active
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-4 w-4 shrink-0",
                                    active ? "text-indigo-600" : "text-zinc-400 group-hover:text-zinc-600",
                                )}
                            />
                            {!collapsed && <span>{label}</span>}
                        </Link>
                    );

                    return collapsed ? (
                        <Tooltip key={href}>
                            <TooltipTrigger asChild>{item}</TooltipTrigger>
                            <TooltipContent side="right" sideOffset={8}>
                                {label}
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        item
                    );
                })}
            </div>

            {/* ── Collapse Toggle ──────────────────────────── */}
            <button
                onClick={() => setCollapsed((c) => !c)}
                className="absolute -right-3 top-[52px] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-700"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                <ChevronLeft
                    className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        collapsed && "rotate-180",
                    )}
                />
            </button>
        </aside>
    );
}
