"use client";

import { useState } from "react";
import { AdminPageLayout } from "@/components/admin/admin-page-layout";
import { AdminBackLink } from "@/components/admin/admin-back-link";
import { AdminSubpageHeader } from "@/components/admin/admin-subpage-header";
import {
  AdminRelatoriosGestaoPanel,
  AdminRelatoriosSeguroPanel,
} from "@/components/admin/admin-relatorios-panels";

const mainWideClass =
  "flex-1 max-w-lg md:max-w-4xl lg:max-w-5xl mx-auto w-full px-4 pt-10 pb-32";

export default function AdminRelatoriosPage() {
  const [abaAtiva, setAbaAtiva] = useState<"gestao" | "seguro">("gestao");
  const [mesSelecionado, setMesSelecionado] = useState("2026-04");

  const handleDownloadGestao = (formato: string) => {
    console.log(`Gerando Relatório de Gestão em ${formato} para ${mesSelecionado}`);
    alert(`Iniciando download do relatório de gestão em ${formato.toUpperCase()}...`);
  };

  const handleDownloadSeguro = (idViagem: string) => {
    console.log(`Baixando apólice/lista nominal da viagem ${idViagem}`);
    alert(`Gerando PDF com lista nominal para seguro da viagem ${idViagem}...`);
  };

  return (
    <AdminPageLayout mainClassName={mainWideClass}>
      <AdminBackLink />

      <AdminSubpageHeader
        title="Central de Relatórios"
        description="Acesse métricas de faturamento e emita listas para auditoria de seguro."
      />

      <div className="flex gap-6 mb-8 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setAbaAtiva("gestao")}
          className={`pb-4 font-extrabold text-sm border-b-2 transition-all ${
            abaAtiva === "gestao"
              ? "border-[#103173] text-[#103173]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Gestão Logística e Faturamento
        </button>
        <button
          type="button"
          onClick={() => setAbaAtiva("seguro")}
          className={`pb-4 font-extrabold text-sm border-b-2 transition-all ${
            abaAtiva === "seguro"
              ? "border-[#103173] text-[#103173]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Auditoria de Seguro (Lista Nominal)
        </button>
      </div>

      {abaAtiva === "gestao" ? (
        <AdminRelatoriosGestaoPanel
          mesSelecionado={mesSelecionado}
          onMesChange={setMesSelecionado}
          onDownloadGestao={handleDownloadGestao}
        />
      ) : (
        <AdminRelatoriosSeguroPanel onDownloadSeguro={handleDownloadSeguro} />
      )}
    </AdminPageLayout>
  );
}
