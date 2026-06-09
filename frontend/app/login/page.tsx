"use client";

import { authService, LoginUserDTO } from "@/services/authService";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  GraduationCap,
  BookOpen,
  LogIn,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { Typewriter } from "@/components/ui/typewriter";
import { DotPattern } from "@/components/ui/dot-pattern";

const LOGIN_SUPPORT_PHRASES = [
  "Organize sua viagem com mais segurança e previsibilidade.",
  "Reservas e acompanhamento em um só lugar.",
  "Mobilidade entre Salvador e Feira com transparência.",
  "Conta institucional para a comunidade acadêmica da UEFS.",
];

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<LoginUserDTO>({
    registration_id: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const REDIRECT_MAP: Record<string, string> = {
    Student: "/passageiro",
    Staff: "/passageiro",
    Faculty: "/passageiro",
    Driver: "/motorista",
    Admin: "/admin",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErro("");

    try {
      const resposta = await authService.login(formData);
      const profile = resposta.data.user.profile;
      const destino = REDIRECT_MAP[profile] || "/login";

      localStorage.setItem("token", resposta.data.access_token);
      document.cookie = `user_profile=${profile}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; SameSite=Lax`;
      router.push(destino);
    } catch {
      setErro("Matrícula ou senha incorretos. Verifique suas credenciais.");
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

      <button
        type="button"
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm font-bold text-[#73AABF] hover:text-[#103173] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>

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
          <h1 className="w-full text-center text-2xl font-extrabold tracking-tight text-[#103173] sm:text-3xl">
            Bem-vindo de volta
          </h1>
          <div className="mx-auto mt-2 min-h-[2.5rem] w-full max-w-[17.5rem] text-center text-[13px] leading-snug text-[#73AABF] sm:mt-2.5 sm:min-h-[2.85rem] sm:max-w-md sm:text-sm sm:leading-relaxed">
            <Typewriter
              words={LOGIN_SUPPORT_PHRASES}
              speed={72}
              delayBetweenWords={2600}
              cursor={false}
              allowWrap
            />
          </div>
        </div>

        {/* Card do formulário */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          {/* Erro */}
          {erro && (
            <div className="flex items-center gap-2.5 bg-red-50 text-red-600 text-sm p-3.5 rounded-xl border border-red-100 mb-5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="font-medium">{erro}</span>
            </div>
          )}

          {/* Formulário */}
          <TooltipProvider delayDuration={300}>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Matrícula */}
              <div className="space-y-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label
                      htmlFor="registration_id"
                      className="text-sm font-bold text-[#103173]/70 cursor-default select-none"
                    >
                      Matrícula
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>Número de matrícula institucional fornecido pela UEFS</p>
                  </TooltipContent>
                </Tooltip>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#73AABF] pointer-events-none" />
                  <Input
                    id="registration_id"
                    name="registration_id"
                    type="text"
                    placeholder="Ex: 23121111"
                    value={formData.registration_id}
                    onChange={handleChange}
                    maxLength={15}
                    required
                    autoComplete="username"
                    className="pl-10 h-12 bg-[#f0f4f8] border-transparent rounded-xl text-sm font-medium text-[#103173] placeholder:text-[#73AABF]/50 focus-visible:ring-[#103173] focus-visible:border-[#103173] focus-visible:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label
                        htmlFor="password"
                        className="text-sm font-bold text-[#103173]/70 cursor-default select-none"
                      >
                        Senha
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p>Senha definida no seu primeiro acesso ao sistema</p>
                    </TooltipContent>
                  </Tooltip>
                  <button
                    type="button"
                    onClick={() => router.push("/recuperar-senha")}
                    className="text-xs font-bold text-[#73AABF] hover:text-[#103173] hover:underline underline-offset-2 transition-colors"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#73AABF] pointer-events-none" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
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

              {/* Botão entrar */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-13 bg-[#103173] hover:bg-[#0d2660] text-white font-extrabold text-base rounded-xl transition-all duration-200 active:scale-[0.97] mt-2 shadow-lg shadow-[#103173]/25 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </TooltipProvider>
        </div>

        {/* Divisor */}
        <div className="flex items-center gap-3 my-7">
          <div className="flex-1 h-px bg-[#103173]/[0.08]" />
          <span className="text-xs text-[#73AABF] font-bold uppercase tracking-wider">
            primeiro acesso?
          </span>
          <div className="flex-1 h-px bg-[#103173]/[0.08]" />
        </div>

        {/* Cadastro */}
        <div className="grid grid-cols-2 gap-3">
          <Tooltip>
            <TooltipProvider delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/cadastro/aluno")}
                  className="h-12 bg-white border border-slate-100 hover:border-[#103173]/20 hover:bg-[#103173]/5 text-[#103173]/60 hover:text-[#103173] font-bold text-sm rounded-xl transition-all gap-2 shadow-sm"
                >
                  <GraduationCap className="h-4 w-4" />
                  Sou Aluno
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Criar conta como estudante da UEFS</p>
              </TooltipContent>
            </TooltipProvider>
          </Tooltip>

          <Tooltip>
            <TooltipProvider delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/cadastro/professor")}
                  className="h-12 bg-white border border-slate-100 hover:border-[#103173]/20 hover:bg-[#103173]/5 text-[#103173]/60 hover:text-[#103173] font-bold text-sm rounded-xl transition-all gap-2 shadow-sm"
                >
                  <BookOpen className="h-4 w-4" />
                  Sou Servidor
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Criar conta como docente ou servidor da UEFS</p>
              </TooltipContent>
            </TooltipProvider>
          </Tooltip>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-center gap-1.5 mt-10 text-[#73AABF]/50">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="text-[11px] font-bold tracking-wide uppercase">
            Acesso restrito à comunidade acadêmica
          </span>
        </div>
      </div>
    </div>
  );
}
