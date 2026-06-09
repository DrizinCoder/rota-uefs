"use client";

import { useRouter } from "next/navigation";
import { LogIn, Phone } from "lucide-react";

export function LandingContact() {
  const router = useRouter();

  return (
    <section id="contato" className="scroll-mt-24 bg-white py-20">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fale Conosco</span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 mb-4">
          PRONTO PARA <span className="text-cyan-500">EMBARCAR</span>?
        </h2>
        <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto">
          Cadastre-se agora e garanta sua vaga no transporte universitário da UEFS.
          É rápido, seguro e <strong className="text-slate-900">totalmente gratuito</strong>.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="bg-slate-900 hover:bg-slate-950 text-white font-extrabold px-8 py-4 rounded-xl text-sm transition-all hover:shadow-xl active:scale-95 flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            LOGIN / CADASTRO
          </button>
          <a
            href="mailto:contato@rotauefs.com.br"
            className="bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold px-8 py-4 rounded-xl text-sm transition-all flex items-center gap-2 border border-slate-900/10"
          >
            <Phone className="h-4 w-4" />
            CONTATO
          </a>
        </div>
      </div>
    </section>
  );
}