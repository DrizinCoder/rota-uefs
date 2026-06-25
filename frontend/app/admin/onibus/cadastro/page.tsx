"use client";

import { useEffect, useMemo, useState, type FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminFleetForm, type OnibusFormState } from "@/features/gerenciar-frota/ui/admin-fleet-form";
import { adminService, type CadastroOnibusPayload } from "@/services/adminService";

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
      router.push("/admin/onibus");
    } catch (err) {
      setErros((atual) => ({ ...atual, geral: "Erro ao salvar ônibus. Tente novamente." }));
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 selection:bg-cyan-100 selection:text-cyan-900">
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar 
          title={emEdicao ? "Edição de Ônibus" : "Cadastro de Ônibus"} 
          subtitle="Formulário administrativo simplificado para identificação da frota." 
          buttonText="Voltar"
          buttonIcon={ArrowLeft}
          buttonVariant="outline"
          onAction={() => router.back()}
        />

        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
          <div className="max-w-4xl mx-auto space-y-4 pb-10">
            <div className="flex justify-end">
              <Badge className={statusBadge.className}>
                {emEdicao ? "MODO EDIÇÃO" : "MODO CADASTRO"}
              </Badge>
            </div>
            
            <AdminFleetForm 
              formData={formData}
              erros={erros}
              emEdicao={emEdicao}
              atualizarCampo={atualizarCampo}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </main>
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