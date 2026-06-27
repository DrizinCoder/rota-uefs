"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogIn, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/components/shared/landing-constants";
import { cn } from "@/lib/utils";
import { NavbarRippleCtaLink } from "@/components/shared/navbar-ripple-cta-link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
/** IDs das âncoras da home — mesma ordem que no DOM (hero → trajeto → contato). */
const LANDING_SECTION_IDS = NAV_LINKS.map((l) => l.href.replace(/^#/, ""));

/**
 * Scroll spy pela parte inferior da tela: qual seção “atravessa” esta linha horizontal.
 * Offset adaptável (~18–24% da altura da viewport, entre 96px e 200px do rodapé da janela).
 */
function getViewportReferenceY(): number {
  const vh =
    typeof window !== "undefined"
      ? window.innerHeight
      : /* SSR fallback */ 800;
  const fromBottom = Math.min(200, Math.max(96, Math.round(vh * 0.22)));
  return vh - fromBottom;
}

function resolveActiveLandingSection(): string {
  const ids = LANDING_SECTION_IDS;
  const refY = getViewportReferenceY();

  const first = document.getElementById(ids[0]);
  const last = document.getElementById(ids[ids.length - 1]);
  if (!first || !last) return ids[0];

  const firstTop = first.getBoundingClientRect().top;
  const lastBottom = last.getBoundingClientRect().bottom;

  if (refY < firstTop) return ids[0];
  if (refY > lastBottom) return ids[ids.length - 1];

  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (refY >= r.top && refY <= r.bottom) return id;
  }

  // Fallback (ex.: gap entre seções): seção mais próxima da linha de referência
  let best = ids[0];
  let bestDist = Infinity;
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    const clamped = Math.min(Math.max(refY, r.top), r.bottom);
    const d = Math.abs(refY - clamped);
    if (d < bestDist) {
      bestDist = d;
      best = id;
    }
  }
  return best;
}

export function LandingNavbar() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(LANDING_SECTION_IDS[0]);

  useEffect(() => {
    if (pathname !== "/") return;

    const updateActiveSection = () => {
      const current = resolveActiveLandingSection();
      setActiveSection((prev) => (prev === current ? prev : current));
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [pathname]);
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
          width: "100%",
          y: 0,
          borderRadius: 0,
          backgroundColor: visible
            ? "rgba(2, 6, 23, 0.92)"
            : "rgb(15, 23, 42)",
          backdropFilter: visible ? "blur(14px)" : "none",
          boxShadow: visible
            ? "0 4px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)"
            : "none",
          borderBottomWidth: visible ? 0 : 1,
        }}
        transition={springTransition}
        style={{ minWidth: 760, borderBottomColor: "rgba(255,255,255,0.08)" }}
        className="mx-auto hidden lg:flex items-center justify-center h-16 relative"
      >
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-full relative">
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
            {NAV_LINKS.map((l) => {
              const sectionId = l.href.replace(/^#/, "");
              const isActive = pathname === "/" && activeSection === sectionId;
              return (
                <a
                  key={l.label}
                  href={l.href}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative px-3 py-2 text-[13px] font-bold tracking-wide transition-colors duration-200 after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-1 after:bg-[#F2D022] after:transition-[width] after:duration-500 after:ease-in-out",
                    isActive
                      ? "text-white after:w-full"
                      : "text-white/38 after:w-0 hover:text-white hover:after:w-full"
                  )}
                >
                  {l.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* Botões à direita */}
        <div className="flex items-center gap-2.5 relative z-10 shrink-0">
          <NavbarRippleCtaLink
            href="/login"
            className="text-sm px-5 py-2.5 rounded-full"
            isActive={pathname === "/login"}
          >
            <LogIn className="h-4 w-4 shrink-0" />
            Acesso ao Portal
          </NavbarRippleCtaLink>
        </div>
        </div>
      </motion.div>

      {/* ── Mobile ──────────────────────────────────────────────── */}
      <motion.div
        animate={{
          width: "100%",
          y: 0,
          borderRadius: 0,
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
              {NAV_LINKS.map((l) => {
                const sectionId = l.href.replace(/^#/, "");
                const isActive = pathname === "/" && activeSection === sectionId;
                return (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative flex items-center text-sm font-bold tracking-wider py-2.5 px-3 rounded-lg transition-colors duration-200 after:pointer-events-none after:absolute after:bottom-2 after:left-3 after:h-1 after:bg-[#F2D022] after:transition-[width] after:duration-500 after:ease-in-out",
                      isActive
                        ? "text-white after:w-[calc(100%-1.5rem)]"
                        : "text-white/38 after:w-0 hover:bg-white/5 hover:text-white hover:after:w-[calc(100%-1.5rem)]"
                    )}
                  >
                    {l.label}
                  </a>
                );
              })}

              <div className="pt-3 mt-2 border-t border-white/[0.08]">
                <NavbarRippleCtaLink
                  href="/login"
                  className="w-full py-2.5 rounded-xl text-sm"
                  onClick={() => setMobileOpen(false)}
                  isActive={pathname === "/login"}
                >
                  <LogIn className="h-4 w-4 shrink-0" />
                  Entrar
                </NavbarRippleCtaLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
