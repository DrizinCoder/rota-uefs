"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogIn, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/components/shared/landing-constants";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

export function LandingNavbar() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 80);
  });

  const springTransition = {
    type: "spring" as const,
    stiffness: 200,
    damping: 50,
  };

  return (
    <div ref={ref} className="fixed inset-x-0 top-0 z-50">

      {/* ── Desktop ─────────────────────────────────────────────── */}
      <motion.div
        animate={{
          width: visible ? "58%" : "100%",
          y: visible ? 14 : 0,
          borderRadius: visible ? 9999 : 0,
          backgroundColor: visible
            ? "rgba(2, 6, 23, 0.92)"
            : "rgb(15, 23, 42)",
          backdropFilter: visible ? "blur(14px)" : "none",
          boxShadow: visible
            ? "0 4px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)"
            : "none",
          paddingLeft: visible ? 24 : 32,
          paddingRight: visible ? 24 : 32,
          borderBottomWidth: visible ? 0 : 1,
        }}
        transition={springTransition}
        style={{ minWidth: 760, borderBottomColor: "rgba(255,255,255,0.08)" }}
        className="mx-auto hidden lg:flex items-center justify-between h-16 relative"
      >
        {/* Logo */}
        <Link href="/" aria-label="Rota UEFS — início" className="relative z-10 shrink-0 max-w-[min(42vw,260px)]">
          <Image
            src="/images/logo_rota_horizontal.png"
            alt="Rota UEFS"
            width={480}
            height={120}
            className="w-full h-auto max-h-9 xl:max-h-10 object-contain object-left transition-all duration-300"
            priority
          />
        </Link>

        {/* Links — centralizados absolutamente */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-0.5 pointer-events-auto">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-3 py-1.5 text-[13px] font-bold text-white/75 hover:text-cyan-400 tracking-wide transition-colors duration-200 rounded-full hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* Botões à direita */}
        <div className="flex items-center gap-2.5 relative z-10 shrink-0">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-extrabold bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95"
          >
            <LogIn className="h-4 w-4 shrink-0" />
            Entrar
          </Link>
        </div>
      </motion.div>

      {/* ── Mobile ──────────────────────────────────────────────── */}
      <motion.div
        animate={{
          width: visible ? "92%" : "100%",
          y: visible ? 12 : 0,
          borderRadius: visible ? 16 : 0,
          backgroundColor: visible
            ? "rgba(2, 6, 23, 0.92)"
            : "rgb(15, 23, 42)",
          backdropFilter: visible ? "blur(14px)" : "none",
          boxShadow: visible
            ? "0 4px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)"
            : "none",
          borderBottomWidth: visible ? 0 : 1,
        }}
        transition={springTransition}
        style={{ borderBottomColor: "rgba(255,255,255,0.08)" }}
        className="mx-auto flex lg:hidden items-center justify-between h-16 px-4 relative"
      >
        <Link href="/" aria-label="Rota UEFS — início" className="min-w-0 max-w-[64%]">
          <Image
            src="/images/logo_rota_horizontal.png"
            alt="Rota UEFS"
            width={480}
            height={120}
            className="w-full h-auto max-h-9 sm:max-h-10 object-contain object-left"
            priority
          />
        </Link>

        <button
          className="text-white/75 hover:text-white p-2 rounded-lg hover:bg-white/[0.08] transition-all"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </motion.div>

      {/* ── Mobile Menu (drawer) ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="lg:hidden absolute inset-x-3 sm:inset-x-5 top-[calc(4rem+0.75rem)] bg-slate-950 border border-white/10 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.55)] overflow-hidden"
          >
            <div className="px-5 py-5 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center text-sm font-bold text-white/65 hover:text-cyan-400 py-2.5 px-3 rounded-lg hover:bg-white/5 tracking-wider transition-all"
                >
                  {l.label}
                </a>
              ))}

              <div className="pt-3 mt-2 border-t border-white/[0.08]">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center justify-center gap-2 text-sm font-extrabold bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-2.5 rounded-xl transition-all active:scale-95"
                >
                  <LogIn className="h-4 w-4" />
                  Entrar
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
