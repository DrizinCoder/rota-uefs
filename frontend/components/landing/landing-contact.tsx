"use client";

import { useRouter } from "next/navigation";
import { LogIn, Phone } from "lucide-react";

export function LandingContact() {
  const router = useRouter();

  return (
    <section id="contato" className="bg-white py-20">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <span className="text-xs font-bold text-[#73AABF] uppercase tracking-widest">Fale Conosco</span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#103173] mt-2 mb-4">
          PRONTO PARA <span className="text-[#F2D022]">EMBARCAR</span>?
        </h2>
        <p className="text-[#73AABF] font-medium mb-8 max-w-md mx-auto">
          Cadastre-se agora e garanta sua vaga no transporte universitário da UEFS.
          É rápido, seguro e <strong className="text-[#103173]">totalmente gratuito</strong>.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="bg-[#103173] hover:bg-[#0d2a63] text-white font-extrabold px-8 py-4 rounded-xl text-sm transition-all hover:shadow-xl active:scale-95 flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            LOGIN / CADASTRO
          </button>
          <a
            href="mailto:contato@rotauefs.com.br"
            className="bg-[#f0f4f8] hover:bg-[#e4ecf2] text-[#103173] font-bold px-8 py-4 rounded-xl text-sm transition-all flex items-center gap-2 border border-[#103173]/10"
          >
            <Phone className="h-4 w-4" />
            CONTATO
          </a>
        </div>
      </div>
    </section>
  );
}
