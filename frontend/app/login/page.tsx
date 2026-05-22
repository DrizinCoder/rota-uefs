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
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-6 relative overflow-hidden">
      <DotPattern
        radialFade="edges"
        width={18}
        height={18}
        cr={1}
        className="text-neutral-400/55"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 z-10 h-10 px-4 text-sm font-medium border-gray-200 text-gray-600 hover:text-[#103173] hover:border-[#103173]/40 hover:bg-[#103173]/5"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Home
      </Button>

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 sm:mb-10">
          <Image
            src="/images/logo_rota_no_bg.png"
            alt="Rota UEFS"
            width={360}
            height={152}
            className="w-[300px] sm:w-[360px] h-auto object-contain mb-6"
            priority
          />
          <h1 className="w-full text-center text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl sm:font-bold">
            Entrar
          </h1>
          <div className="mx-auto mt-1.5 min-h-[2.5rem] w-full max-w-[17.5rem] text-center text-[13px] leading-snug text-gray-500 sm:mt-2 sm:min-h-[2.85rem] sm:max-w-md sm:text-sm sm:leading-relaxed">
            <Typewriter
              words={LOGIN_SUPPORT_PHRASES}
              speed={72}
              delayBetweenWords={2600}
              cursor={false}
              allowWrap
            />
          </div>
        </div>

        {/* Erro */}
        {erro && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 mb-5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* Formulário */}
        <TooltipProvider delayDuration={300}>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Matrícula */}
            <div className="space-y-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label
                    htmlFor="registration_id"
                    className="text-sm font-semibold text-gray-700 cursor-default select-none"
                  >
                    Matrícula
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>Número de matrícula institucional fornecido pela UEFS</p>
                </TooltipContent>
              </Tooltip>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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
                  className="pl-10 h-11 border-gray-200 rounded-lg text-sm focus-visible:ring-[#103173] focus-visible:border-[#103173] transition-colors"
                />
              </div>
            </div>
            {/* Senha */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-700 cursor-default select-none"
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
                  className="text-xs font-semibold text-[#103173] hover:text-[#0d2660] hover:underline underline-offset-2 transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="pl-10 pr-10 h-11 border-gray-200 rounded-lg text-sm focus-visible:ring-[#103173] focus-visible:border-[#103173] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
              className="w-full h-11 bg-[#103173] hover:bg-[#0d2660] text-white font-semibold rounded-lg transition-all duration-150 active:scale-[0.98] mt-1 shadow-sm shadow-[#103173]/30"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </TooltipProvider>

        {/* Divisor */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-medium">
            primeiro acesso?
          </span>
          <div className="flex-1 h-px bg-gray-100" />
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
                  className="h-11 border border-gray-200 hover:border-[#103173]/40 hover:bg-[#103173]/5 text-gray-600 hover:text-[#103173] font-medium text-sm rounded-lg transition-all gap-2"
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
                  className="h-11 border border-gray-200 hover:border-[#103173]/40 hover:bg-[#103173]/5 text-gray-600 hover:text-[#103173] font-medium text-sm rounded-lg transition-all gap-2"
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
        <div className="flex items-center justify-center gap-1.5 mt-10 text-gray-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="text-[11px] font-medium tracking-wide uppercase">
            Acesso restrito à comunidade acadêmica
          </span>
        </div>
      </div>
    </div>
  );
}
