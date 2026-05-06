"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, BusFront, CheckCircle2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthPageShell } from "@/components/auth/auth-page-shell";

const DEFAULT_MESSAGE =
  "Seu endereco de e-mail foi alterado com sucesso. Use o novo e-mail nas proximas comunicacoes.";

type EmailConfirmationScreenProps = {
  message?: string;
};

function SuccessIcon() {
  return (
    <div className="relative flex items-center justify-center">
      <span className="absolute inline-flex h-24 w-24 animate-ping rounded-full bg-emerald-400 opacity-20" />
      <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/30">
        <CheckCircle2 className="h-10 w-10 text-white drop-shadow" />
      </div>
    </div>
  );
}

export function EmailConfirmationScreen({ message }: EmailConfirmationScreenProps) {
  const router = useRouter();
  const displayMessage = message || DEFAULT_MESSAGE;

  return (
    <AuthPageShell>
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-10 bg-emerald-400" />

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out z-10">
        <div className="overflow-hidden rounded-2xl bg-white/85 shadow-2xl backdrop-blur-md border border-white/60">
          <div className="h-1.5 w-full rounded-t-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-[#23B99A]" />

          <div className="flex flex-col items-center gap-6 px-8 py-10 text-center">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#103173] shadow-md">
                <BusFront className="h-5 w-5 text-[#F2D022]" />
              </div>
              <span className="text-xl font-black tracking-tight text-[#103173]">
                Rota UEFS
              </span>
            </div>

            <SuccessIcon />

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-700 border border-emerald-200">
              <MailCheck className="h-3.5 w-3.5" />
              Alteracao confirmada
            </span>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-[#103173] leading-tight">
                E-mail alterado!
              </h1>
              <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                {displayMessage}
              </p>
            </div>

            <div className="w-full h-px bg-slate-100" />

            <Button
              onClick={() => router.push("/login")}
              className="w-full h-12 bg-[#103173] hover:bg-[#0d2860] text-white font-black rounded-xl shadow-lg shadow-[#103173]/20 transition-all active:scale-95 group"
            >
              <span>Ir para o Login</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </AuthPageShell>
  );
}
