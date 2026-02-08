"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function GridBackground({ children, className }: { children?: ReactNode; className?: string }) {
    return (
        <div className={cn("relative w-full", className)}>
            {/* Grid pattern */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
                {/* Radial gradient mask */}
                <div className="absolute inset-0 bg-obsidian-900 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            </div>

            {/* Content */}
            <div className="relative z-20">
                {children}
            </div>
        </div>
    );
}

export function DotBackground({ children, className }: { children?: ReactNode; className?: string }) {
    return (
        <div className={cn("relative w-full bg-obsidian-900", className)}>
            {/* Dot pattern */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-dot-white/[0.2] bg-[size:20px_20px]" />
                {/* Radial gradient mask for fade effect */}
                <div className="absolute inset-0 bg-obsidian-900 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,transparent_50%,black)]" />
            </div>

            {/* Content */}
            <div className="relative z-20">
                {children}
            </div>
        </div>
    );
}
