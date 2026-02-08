"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export const MovingBorder = ({
    children,
    duration = 2000,
    rx,
    ry,
    ...otherProps
}: {
    children: React.ReactNode;
    duration?: number;
    rx?: string;
    ry?: string;
    [key: string]: any;
}) => {
    return (
        <div
            {...otherProps}
            className={cn(
                "relative bg-transparent overflow-hidden rounded-2xl p-[1px]",
                otherProps.className
            )}
        >
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(90deg, #00f0ff, #b07aff, #ff6ec7, #00f0ff)`,
                    backgroundSize: "400% 400%",
                    animation: `gradient ${duration}ms linear infinite`,
                }}
            />
            <div className="relative bg-obsidian-900 rounded-2xl p-6 z-10">
                {children}
            </div>
            <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 400% 50%;
          }
        }
      `}</style>
        </div>
    );
};

export function MovingBorderCard({
    borderRadius = "1rem",
    children,
    className,
    containerClassName,
    duration = 2000,
}: {
    borderRadius?: string;
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
    duration?: number;
}) {
    return (
        <div
            className={cn(
                "relative text-xl h-full w-full p-[1px] overflow-hidden",
                containerClassName
            )}
            style={{
                borderRadius: borderRadius,
            }}
        >
            <div
                className="absolute inset-0 rounded-[inherit]"
                style={{
                    background: `linear-gradient(90deg, #00f0ff, #b07aff, #ff6ec7, #00f0ff)`,
                    backgroundSize: "400% 400%",
                    animation: `borderMove ${duration}ms linear infinite`,
                }}
            />
            <div
                className={cn(
                    "relative bg-obsidian-900 text-white flex items-center justify-center w-full h-full text-sm antialiased rounded-[inherit]",
                    className
                )}
            >
                {children}
            </div>
            <style jsx>{`
        @keyframes borderMove {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 400% 50%;
          }
        }
      `}</style>
        </div>
    );
}
