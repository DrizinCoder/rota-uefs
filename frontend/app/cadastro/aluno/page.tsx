"use client";

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
  Mail,
  Phone,
  User,
  ArrowLeft,
  BadgeCheck,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { Typewriter } from "@/components/ui/typewriter";
import { DotPattern } from "@/components/ui/dot-pattern";
import { authService, RegisterAlunoDTO } from "@/services/authService";
import { toast } from "react-toastify";

function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: "", colorClass: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Fraca", colorClass: "bg-red-400" };
  if (score === 2) return { score, label: "Regular", colorClass: "bg-amber-400" };
  if (score === 3) return { score, label: "Boa", colorClass: "bg-blue-400" };
  return { score, label: "Forte", colorClass: "bg-emerald-500" };
}

const CADASTRO_ALUNO_SUPPORT_PHRASES = [
  "Transporte universitário com critérios institucionais.",
  "Planeje deslocamentos com mais segurança e previsibilidade.",
  "Acesso ao sistema de viagens da comunidade UEFS.",
];
const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, text: "Mínimo 8 caracteres" },
  { test: (p: string) => /[A-Z]/.test(p), text: "Uma letra maiúscula" },
  { test: (p: string) => /[0-9]/.test(p), text: "Um número" },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), text: "Um símbolo (!@#...)" },
];

export default function CadastroAlunoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<RegisterAlunoDTO>({
    full_name: "",
    password: "",
    registration_id: "",
    phone: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === "registration_id") {
      value = value.replace(/\D/g, "").slice(0, 8);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (erro) setErro("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setErro("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    setErro("");

    try {
      await authService.cadastroAluno(formData);
      toast.success("Cadastro realizado! Verifique seu e-mail para ativar a conta.");
      router.push("/login");
    } catch {
      setErro("Erro ao realizar cadastro. Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen w-full bg-[#f0f4f8] relative overflow-hidden">
      <DotPattern
        radialFade="edges"
        width={18}
        height={18}
        cr={1}
        className="text-[#103173]/[0.06]"
      />
      <button
        type="button"
        onClick={() => router.push("/login")}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm font-bold text-[#73AABF] hover:text-[#103173] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Login
      </button>

      <div className="relative z-10 flex justify-center px-4 py-20 sm:py-16">
        <div className="w-full max-w-2xl">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8 sm:mb-10">
            <Image
              src="/images/logo_rota_no_bg.png"
              alt="Rota UEFS"
              width={360}
              height={152}
              className="w-[240px] sm:w-[280px] h-auto object-contain mb-6"
              priority
            />
            <h1 className="w-full text-center text-2xl font-extrabold tracking-tight text-[#103173] sm:text-3xl">
              Cadastro de Aluno
            </h1>
            <div className="mx-auto mt-2 min-h-[2.5rem] w-full max-w-[17.5rem] text-center text-[13px] leading-snug text-[#73AABF] sm:mt-2.5 sm:min-h-[2.85rem] sm:max-w-md sm:text-sm sm:leading-relaxed">
              <Typewriter
                words={CADASTRO_ALUNO_SUPPORT_PHRASES}
                speed={72}
                delayBetweenWords={2600}
                cursor={false}
                allowWrap
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
            {/* Erro */}
            {erro && (
              <div className="flex items-center gap-2.5 bg-red-50 text-red-600 text-sm p-3.5 rounded-xl border border-red-100 mb-5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="font-medium">{erro}</span>
              </div>
            )}

            <TooltipProvider delayDuration={300}>
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Nome Completo */}
                <div className="space-y-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="full_name" className="text-sm font-bold text-[#103173]/70 cursor-default select-none">
                        Nome Completo
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Seu nome como consta nos documentos oficiais</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#73AABF] pointer-events-none" />
                    <Input
                      id="full_name"
                      name="full_name"
                      placeholder="João da Silva"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      className="pl-10 h-12 bg-[#f0f4f8] border-transparent rounded-xl text-sm font-medium text-[#103173] placeholder:text-[#73AABF]/50 focus-visible:ring-[#103173] focus-visible:border-[#103173] focus-visible:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Matrícula + Telefone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                  <div className="space-y-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label htmlFor="registration_id" className="text-sm font-bold text-[#103173]/70 cursor-default select-none">
                          Matrícula
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Número de matrícula da UEFS — 8 dígitos numéricos</p>
                      </TooltipContent>
                    </Tooltip>
                    <div className="relative">
                      <BadgeCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#73AABF] pointer-events-none" />
                      <Input
                        id="registration_id"
                        name="registration_id"
                        placeholder="23121111"
                        value={formData.registration_id}
                        onChange={handleChange}
                        maxLength={8}
                        required
                        className="pl-10 h-12 bg-[#f0f4f8] border-transparent rounded-xl text-sm font-medium text-[#103173] placeholder:text-[#73AABF]/50 focus-visible:ring-[#103173] focus-visible:border-[#103173] focus-visible:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label htmlFor="phone" className="text-sm font-bold text-[#103173]/70 cursor-default select-none">
                          Telefone
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>DDD + número com 10 ou 11 dígitos</p>
                      </TooltipContent>
                    </Tooltip>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#73AABF] pointer-events-none" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(75) 9 0000-0000"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        autoComplete="tel"
                        className="pl-10 h-12 bg-[#f0f4f8] border-transparent rounded-xl text-sm font-medium text-[#103173] placeholder:text-[#73AABF]/50 focus-visible:ring-[#103173] focus-visible:border-[#103173] focus-visible:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* E-mail */}
                <div className="space-y-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="email" className="text-sm font-bold text-[#103173]/70 cursor-default select-none">
                        E-mail Institucional
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Use seu e-mail @discente.uefs.br</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#73AABF] pointer-events-none" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="23121111@discente.uefs.br"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      className="pl-10 h-12 bg-[#f0f4f8] border-transparent rounded-xl text-sm font-medium text-[#103173] placeholder:text-[#73AABF]/50 focus-visible:ring-[#103173] focus-visible:border-[#103173] focus-visible:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="password" className="text-sm font-bold text-[#103173]/70 cursor-default select-none">
                        Senha
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p>Mínimo 8 caracteres. Use letras maiúsculas, números e símbolos para maior segurança.</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#73AABF] pointer-events-none" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Crie uma senha forte"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      className="pl-10 pr-10 h-12 bg-[#f0f4f8] border-transparent rounded-xl text-sm font-medium text-[#103173] placeholder:text-[#73AABF]/50 focus-visible:ring-[#103173] focus-visible:border-[#103173] focus-visible:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#73AABF] hover:text-[#103173] transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Indicador de força */}
                  {formData.password && (
                    <div className="space-y-2 pt-2">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= passwordStrength.score
                                ? passwordStrength.colorClass
                                : "bg-slate-100"
                              }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#73AABF]">Força da senha</p>
                        <p
                          className={`text-xs font-bold ${passwordStrength.score <= 1
                              ? "text-red-500"
                              : passwordStrength.score === 2
                                ? "text-amber-500"
                                : passwordStrength.score === 3
                                  ? "text-blue-500"
                                  : "text-emerald-600"
                            }`}
                        >
                          {passwordStrength.label}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                        {PASSWORD_RULES.map(({ test, text }) => {
                          const ok = test(formData.password);
                          return (
                            <div
                              key={text}
                              className={`flex items-center gap-1.5 text-xs transition-colors ${ok ? "text-emerald-600 font-medium" : "text-[#73AABF]/70 font-medium"
                                }`}
                            >
                              <CheckCircle2
                                className={`h-3 w-3 shrink-0 ${ok ? "text-emerald-500" : "text-[#73AABF]/30"
                                  }`}
                              />
                              {text}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirmar Senha */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-bold text-[#103173]/70 cursor-default select-none">
                    Confirmar Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#73AABF] pointer-events-none" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Digite a senha novamente"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (erro) setErro("");
                      }}
                      required
                      autoComplete="new-password"
                      className="pl-10 pr-10 h-12 bg-[#f0f4f8] border-transparent rounded-xl text-sm font-medium text-[#103173] placeholder:text-[#73AABF]/50 focus-visible:ring-[#103173] focus-visible:border-[#103173] focus-visible:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#73AABF] hover:text-[#103173] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-13 bg-[#103173] hover:bg-[#0d2660] text-white font-extrabold text-base rounded-xl transition-all duration-200 active:scale-[0.97] mt-3 shadow-lg shadow-[#103173]/25 disabled:opacity-60"
                >
                  {isLoading ? "Criando conta..." : "Criar conta"}
                </Button>

                <p className="text-center text-sm text-[#73AABF] font-medium pt-2">
                  Já tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="font-bold text-[#103173] hover:underline underline-offset-2 transition-colors"
                  >
                    Entrar
                  </button>
                </p>
              </form>
            </TooltipProvider>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-8 text-[#73AABF]/50">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold tracking-wide uppercase">
              Acesso restrito à comunidade acadêmica
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
