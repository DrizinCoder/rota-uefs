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
  BriefcaseBusiness,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { Typewriter } from "@/components/ui/typewriter";
import { authService, RegisterServidorDTO } from "@/services/authService";

function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: "", colorClass: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Fraca", colorClass: "bg-red-400" };
  if (score === 2) return { score, label: "Regular", colorClass: "bg-yellow-400" };
  if (score === 3) return { score, label: "Boa", colorClass: "bg-blue-400" };
  return { score, label: "Forte", colorClass: "bg-green-500" };
}

const CADASTRO_SERVIDOR_TITLE_WORDS = ["Cadastro de Servidor", "Docentes e técnico-administrativos"];

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, text: "Mínimo 8 caracteres" },
  { test: (p: string) => /[A-Z]/.test(p), text: "Uma letra maiúscula" },
  { test: (p: string) => /[0-9]/.test(p), text: "Um número" },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), text: "Um símbolo (!@#...)" },
];

function SucessoScreen() {
  const router = useRouter();
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] flex flex-col items-center text-center">
        <div className="bg-amber-50 rounded-full p-5 mb-6">
          <Clock className="h-10 w-10 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cadastro em análise</h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-2">
          Seu cadastro foi recebido com sucesso.
        </p>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Como medida de segurança, o acesso de servidores e docentes passa por uma conferência
          de dados institucionais. Você receberá um e-mail quando o cadastro for validado.
        </p>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full mb-8">
          <Clock className="h-3 w-3" />
          Pendente de validação
        </span>
        <Button
          onClick={() => router.push("/")}
          className="w-full h-11 bg-[#103173] hover:bg-[#0d2660] text-white font-semibold rounded-lg transition-all duration-150 active:scale-[0.98] shadow-sm shadow-[#103173]/30"
        >
          Voltar para Home
        </Button>
        <div className="flex items-center justify-center gap-1.5 mt-8 text-gray-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="text-[11px] font-medium tracking-wide uppercase">
            Acesso restrito à comunidade acadêmica
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CadastroProfessorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSucesso, setIsSucesso] = useState(false);
  const [erro, setErro] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<RegisterServidorDTO>({
    full_name: "",
    registration_id: "",
    employment: "",
    department: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (erro) setErro("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErro("");

    try {
      await authService.cadastroServidor(formData);
      setIsSucesso(true);
    } catch {
      setErro("Erro ao realizar cadastro. Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (isSucesso) return <SucessoScreen />;

  return (
    <div className="min-h-screen w-full bg-white relative">
      <Button
        type="button"
        variant="outline"
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 h-10 px-4 text-sm font-medium border-gray-200 text-gray-600 hover:text-[#103173] hover:border-[#103173]/40 hover:bg-[#103173]/5"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Home
      </Button>

      <div className="flex justify-center px-6 py-20 sm:py-16">
        <div className="w-full max-w-[440px]">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/images/logo_rota_no_bg.png"
              alt="Rota UEFS"
              width={220}
              height={93}
              className="w-[170px] sm:w-[210px] h-auto object-contain mb-5"
              priority
            />
            <h1 className="w-full min-w-0 text-[2rem] font-bold text-gray-900 tracking-tight">
              <Typewriter
                words={CADASTRO_SERVIDOR_TITLE_WORDS}
                speed={80}
                delayBetweenWords={2600}
                cursor
                cursorChar="|"
              />
            </h1>
            <p className="text-sm text-gray-500 text-center mt-1.5 leading-relaxed">
              Para docentes e servidores técnico-administrativos da UEFS
            </p>
          </div>

          {/* Erro */}
          {erro && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 mb-5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <TooltipProvider delayDuration={300}>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Nome Completo */}
              <div className="space-y-1.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label htmlFor="full_name" className="text-sm font-semibold text-gray-700 cursor-default select-none">
                      Nome Completo
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Seu nome como consta nos documentos oficiais</p>
                  </TooltipContent>
                </Tooltip>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="full_name"
                    name="full_name"
                    placeholder="Seu nome completo"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className="pl-10 h-11 border-gray-200 rounded-lg text-sm focus-visible:ring-[#103173] focus-visible:border-[#103173] transition-colors"
                  />
                </div>
              </div>

              {/* Matrícula + Vínculo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="registration_id" className="text-sm font-semibold text-gray-700 cursor-default select-none">
                        Matrícula
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Número de matrícula SIAPE ou institucional da UEFS</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="relative">
                    <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <Input
                      id="registration_id"
                      name="registration_id"
                      placeholder="2024101"
                      value={formData.registration_id}
                      onChange={handleChange}
                      required
                      className="pl-10 h-11 border-gray-200 rounded-lg text-sm focus-visible:ring-[#103173] focus-visible:border-[#103173] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="employment" className="text-sm font-semibold text-gray-700 cursor-default select-none">
                        Vínculo
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Selecione seu tipo de vínculo com a UEFS</p>
                    </TooltipContent>
                  </Tooltip>
                  <select
                    id="employment"
                    name="employment"
                    value={formData.employment}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-3 border border-gray-200 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#103173] focus:border-[#103173] transition-colors"
                  >
                    <option value="" disabled>Selecione...</option>
                    <option value="Faculty">Docente</option>
                    <option value="Staff">Servidor Técnico</option>
                  </select>
                </div>
              </div>

              {/* Departamento */}
              <div className="space-y-1.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label htmlFor="department" className="text-sm font-semibold text-gray-700 cursor-default select-none">
                      Departamento
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Ex: DTEC, DEXA, DCE, DMAC...</p>
                  </TooltipContent>
                </Tooltip>
                <div className="relative">
                  <BriefcaseBusiness className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="department"
                    name="department"
                    placeholder="Ex: DTEC"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="pl-10 h-11 border-gray-200 rounded-lg text-sm focus-visible:ring-[#103173] focus-visible:border-[#103173] transition-colors"
                  />
                </div>
              </div>

              {/* Telefone + E-mail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 cursor-default select-none">
                        Telefone
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>DDD + número com 10 ou 11 dígitos</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(75) 9 0000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      autoComplete="tel"
                      className="pl-10 h-11 border-gray-200 rounded-lg text-sm focus-visible:ring-[#103173] focus-visible:border-[#103173] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700 cursor-default select-none">
                        E-mail
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Use seu e-mail institucional @uefs.br</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@uefs.br"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      className="pl-10 h-11 border-gray-200 rounded-lg text-sm focus-visible:ring-[#103173] focus-visible:border-[#103173] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-1.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700 cursor-default select-none">
                      Senha
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>Mínimo 8 caracteres. Use letras maiúsculas, números e símbolos para maior segurança.</p>
                  </TooltipContent>
                </Tooltip>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Crie uma senha forte"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="pl-10 pr-10 h-11 border-gray-200 rounded-lg text-sm focus-visible:ring-[#103173] focus-visible:border-[#103173] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Indicador de força */}
                {formData.password && (
                  <div className="space-y-2 pt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= passwordStrength.score
                              ? passwordStrength.colorClass
                              : "bg-gray-100"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">Força da senha</p>
                      <p
                        className={`text-xs font-semibold ${
                          passwordStrength.score <= 1
                            ? "text-red-500"
                            : passwordStrength.score === 2
                            ? "text-yellow-500"
                            : passwordStrength.score === 3
                            ? "text-blue-500"
                            : "text-green-600"
                        }`}
                      >
                        {passwordStrength.label}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {PASSWORD_RULES.map(({ test, text }) => {
                        const ok = test(formData.password);
                        return (
                          <div
                            key={text}
                            className={`flex items-center gap-1.5 text-xs transition-colors ${
                              ok ? "text-green-600" : "text-gray-400"
                            }`}
                          >
                            <CheckCircle2
                              className={`h-3 w-3 shrink-0 ${
                                ok ? "text-green-500" : "text-gray-300"
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

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#103173] hover:bg-[#0d2660] text-white font-semibold rounded-lg transition-all duration-150 active:scale-[0.98] mt-1 shadow-sm shadow-[#103173]/30"
              >
                {isLoading ? "Enviando solicitação..." : "Solicitar cadastro"}
              </Button>

              <p className="text-center text-sm text-gray-500">
                Já tem conta?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="font-semibold text-[#103173] hover:underline underline-offset-2 transition-colors"
                >
                  Entrar
                </button>
              </p>
            </form>
          </TooltipProvider>

          <div className="flex items-center justify-center gap-1.5 mt-8 text-gray-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="text-[11px] font-medium tracking-wide uppercase">
              Acesso restrito à comunidade acadêmica
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
