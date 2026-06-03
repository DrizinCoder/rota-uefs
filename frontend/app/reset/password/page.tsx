"use client";

import { authService, ResetPasswordDTO } from "@/services/authService";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { DotPattern } from "@/components/ui/dot-pattern";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [erro, setErro] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState<ResetPasswordDTO>({
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    if (!token) {
      setErro("Link inválido ou expirado. Solicite uma nova recuperação de senha.");
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (formData.password.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setErro("As senhas não coincidem. Verifique e tente novamente.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, formData);
      setIsSuccess(true);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      setErro(
        err?.response?.data?.detail ||
          "Não foi possível redefinir a senha. O link pode ter expirado."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f4f8] p-6 relative overflow-hidden">
      <DotPattern
        radialFade="edges"
        width={18}
        height={18}
        cr={1}
        className="text-[#103173]/[0.06]"
      />

      {!isSuccess && (
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm font-bold text-[#73AABF] hover:text-[#103173] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao login
        </button>
      )}

      <div className="relative z-10 w-full max-w-xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 sm:mb-10">
          <Image
            src="/images/logo_rota_no_bg.png"
            alt="Rota UEFS"
            width={360}
            height={152}
            className="w-[280px] sm:w-[340px] h-auto object-contain mb-6"
            priority
          />
          {!isSuccess && (
            <>
              <h1 className="w-full text-center text-2xl font-extrabold tracking-tight text-[#103173] sm:text-3xl">
                Redefinir senha
              </h1>
              <p className="mt-2 text-center text-[13px] text-[#73AABF] sm:text-sm">
                Escolha uma nova senha para a sua conta.
              </p>
            </>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          {/* ── SUCESSO ── */}
          {isSuccess ? (
            <div className="flex flex-col items-center gap-5 py-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-[#23B99A]/10 p-5 rounded-full">
                <CheckCircle2 className="h-14 w-14 text-[#23B99A]" />
              </div>
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-extrabold text-[#103173]">
                  Senha redefinida!
                </h2>
                <p className="text-sm text-[#73AABF] font-medium">
                  Sua senha foi atualizada com sucesso. Faça login para continuar.
                </p>
              </div>
              <Button
                onClick={() => router.push("/login")}
                className="w-full h-12 bg-[#103173] hover:bg-[#0d2660] text-white font-extrabold text-base rounded-xl transition-all duration-200 active:scale-[0.97] shadow-lg shadow-[#103173]/25 flex items-center justify-center gap-2 mt-2"
              >
                <KeyRound className="h-5 w-5" />
                IR PARA O LOGIN
              </Button>
            </div>
          ) : (
            /* ── FORMULÁRIO ── */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Alerta de erro */}
              {erro && (
                <div className="flex items-center gap-2.5 bg-red-50 text-red-600 text-sm p-3.5 rounded-xl border border-red-100">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span className="font-medium">{erro}</span>
                </div>
              )}

              {/* Nova senha */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-bold text-[#103173]/70 cursor-default select-none"
                >
                  Nova senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#73AABF] pointer-events-none" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    disabled={!token}
                    className="pl-10 pr-10 h-12 bg-[#f0f4f8] border-transparent rounded-xl text-sm font-medium text-[#103173] placeholder:text-[#73AABF]/50 focus-visible:ring-[#103173] focus-visible:border-[#103173] focus-visible:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#73AABF] hover:text-[#103173] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmar senha */}
              <div className="space-y-2">
                <Label
                  htmlFor="password_confirmation"
                  className="text-sm font-bold text-[#103173]/70 cursor-default select-none"
                >
                  Confirmar nova senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#73AABF] pointer-events-none" />
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repita a nova senha"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    disabled={!token}
                    className="pl-10 pr-10 h-12 bg-[#f0f4f8] border-transparent rounded-xl text-sm font-medium text-[#103173] placeholder:text-[#73AABF]/50 focus-visible:ring-[#103173] focus-visible:border-[#103173] focus-visible:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    tabIndex={-1}
                    aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#73AABF] hover:text-[#103173] transition-colors"
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Botão */}
              <Button
                type="submit"
                disabled={isLoading || !token}
                className="w-full h-12 bg-[#103173] hover:bg-[#0d2660] text-white font-extrabold text-base rounded-xl transition-all duration-200 active:scale-[0.97] mt-2 shadow-lg shadow-[#103173]/25 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-5 w-5" />
                    Salvar nova senha
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Rodapé */}
        {!isSuccess && (
          <div className="flex items-center justify-center gap-1.5 mt-8 text-[#73AABF]/50">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold tracking-wide uppercase">
              Acesso restrito à comunidade acadêmica
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
