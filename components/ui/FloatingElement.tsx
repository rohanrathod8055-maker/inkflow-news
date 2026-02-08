"use client";

import { motion } from "framer-motion";

interface FloatingElementProps {
    delay?: number;
    duration?: number;
    className?: string;
}

export default function FloatingElement({
    delay = 0,
    duration = 6,
    className = ""
}: FloatingElementProps) {
    return (
        <motion.div
            className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
            animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                scale: [1, 1.1, 1],
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
}
