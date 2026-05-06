"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
  glow?: boolean;
  /** `center`: pontos mais visíveis no meio. `edges`: pontos nas bordas, centro limpo (formulários). Omitir = sem máscara (comportamento Magic UI base). */
  radialFade?: "center" | "edges";
}

export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  radialFade,
  style: propsStyle,
  ...props
}: DotPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width: w, height: h } =
          containerRef.current.getBoundingClientRect();
        setDimensions({ width: w, height: h });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const cols = Math.max(1, Math.ceil(dimensions.width / width));
  const rows = Math.max(1, Math.ceil(dimensions.height / height));

  const dots = Array.from({ length: cols * rows }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      x: col * width + cx + x,
      y: row * height + cy + y,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    };
  });

  const maskGradient =
    radialFade === "edges"
      ? "radial-gradient(ellipse 95% 92% at 50% 46%, transparent 0%, transparent 24%, rgba(0,0,0,0.35) 40%, black 68%)"
      : radialFade === "center"
        ? "radial-gradient(ellipse 90% 85% at 50% 48%, black 0%, black 35%, transparent 72%)"
        : undefined;

  const maskStyle =
    maskGradient !== undefined
      ? {
          maskImage: maskGradient,
          WebkitMaskImage: maskGradient,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }
      : undefined;

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-neutral-400/80",
        className
      )}
      style={maskStyle ? { ...maskStyle, ...propsStyle } : propsStyle}
      {...props}
    >
      <defs>
        <radialGradient id={`${id}-gradient`}>
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      {dots.map((dot) =>
        glow ? (
          <motion.circle
            key={`${dot.x}-${dot.y}`}
            cx={dot.x}
            cy={dot.y}
            r={cr}
            fill={`url(#${id}-gradient)`}
            initial={{ opacity: 0.4, scale: 1 }}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: dot.duration,
              repeat: Infinity,
              repeatType: "reverse",
              delay: dot.delay,
              ease: "easeInOut",
            }}
          />
        ) : (
          <circle
            key={`${dot.x}-${dot.y}`}
            cx={dot.x}
            cy={dot.y}
            r={cr}
            fill="currentColor"
          />
        )
      )}
    </svg>
  );
}
