"use client";

import { Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface OnibusFormState {
  bus_plate: string;
  capacity: string;
  bus_status: string;
}

interface AdminFleetFormProps {
  formData: OnibusFormState;
  erros: any;
  emEdicao: boolean;
  atualizarCampo: <K extends keyof OnibusFormState>(campo: K, valor: OnibusFormState[K]) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function AdminFleetForm({
  formData,
  erros,
  emEdicao,
  atualizarCampo,
  onSubmit
}: AdminFleetFormProps) {
  const router = useRouter();

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Card className="border-none shadow-lg bg-white">
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="text-[#103173] font-black text-xl">Dados do Veículo</CardTitle>
        </CardHeader>
        {erros.geral && (
          <div className="mx-6 mt-6 bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl border border-red-100">
            {erros.geral}
          </div>
        )}
        <CardContent className="p-6 grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="placa" className="text-[#103173] font-bold">
              Placa
            </Label>
            <Input
              id="placa"
              value={formData.bus_plate}
              disabled={emEdicao}
              onChange={(event) =>
                atualizarCampo("bus_plate", event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 8))
              }
              placeholder={emEdicao ? "" : "ABC-1234"}
              className={`h-11 focus:border-[#103173] focus:ring-[#103173] font-bold ${
                erros.bus_plate ? "border-red-300 bg-red-50" : "border-[#73AABF]/30"
              } ${emEdicao ? "bg-slate-50 cursor-not-allowed" : ""}`}
              required
            />
            {erros.bus_plate && <p className="text-xs text-red-500 font-medium">{erros.bus_plate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacidade" className="text-[#103173] font-bold">
              Capacidade
            </Label>
            <Input
              id="capacidade"
              type="number"
              min={10}
              max={80}
              value={formData.capacity}
              onChange={(event) => atualizarCampo("capacity", event.target.value)}
              className={`h-11 focus:border-[#103173] focus:ring-[#103173] ${
                erros.capacity ? "border-red-300 bg-red-50" : "border-[#73AABF]/30"
              }`}
            />
            {erros.capacity && <p className="text-xs text-red-500 font-medium">{erros.capacity}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-[#103173] font-bold">
              Status Operacional
            </Label>
            <select
              id="status"
              value={formData.bus_status}
              onChange={(event) => atualizarCampo("bus_status", event.target.value as string)}
              className="h-11 w-full rounded-md border border-[#73AABF]/30 bg-white px-3 text-sm text-[#103173] font-bold focus:outline-none focus:ring-2 focus:ring-[#103173]/40"
            >
              <option value="Active">Ativo</option>
              <option value="Inactive">Inativo</option>
              <option value="Maintenance">Manutenção</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          className="flex-1 h-12 bg-[#23B99A] hover:bg-[#1d957c] text-white font-black shadow-lg shadow-[#23B99A]/20"
        >
          {emEdicao ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              SALVAR ALTERAÇÕES
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              CADASTRAR ÔNIBUS
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 h-12 border-2 border-[#103173] text-[#103173] font-black hover:bg-[#103173] hover:text-white"
          onClick={() => router.push("/admin")}
        >
          CANCELAR
        </Button>
      </div>
    </form>
  );
}
