"use client";

import { useState, type FormEvent } from "react";
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
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.nome.trim() || !formData.matricula.trim() || !formData.telefone.trim()) {
      window.alert("Preencha ao menos Nome, Guia de matrícula e Telefone.");
      return;
    }

    const mensagem = `Protótipo: motorista ${formData.nome} cadastrado com sucesso.`;

    window.alert(mensagem);
    router.push("/admin/motoristas");
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
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                    required
                  />
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
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-[#103173] font-bold">
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(event) => atualizarCampo("telefone", event.target.value)}
                    placeholder="(75) 99999-9999"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matricula" className="text-[#103173] font-bold">
                    Guia de Matrícula
                  </Label>
                  <Input
                    id="matricula"
                    value={formData.matricula}
                    onChange={(event) => atualizarCampo("matricula", event.target.value)}
                    placeholder="Ex: 2021001"
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                    required
                  />
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
                    className="h-11 border-[#73AABF]/30 focus:border-[#103173] focus:ring-[#103173]"
                    required
                  />
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
