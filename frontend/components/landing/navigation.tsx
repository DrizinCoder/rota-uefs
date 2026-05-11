"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  User,
  Map,
  Ticket,
  QrCode,
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
import { cn } from "@/lib/utils";
import { NavbarRippleCtaLink } from "@/components/shared/navbar-ripple-cta-link";
import { isNavHrefActive } from "@/components/shared/navbar-route-active";

/** Query string sincronizada sem `useSearchParams` (evita exigir Suspense em toda página). */
function useSyncedSearchParams(pathname: string): URLSearchParams {
  const [sp, setSp] = useState(() => new URLSearchParams());

  useEffect(() => {
    setSp(new URLSearchParams(window.location.search));
  }, [pathname]);

  useEffect(() => {
    const sync = () => setSp(new URLSearchParams(window.location.search));
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  return sp;
}

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
          label: "Minhas Reservas",
          href: "/minhas-viagens?tipo=Student",
          real: true,
          icon: Ticket,
        },
        {
          label: "Check-in",
          href: "/passageiro/validar",
          real: true,
          icon: QrCode,
        },
      ];

    case "Staff":
      return [
        { label: "Viagens", href: "/professor", real: true, icon: Map },
        {
          label: "Minhas Reservas",
          href: "/minhas-viagens?tipo=Staff",
          real: true,
          icon: Ticket,
        },
        {
          label: "Check-in",
          href: "/passageiro/validar",
          real: true,
          icon: QrCode,
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

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const underlineDesktop =
    "relative flex flex-row flex-nowrap items-center gap-2 px-3.5 py-2 text-sm font-bold tracking-wide rounded-full whitespace-nowrap shrink-0 transition-colors duration-200 after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-1 after:bg-[#F2D022] after:transition-[width] after:duration-500 after:ease-in-out";

  if (item.real) {
    return (
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          underlineDesktop,
          isActive
            ? "text-white after:w-full"
            : "text-white/38 after:w-0 hover:text-white hover:after:w-full"
        )}
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
          className="flex flex-row flex-nowrap items-center gap-2 px-3.5 py-2 text-sm font-bold tracking-wide rounded-full whitespace-nowrap shrink-0 text-white/35 cursor-default select-none transition-colors duration-200"
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
  const pathname = usePathname();
  const searchParams = useSyncedSearchParams(pathname);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 80);
  });

  const navItems = getNavItems(tipoUsuario);
  const perfilHref = getPerfilHref(tipoUsuario);
  const perfilActive = isNavHrefActive(pathname, searchParams, perfilHref);

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
                <NavLink
                  key={item.label}
                  item={item}
                  isActive={
                    item.real &&
                    isNavHrefActive(pathname, searchParams, item.href)
                  }
                />
              ))}
            </div>
          </nav>

          <div className="relative z-10 shrink-0 justify-self-end">
            <NavbarRippleCtaLink
              href={perfilHref}
              className="text-sm px-5 py-2.5 rounded-full whitespace-nowrap"
              isActive={perfilActive}
            >
              <User className="h-4 w-4 shrink-0" />
              Perfil
            </NavbarRippleCtaLink>
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
                {navItems.map((item) => {
                  if (!item.real) {
                    return (
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
                    );
                  }
                  const routeActive = isNavHrefActive(
                    pathname,
                    searchParams,
                    item.href
                  );
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={routeActive ? "page" : undefined}
                      className={cn(
                        "relative flex items-center gap-2 text-sm font-bold tracking-wider py-2.5 px-3 rounded-lg transition-colors duration-200 after:pointer-events-none after:absolute after:bottom-2 after:left-3 after:h-1 after:bg-[#F2D022] after:transition-[width] after:duration-500 after:ease-in-out",
                        routeActive
                          ? "text-white after:w-[calc(100%-1.5rem)]"
                          : "text-white/38 after:w-0 hover:bg-white/5 hover:text-white hover:after:w-[calc(100%-1.5rem)]"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}

                <div className="pt-3 mt-2 border-t border-white/[0.08]">
                  <NavbarRippleCtaLink
                    href={perfilHref}
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-2.5 rounded-xl text-sm"
                    isActive={perfilActive}
                  >
                    <User className="h-4 w-4 shrink-0" />
                    Ver Perfil
                  </NavbarRippleCtaLink>
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
