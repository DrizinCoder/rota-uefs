"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  LogIn,
  MailWarning,
  MailX,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { cn } from "@/lib/utils";

export type EmailErrorType = "email_in_use" | "invalid_email" | "expired" | "error";

type ErrorConfig = {
  icon: React.ElementType;
  title: string;
  defaultMessage: string;
  helpText: string;
  badge: string;
  gradientFrom: string;
  gradientTo: string;
  badgeClass: string;
};

const ERROR_CONFIGS: Record<EmailErrorType, ErrorConfig> = {
  email_in_use: {
    icon: MailX,
    title: "E-mail ja em uso",
    defaultMessage:
      "O endereco de e-mail informado ja esta associado a outra conta no sistema.",
    helpText:
      "Tente usar um e-mail diferente ou fale com o suporte caso ache que isso e um erro.",
    badge: "Conflito de e-mail",
    gradientFrom: "from-orange-400",
    gradientTo: "to-orange-600",
    badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
  },
  invalid_email: {
    icon: MailWarning,
    title: "E-mail invalido",
    defaultMessage: "O endereco de e-mail informado e invalido.",
    helpText: "Revise o e-mail e tente novamente pelo seu perfil.",
    badge: "Formato invalido",
    gradientFrom: "from-amber-400",
    gradientTo: "to-yellow-600",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  expired: {
    icon: Clock,
    title: "Link expirado",
    defaultMessage:
      "O link de confirmacao expirou ou ja foi utilizado anteriormente.",
    helpText: "Solicite um novo link pelo seu perfil.",
    badge: "Link invalido",
    gradientFrom: "from-slate-400",
    gradientTo: "to-slate-600",
    badgeClass: "bg-slate-50 text-slate-700 border-slate-200",
  },
  error: {
    icon: ShieldAlert,
    title: "Nao foi possivel trocar o e-mail",
    defaultMessage: "Ocorreu um erro inesperado ao processar a alteracao.",
    helpText: "Tente novamente em alguns instantes.",
    badge: "Erro no processo",
    gradientFrom: "from-red-400",
    gradientTo: "to-red-600",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
  },
};

type EmailChangeErrorScreenProps = {
  errorType: EmailErrorType;
  message?: string;
};

export function EmailChangeErrorScreen({ errorType, message }: EmailChangeErrorScreenProps) {
  const router = useRouter();
  const config = ERROR_CONFIGS[errorType] ?? ERROR_CONFIGS.error;
  const Icon = config.icon;
  const displayMessage = message || config.defaultMessage;

  return (
    <AuthPageShell>
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-10 bg-gradient-to-br",
          config.gradientFrom,
          config.gradientTo,
        )}
      />

      <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
        <div className="overflow-hidden rounded-2xl bg-white/85 shadow-2xl backdrop-blur-md border border-white/60">
          <div className={cn("h-1.5 w-full bg-gradient-to-r", config.gradientFrom, config.gradientTo)} />

          <div className="flex flex-col items-center gap-5 px-8 py-10 text-center">
            <div className="relative flex items-center justify-center">
              <span
                className={cn(
                  "absolute inline-flex h-24 w-24 animate-ping rounded-full opacity-15 bg-gradient-to-br",
                  config.gradientFrom,
                  config.gradientTo,
                )}
              />
              <div
                className={cn(
                  "relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br shadow-xl",
                  config.gradientFrom,
                  config.gradientTo,
                )}
              >
                <Icon className="h-10 w-10 text-white drop-shadow" />
              </div>
            </div>

            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest border", config.badgeClass)}>
              <Icon className="h-3.5 w-3.5" />
              {config.badge}
            </span>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-[#103173] leading-tight">{config.title}</h1>
              <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                {displayMessage}
              </p>
            </div>

            <div className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-left">
              <p className="text-xs font-medium text-slate-500 leading-relaxed">{config.helpText}</p>
            </div>

            <div className="w-full h-px bg-slate-100" />

            <div className="w-full flex flex-col gap-3">
              <Button
                onClick={() => router.push("/perfil")}
                className="w-full h-12 bg-[#103173] hover:bg-[#0d2860] text-white font-black rounded-xl"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar novamente no Perfil
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="w-full h-11 border-2 border-[#103173]/10 hover:border-[#103173]/30 hover:bg-[#103173]/5 text-[#103173] font-bold rounded-xl"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Ir para o Login
              </Button>

              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="w-full h-10 text-slate-500"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthPageShell>
  );
}
