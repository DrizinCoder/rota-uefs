"use client";

import { useEffect, useMemo, useState, type FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Bus,
  Plus,
  Save,
  ShieldAlert,
  UserCircle,
} from "lucide-react";
import { adminService, type CadastroOnibusPayload } from "@/services/adminService";

interface OnibusFormState {
  bus_plate: string;
  capacity: string;
  bus_status: string;
}

function montarEstadoInicial(): OnibusFormState {
  return {
    bus_plate: "",
    capacity: "46",
    bus_status: "Active",
  };
}

function getStatusBadge(status: string) {
  if (status === "Active") {
    return {
      label: "ATIVO",
      className: "bg-[#23B99A] text-white font-bold",
    };
  }

  if (status === "Maintenance") {
    return {
      label: "MANUTENÇÃO",
      className: "bg-amber-400 text-white font-bold",
    };
  }

  return {
    label: "INATIVO",
    className: "bg-slate-400 text-white font-bold",
  };
}

// Componente que contém a lógica do formulário e utiliza useSearchParams
function CadastroEdicaoOnibusForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modoNovo = searchParams.get("modo") === "novo";
  const id = searchParams.get("id"); // agora é a bus_plate

  const emEdicao = Boolean(id) && !modoNovo;

  const [formData, setFormData] = useState<OnibusFormState>(() => montarEstadoInicial());
  const [erros, setErros] = useState({ bus_plate: "", capacity: "", geral: "" });

  useEffect(() => {
  if (emEdicao && id) {
    adminService.buscarOnibus(id)
      .then((onibus) => {
        setFormData({
          bus_plate: onibus.bus_plate ?? "",
          capacity: String(onibus.capacity ?? 46),
          bus_status: onibus.bus_status ?? "Active",
        });
      })
      .catch(() => {
        setErros((e) => ({ ...e, geral: "Erro ao carregar dados do ônibus." }));
      });
  } else {
    setFormData(montarEstadoInicial());
    setErros({ bus_plate: "", capacity: "", geral: "" });
  }
}, [emEdicao, id]);

  const statusBadge = getStatusBadge(formData.bus_status);

  const atualizarCampo = <K extends keyof OnibusFormState>(campo: K, valor: OnibusFormState[K]) => {
    setFormData((atual) => ({
      ...atual,
      [campo]: valor,
    }));
    if (campo === "bus_plate" || campo === "capacity") {
      setErros((atual) => ({ ...atual, [campo]: "", geral: "" }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErros({ bus_plate: "", capacity: "", geral: "" });
    const placa = formData.bus_plate.trim().toUpperCase();
    const capacidade = Number.parseInt(formData.capacity, 10);
    const regexPlacaAntiga = /^[A-Z]{3}-\d{4}$/;
    const regexPlacaMercosul = /^[A-Z]{3}\d[A-Z]\d{2}$/;
    const novosErros = { bus_plate: "", capacity: "", geral: "" };
    let temErro = false;

    if (!placa) {
      novosErros.bus_plate = "Preencha a placa do veículo.";
      temErro = true;
    }

    if (placa && !regexPlacaAntiga.test(placa) && !regexPlacaMercosul.test(placa)) {
      novosErros.bus_plate = "Placa inválida. Use o formato ABC-1234 ou ABC1D23.";
      temErro = true;
    }

    if (Number.isNaN(capacidade) || capacidade < 10 || capacidade > 80) {
      novosErros.capacity = "Capacidade inválida. Informe um valor entre 10 e 80.";
      temErro = true;
    }

    if (temErro) {
      novosErros.geral = "Corrija os campos destacados para continuar.";
      setErros(novosErros);
      return;
    }

    try {
      if (emEdicao && id) {
        await adminService.atualizarOnibus(id, {
          capacity: capacidade,
          bus_status: formData.bus_status,
        });
      } else {
        await adminService.cadastrarOnibus({
          bus_plate: placa,
          capacity: capacidade,
          bus_status: formData.bus_status,
        });
      }
      router.push("/admin");
    } catch (err) {
      setErros((atual) => ({ ...atual, geral: "Erro ao salvar ônibus. Tente novamente." }));
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] pb-24">
      <Navigation tipoUsuario="admin"/>

      <main className="flex-1 w-full max-w-3xl mx-auto py-10 px-4 space-y-6">
        <Button
          variant="ghost"
          className="w-fit text-[#103173] font-black hover:bg-[#103173]/10"
          onClick={() => router.push("/admin")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          VOLTAR PARA ADMIN
        </Button>

        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-[#103173] flex items-center gap-3 tracking-tight">
              <div className="bg-[#103173] p-2 rounded-xl shadow-lg shadow-[#103173]/20">
                <Bus className="h-7 w-7 text-[#F2D022]" />
              </div>
              {emEdicao ? "Edição de Ônibus" : "Cadastro de Ônibus"}
            </h1>
            <p className="text-[#73AABF] font-bold text-sm md:text-base">
              Formulário administrativo simplificado para identificação da frota.
            </p>
          </div>

          <Badge className={statusBadge.className}>
            {emEdicao ? "MODO EDIÇÃO" : "MODO CADASTRO"}
          </Badge>
        </header>

        {/* {referenciaInvalida ? (
          <Card className="border-none shadow-md bg-amber-50 border border-amber-100">
            <CardContent className="p-4">
              <p className="text-sm font-bold text-amber-800">
                Ônibus não encontrado para edição. O formulário foi aberto no modo cadastro.
              </p>
            </CardContent>
          </Card>
        ) : null} */}

        <form className="space-y-6" onSubmit={handleSubmit}>
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
              {/* <div className="space-y-2">
                <Label className="text-[#103173] font-bold">Código Interno</Label>
                <Input value={formData.bus_plate} disabled className="h-11 bg-slate-50 border-slate-200 font-bold" />
              </div> */}
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
      </main>


      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#103173] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 z-50 border-2 border-[#F2D022]/30 backdrop-blur-md">
        <div className="flex flex-col border-r border-white/20 pr-4">
          <span className="text-[9px] font-black uppercase text-[#F2D022] tracking-tighter">Modo de Teste</span>
          <span className="text-xs font-bold">Alternar Perfil</span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-white/10 text-white gap-2 font-bold"
            onClick={() => router.push("/passageiro")}
          >
            <UserCircle className="h-4 w-4" /> Passageiro
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-[#F2D022] hover:text-[#103173] text-white gap-2 font-bold transition-colors"
            onClick={() => router.push("/motorista")}
          >
            <Bus className="h-4 w-4" /> Motorista
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="bg-red-500 text-white gap-2 font-bold transition-colors shadow-lg shadow-red-500/20"
            onClick={() => router.push("/admin")}
          >
            <ShieldAlert className="h-4 w-4" /> Admin
          </Button>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}

// Export default envolto em Suspense para corrigir o erro de pré-renderização
export default function CadastroEdicaoOnibusPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#E4F2F1] text-[#103173] font-bold">A carregar formulário...</div>}>
      <CadastroEdicaoOnibusForm />
    </Suspense>
  );
}