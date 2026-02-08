"use client";

import { motion } from "framer-motion";
import GlassCard from "../ui/GlassCard";

interface NavbarProps {
    onRefresh?: () => void;
}

export default function Navbar({ onRefresh }: NavbarProps) {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-4">
            <GlassCard hover={false} className="max-w-7xl mx-auto flex items-center justify-between">
                <motion.h1
                    className="text-2xl font-bold gradient-text flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                >
                    <span className="text-3xl">📰</span> NewsFlow
                </motion.h1>

                <div className="flex items-center gap-4">
                    <motion.button
                        onClick={onRefresh}
                        className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="text-xl">🔄</span>
                        Refresh
                    </motion.button>
                </div>
            </GlassCard>
        </nav>
    );
}
