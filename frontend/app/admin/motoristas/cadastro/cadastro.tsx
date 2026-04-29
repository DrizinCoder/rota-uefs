"use client";

import { useState, type FormEvent } from "react";
import { adminService } from "@/services/adminService";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Plus,
  Save,
  UserRound,
  UserCircle,
  Bus,
  ShieldAlert
} from "lucide-react";

interface MotoristaFormState {
  nome: string;
  matricula: string;
  telefone: string;
  email: string;
  senha?: string;
}

export default function CadastroEdicaoMotoristaPage() {
  const router = useRouter();
  const [erros, setErros] = useState({
    nome: "",
    matricula: "",
    telefone: "",
    email: "",
    senha: "",
    geral: "",
  });

  const [formData, setFormData] = useState<MotoristaFormState>({
    nome: "",
    matricula: "",
    telefone: "",
    email: "",
    senha: "",
  });

  const atualizarCampo = <K extends keyof MotoristaFormState>(
    campo: K,
    valor: MotoristaFormState[K],
  ) => {
    setFormData((atual) => ({
      ...atual,
      [campo]: valor,
    }));
    if (erros[campo as keyof typeof erros]) {
      setErros((atual) => ({ ...atual, [campo]: "", geral: "" }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErros({ nome: "", matricula: "", telefone: "", email: "", senha: "", geral: "" });

    const nome = formData.nome.trim();
    const matricula = formData.matricula.trim();
    const telefoneNumeros = formData.telefone.replace(/\D/g, "");
    const email = formData.email.trim().toLowerCase();
    const senha = formData.senha || "";
    const novosErros = { nome: "", matricula: "", telefone: "", email: "", senha: "", geral: "" };
    let temErro = false;

    if (nome.length < 3) {
      novosErros.nome = "Nome completo deve ter pelo menos 3 caracteres.";
      temErro = true;
    }
    if (!/^[A-Za-z0-9-]{4,20}$/.test(matricula)) {
      novosErros.matricula = "Guia de matrícula inválido (4 a 20 caracteres alfanuméricos).";
      temErro = true;
    }
    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
      novosErros.telefone = "Telefone inválido. Informe DDD + número com 10 ou 11 dígitos.";
      temErro = true;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      novosErros.email = "E-mail inválido.";
      temErro = true;
    }
    if (senha.length < 8) {
      novosErros.senha = "A senha deve ter pelo menos 8 caracteres.";
      temErro = true;
    }

    if (temErro) {
      novosErros.geral = "Corrija os campos destacados para continuar.";
      setErros(novosErros);
      return;
    }

    try {
      await adminService.cadastrarMotorista({
        full_name: nome,
        registration_id: matricula,
        phone: telefoneNumeros,
        email: email,
        password: senha,
      });
      router.push("/admin/motoristas");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Erro ao cadastrar motorista. Tente novamente.";
      setErros((atual) => ({ ...atual, geral: msg }));
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] pb-24">
      <Navigation tipoUsuario="admin"/>

      <main className="flex-1 w-full max-w-4xl mx-auto py-10 px-4 space-y-6">
        <Button
          variant="ghost"
          className="w-fit text-[#103173] font-black hover:bg-[#103173]/10"
          onClick={() => router.push("/admin/motoristas")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          VOLTAR PARA GESTÃO DE MOTORISTAS
        </Button>

        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-[#103173] flex items-center gap-3 tracking-tight">
              <div className="bg-[#103173] p-2 rounded-xl shadow-lg shadow-[#103173]/20">
                <UserRound className="h-7 w-7 text-[#F2D022]" />
              </div>
              Cadastro de Motorista
            </h1>
            <p className="text-[#73AABF] font-bold text-sm md:text-base">
              Preencha os dados abaixo para cadastrar um novo condutor.
            </p>
          </div>
        </header>

        <form className="gap-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card className="border-none shadow-lg bg-white">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-[#103173] font-black text-xl">
                  Dados do Condutor
                </CardTitle>
              </CardHeader>
              {erros.geral && (
                <div className="mx-6 mt-6 bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl border border-red-100">
                  {erros.geral}
                </div>
              )}
              <CardContent className="p-6 grid sm:grid-cols-2 gap-4">
                
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="nome" className="text-[#103173] font-bold">
                    Nome Completo
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(event) => atualizarCampo("nome", event.target.value)}
                    placeholder="Ex: João Silva"
                    className={`h-11 focus:border-[#103173] focus:ring-[#103173] ${
                      erros.nome ? "border-red-300 bg-red-50" : "border-[#73AABF]/30"
                    }`}
                    required
                  />
                  {erros.nome && <p className="text-xs text-red-500 font-medium">{erros.nome}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#103173] font-bold">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => atualizarCampo("email", event.target.value)}
                    placeholder="nome@uefs.br"
                    className={`h-11 focus:border-[#103173] focus:ring-[#103173] ${
                      erros.email ? "border-red-300 bg-red-50" : "border-[#73AABF]/30"
                    }`}
                    required
                  />
                  {erros.email && <p className="text-xs text-red-500 font-medium">{erros.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-[#103173] font-bold">
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(event) => atualizarCampo("telefone", event.target.value.replace(/[^\d()\-\s+]/g, ""))}
                    placeholder="(75) 99999-9999"
                    className={`h-11 focus:border-[#103173] focus:ring-[#103173] ${
                      erros.telefone ? "border-red-300 bg-red-50" : "border-[#73AABF]/30"
                    }`}
                    required
                  />
                  {erros.telefone && <p className="text-xs text-red-500 font-medium">{erros.telefone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matricula" className="text-[#103173] font-bold">
                    Guia de Matrícula
                  </Label>
                  <Input
                    id="matricula"
                    value={formData.matricula}
                    onChange={(event) => atualizarCampo("matricula", event.target.value.toUpperCase().replace(/\s/g, ""))}
                    placeholder="Ex: 2021001"
                    className={`h-11 focus:border-[#103173] focus:ring-[#103173] ${
                      erros.matricula ? "border-red-300 bg-red-50" : "border-[#73AABF]/30"
                    }`}
                    required
                  />
                  {erros.matricula && <p className="text-xs text-red-500 font-medium">{erros.matricula}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senha" className="text-[#103173] font-bold">
                    Senha
                  </Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formData.senha}
                    onChange={(event) => atualizarCampo("senha", event.target.value)}
                    placeholder="Sua senha secreta"
                    className={`h-11 focus:border-[#103173] focus:ring-[#103173] ${
                      erros.senha ? "border-red-300 bg-red-50" : "border-[#73AABF]/30"
                    }`}
                    required
                  />
                  {erros.senha && <p className="text-xs text-red-500 font-medium">{erros.senha}</p>}
                </div>

              </CardContent>
              <CardFooter className="p-6 border-t border-slate-100 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto h-11 border-2 border-[#103173] text-[#103173] font-black hover:bg-[#103173] hover:text-white"
                  onClick={() => router.push("/admin/motoristas")}
                >
                  CANCELAR
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto h-11 bg-[#23B99A] hover:bg-[#1d957c] text-white font-black shadow-lg shadow-[#23B99A]/20"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  CADASTRAR MOTORISTA
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </main>

      <FooterSection />

    </div>
  );
}