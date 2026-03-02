"use client";

import { Search, Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface NavbarProps {
    onCreateProject?: () => void;
}

export function Navbar({ onCreateProject }: NavbarProps) {
    return (
        <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-white px-6">
            {/* ── Search ───────────────────────────────────── */}
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                <Input
                    placeholder="Search projects, tasks…"
                    className="h-8 rounded-lg bg-zinc-50 pl-8 text-sm placeholder:text-zinc-400 focus-visible:ring-indigo-400"
                />
            </div>

            <div className="flex items-center gap-2 ml-auto">
                {/* ── Notifications ────────────────────────────── */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-zinc-500 hover:text-zinc-800"
                    aria-label="Notifications"
                >
                    <Bell className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-5" />

                {/* ── Create Project ───────────────────────────── */}
                <Button
                    size="sm"
                    className="h-8 gap-1.5 rounded-lg bg-indigo-500 px-3 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-600 focus-visible:ring-indigo-400"
                    onClick={onCreateProject}
                >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                    New Project
                </Button>

                <Separator orientation="vertical" className="h-5" />

                {/* ── Avatar ───────────────────────────────────── */}
                <Avatar className="h-7 w-7 cursor-pointer ring-2 ring-transparent hover:ring-indigo-200 transition-all">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-indigo-100 text-[11px] font-semibold text-indigo-700">
                        JD
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
