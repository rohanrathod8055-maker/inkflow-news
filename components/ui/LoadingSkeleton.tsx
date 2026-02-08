"use client";

import { motion } from "framer-motion";

export default function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-6"
                >
                    <div className="animate-pulse">
                        <div className="bg-obsidian-600 h-48 rounded-xl mb-4" />
                        <div className="bg-obsidian-600 h-4 rounded w-20 mb-3" />
                        <div className="bg-obsidian-600 h-6 rounded w-full mb-2" />
                        <div className="bg-obsidian-600 h-6 rounded w-4/5 mb-4" />
                        <div className="bg-obsidian-600 h-4 rounded w-full mb-2" />
                        <div className="bg-obsidian-600 h-4 rounded w-3/4" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
