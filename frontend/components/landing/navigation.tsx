"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Map,
  CalendarDays,
  LayoutDashboard,
  CheckSquare,
  Users,
  Menu,
  X,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ------------------------------------------------------------------ */
/* Tipos                                                                */
/* ------------------------------------------------------------------ */

export type TipoUsuario = "Student" | "Staff" | "Driver" | "Admin" | "motorista";

interface NavItem {
  label: string;
  href: string;
  real: boolean;
  icon: React.ElementType;
}

const SPRING = {
  type: "spring" as const,
  stiffness: 200,
  damping: 50,
};

/* ------------------------------------------------------------------ */
/* Links por tipo de usuário                                            */
/* ------------------------------------------------------------------ */

function getNavItems(tipo: TipoUsuario): NavItem[] {
  switch (tipo) {
    case "Student":
      return [
        { label: "Viagens", href: "/passageiro", real: true, icon: Map },
        {
          label: "Minhas Viagens",
          href: "/minhas-viagens?tipo=Student",
          real: true,
          icon: CalendarDays,
        },
        {
          label: "Status",
          href: "/passageiro/status",
          real: true,
          icon: LayoutDashboard,
        },
      ];

    case "Staff":
      return [
        { label: "Viagens", href: "/professor", real: true, icon: Map },
        {
          label: "Minhas Viagens",
          href: "/minhas-viagens?tipo=Staff",
          real: true,
          icon: CalendarDays,
        },
        {
          label: "Status",
          href: "/passageiro/status",
          real: true,
          icon: LayoutDashboard,
        },
      ];

    case "Driver":
    case "motorista":
      return [
        { label: "Escalas", href: "/motorista", real: true, icon: Map },
        {
          label: "Embarque",
          href: "/motorista/embarque",
          real: true,
          icon: CheckSquare,
        },
        {
          label: "Passageiros",
          href: "/motorista/passageiros",
          real: true,
          icon: Users,
        },
      ];

    default:
      return [];
  }
}

function getPerfilHref(tipo: TipoUsuario): string {
  if (tipo === "Driver" || tipo === "motorista") return "/perfil?tipo=motorista";
  if (tipo === "Staff") return "/perfil?tipo=Staff";
  return "/perfil?tipo=Student";
}

/* ------------------------------------------------------------------ */
/* Item de link                                                         */
/* ------------------------------------------------------------------ */

function NavLink({ item }: { item: NavItem }) {
  const base =
    "flex flex-row flex-nowrap items-center gap-2 px-3.5 py-2 text-sm font-bold tracking-wide rounded-full transition-all duration-200 whitespace-nowrap shrink-0";

  if (item.real) {
    return (
      <Link
        href={item.href}
        className={`${base} text-white/70 hover:text-cyan-400 hover:bg-white/6`}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {item.label}
      </Link>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="link"
          aria-disabled="true"
          tabIndex={0}
          className={`${base} text-white/35 cursor-default select-none`}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {item.label}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Em breve</p>
      </TooltipContent>
    </Tooltip>
  );
}

/* ------------------------------------------------------------------ */
/* Componente principal (mesmo comportamento de scroll da LandingNavbar)*/
/* ------------------------------------------------------------------ */

interface NavigationProps {
  tipoUsuario?: TipoUsuario;
}

export function Navigation({ tipoUsuario = "Student" }: NavigationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 80);
  });

  const navItems = getNavItems(tipoUsuario);
  const perfilHref = getPerfilHref(tipoUsuario);

  return (
    <>
      <div ref={ref} className="fixed inset-x-0 top-0 z-50">

        {/* Desktop */}
        <motion.div
          animate={{
            width: scrolled ? "min(98%, 1000px)" : "100%",
            y: scrolled ? 14 : 0,
            borderRadius: scrolled ? 9999 : 0,
            backgroundColor: scrolled
              ? "rgba(2, 6, 23, 0.92)"
              : "rgb(15, 23, 42)",
            backdropFilter: scrolled ? "blur(14px)" : "none",
            boxShadow: scrolled
              ? "0 4px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)"
              : "none",
            paddingLeft: scrolled ? 20 : 28,
            paddingRight: scrolled ? 20 : 28,
            borderBottomWidth: scrolled ? 0 : 1,
          }}
          transition={SPRING}
          style={{
            borderBottomColor: "rgba(255,255,255,0.08)",
          }}
          className="mx-auto hidden lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-4 h-16 relative max-w-[100vw]"
        >
          <Link
            href="/"
            aria-label="Rota UEFS — início"
            className="relative z-10 shrink-0 max-w-[220px] xl:max-w-[260px]"
          >
            <Image
              src="/images/logo_rota_horizontal.png"
              alt="Rota UEFS"
              width={480}
              height={120}
              className="w-full h-auto max-h-9 xl:max-h-10 object-contain object-left"
              priority
            />
          </Link>

          <nav
            aria-label="Menu principal"
            className="flex min-w-0 items-center justify-center overflow-x-auto overflow-y-hidden py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex flex-row flex-nowrap items-center justify-center gap-1 px-1">
              {navItems.map((item) => (
                <NavLink key={item.label} item={item} />
              ))}
            </div>
          </nav>

          <div className="relative z-10 shrink-0 justify-self-end">
            <Link
              href={perfilHref}
              className="flex items-center gap-2 text-sm font-extrabold bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95 whitespace-nowrap"
            >
              <User className="h-4 w-4 shrink-0" />
              Perfil
            </Link>
          </div>
        </motion.div>

        {/* Mobile */}
        <motion.div
          animate={{
            width: scrolled ? "92%" : "100%",
            y: scrolled ? 12 : 0,
            borderRadius: scrolled ? 16 : 0,
            backgroundColor: scrolled
              ? "rgba(2, 6, 23, 0.92)"
              : "rgb(15, 23, 42)",
            backdropFilter: scrolled ? "blur(14px)" : "none",
            boxShadow: scrolled
              ? "0 4px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)"
              : "none",
            borderBottomWidth: scrolled ? 0 : 1,
          }}
          transition={SPRING}
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
            type="button"
            className="text-white/75 hover:text-white p-2 rounded-lg hover:bg-white/[0.08] transition-all"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </motion.div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="lg:hidden absolute inset-x-3 sm:inset-x-5 top-[calc(4rem+0.75rem)] bg-slate-950 border border-white/10 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.55)] overflow-hidden z-50"
            >
              <div className="px-5 py-5 flex flex-col gap-1">
                {navItems.map((item) =>
                  item.real ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-sm font-bold text-white/65 hover:text-cyan-400 py-2.5 px-3 rounded-lg hover:bg-white/5 tracking-wider transition-all"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ) : (
                    <Tooltip key={item.label}>
                      <TooltipTrigger asChild>
                        <span
                          role="link"
                          aria-disabled="true"
                          tabIndex={0}
                          className="flex items-center gap-2 text-sm font-bold text-white/30 py-2.5 px-3 rounded-lg cursor-default select-none tracking-wider"
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Em breve</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                )}

                <div className="pt-3 mt-2 border-t border-white/[0.08]">
                  <Link
                    href={perfilHref}
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-extrabold bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-2.5 rounded-xl transition-all active:scale-95"
                  >
                    <User className="h-4 w-4" />
                    Ver Perfil
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Espaço para navbar fixa — igual à landing */}
      <div className="h-16 shrink-0" aria-hidden />
    </>
  );
}
