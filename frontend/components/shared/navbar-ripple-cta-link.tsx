"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavbarRippleCtaLinkProps {
  href: string;
  className?: string;
  onClick?: () => void;
  /** Destaca quando a rota atual corresponde ao href deste CTA. */
  isActive?: boolean;
  children: React.ReactNode;
}

export function NavbarRippleCtaLink({
  href,
  className,
  onClick,
  isActive = false,
  children,
}: NavbarRippleCtaLinkProps) {
  const [ripple, setRipple] = useState({ x: 0, y: 0 });

  const placeRipple = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      onPointerEnter={placeRipple}
      onPointerMove={placeRipple}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden font-extrabold text-slate-950 bg-cyan-500 transition-[box-shadow] duration-300 hover:shadow-lg hover:shadow-cyan-400/35 active:scale-[0.97]",
        isActive &&
          "shadow-[inset_0_0_0_2px_rgba(242,208,34,0.95)] shadow-md shadow-cyan-900/20",
        className
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute rounded-full bg-[#F2D022] opacity-90 shadow-[0_0_24px_rgba(242,208,34,0.35)] -translate-x-1/2 -translate-y-1/2 w-0 h-0 transition-[width,height] duration-500 ease-out group-hover:w-[min(160vw,560px)] group-hover:h-[min(160vw,560px)]"
        style={{ left: ripple.x, top: ripple.y }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </Link>
  );
}
