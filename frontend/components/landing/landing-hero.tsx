"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Zap, ArrowRight, UserPlus } from "lucide-react";
import { HERO_STATS } from "@/components/shared/landing-constants";

export function LandingHero() {
  const router = useRouter();

  return (
    <section id="inicio" className="relative min-h-[90vh] flex items-end overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/campus-bg.png"
          alt="Campus UEFS"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20 pt-32">
        <div className="grid lg:grid-cols-2 gap-8 items-end">
          {/* Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-cyan-500/15 backdrop-blur-sm border border-cyan-500/30 px-4 py-1.5 rounded-full">
              <Zap className="h-3.5 w-3.5 text-cyan-500" />
              <span className="text-xs font-bold text-cyan-500 tracking-wider uppercase">
                Transporte Universitário Gratuito
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
              SUA CONEXÃO{" "}
              <span className="text-cyan-500">NO CAMPUS</span>
            </h1>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white/90">
              ROTA UEFS: TRANSPORTE SEGURO E EFICIENTE
            </h2>

            <p className="text-base text-slate-300 max-w-md leading-relaxed">
              Transporte <strong className="text-white/90">gratuito</strong> com horários fixos entre{" "}
              <strong className="text-white/90">Feira de Santana</strong> e{" "}
              <strong className="text-white/90">Salvador</strong>, exclusivo para
              docentes e discentes da UEFS. Viaje com conforto e segurança.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => router.push("/login")}
                className="group bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-extrabold px-8 py-4 rounded-xl text-sm tracking-wide transition-all hover:shadow-xl hover:shadow-cyan-500/20 active:scale-95 flex items-center gap-2"
              >
                ACESSAR SISTEMA
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push("/cadastro/aluno")}
                className="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold px-8 py-4 rounded-xl text-sm tracking-wide transition-all border border-white/20 flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                PRIMEIRO ACESSO
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              {HERO_STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-black text-cyan-500">{s.num}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bus Image */}
          <div className="hidden lg:flex justify-end">
            <div className="relative w-full max-w-lg">
              <div className="absolute -inset-4 bg-cyan-500/10 rounded-3xl blur-2xl" />
              <Image
                src="/images/hero-bus.png"
                alt="Ônibus Rota UEFS"
                width={600}
                height={400}
                className="relative rounded-2xl shadow-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,20 1440,25 L1440,60 L0,60 Z" fill="#f8fafc" />
        </svg>
      </div>
    </section>
  );
}
