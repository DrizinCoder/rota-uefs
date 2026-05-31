"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface MotoristaFormState {
  nome: string;
  matricula: string;
  telefone: string;
  email: string;
  senha?: string;
}

interface AdminMotoristasFormProps {
  formData: MotoristaFormState;
  erros: any;
  atualizarCampo: <K extends keyof MotoristaFormState>(campo: K, valor: MotoristaFormState[K]) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isEditMode?: boolean;
}

export function AdminMotoristasForm({
  formData,
  erros,
  atualizarCampo,
  onSubmit,
  isEditMode
}: AdminMotoristasFormProps) {
  const router = useRouter();

  return (
    <form className="gap-6" onSubmit={onSubmit}>
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
                value={formData.senha || ""}
                onChange={(event) => atualizarCampo("senha", event.target.value)}
                placeholder={isEditMode ? "Deixe em branco para não alterar" : "Sua senha secreta"}
                className={`h-11 focus:border-[#103173] focus:ring-[#103173] ${
                  erros.senha ? "border-red-300 bg-red-50" : "border-[#73AABF]/30"
                }`}
                required={!isEditMode}
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
              {isEditMode ? "SALVAR ALTERAÇÕES" : "CADASTRAR MOTORISTA"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}
