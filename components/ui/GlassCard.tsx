"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export default function GlassCard({ children, className = "", hover = true }: GlassCardProps) {
    return (
        <motion.div
            className={`glass-card p-6 ${hover ? "glow-on-hover" : ""} ${className}`}
            whileHover={hover ? { y: -5, scale: 1.02 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {children}
        </motion.div>
    );
}
