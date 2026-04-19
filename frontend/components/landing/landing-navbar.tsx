"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Menu, X } from "lucide-react";
import Image from "next/image";
import { NAV_LINKS } from "@/components/shared/landing-constants";

export function LandingNavbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-slate-950/95 backdrop-blur-md shadow-xl"
          : "bg-slate-900"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/images/logo_rota_white.svg"
            alt="Rota UEFS"
            width={40}
            height={40}
            className="h-20 w-20 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]"
            priority
          />
          <div className="flex flex-col leading-none">
            <span className="text-white font-extrabold text-lg tracking-wide group-hover:text-cyan-500 transition-colors duration-300">
              Rota <span className="text-cyan-500">UEFS</span>
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-xs font-bold text-white/80 hover:text-cyan-500 tracking-wider transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => router.push("/login")}
            className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 text-xs font-extrabold px-5 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95 flex items-center gap-1.5"
          >
            <LogIn className="h-4 w-4" /> LOGIN / CADASTRO
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-950 border-t border-white/10 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-bold text-white/80 hover:text-cyan-500 py-2"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => router.push("/login")}
              className="w-full py-2.5 text-sm font-bold bg-cyan-500 text-slate-950 rounded-lg flex items-center justify-center gap-1.5"
            >
              <LogIn className="h-4 w-4" /> LOGIN / CADASTRO
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
