"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { NavigationAdmin } from "@/components/landing/navigation_admin";
import { FooterSection } from "@/components/landing/footer-section";
import { FROTA_MOCK, type OnibusFrota } from "@/lib/mock/frota";

// Importações dos novos componentes extraídos
import { AdminHeader } from "@/components/admin/admin-header";
import { DevModeBar } from "@/components/shared/dev-mode-bar";
import { AdminMetrics } from "@/features/gerenciar-frota/ui/admin-metrics";
import { AdminFleetList, type FiltroStatus } from "@/features/gerenciar-frota/ui/admin-fleet-list";

export default function PaginaAdmin() {
  const router = useRouter();
  const [frota, setFrota] = useState<OnibusFrota[]>(() =>
    FROTA_MOCK.map((onibus) => ({ ...onibus, rotasVinculadas: [...onibus.rotasVinculadas] })),
  );
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todos");

  const frotaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return frota.filter((onibus) => {
      const correspondeStatus = filtroStatus === "todos" || onibus.status === filtroStatus;
      const correspondeBusca = termo.length === 0 || onibus.placa.toLowerCase().includes(termo);

      return correspondeStatus && correspondeBusca;
    });
  }, [frota, busca, filtroStatus]);

  const metricas = useMemo(() => {
    const onibusAtivos = frota.filter((item) => item.status === "ativo").length;
    const viagensHoje = frota
      .filter((item) => item.status === "ativo")
      .reduce((total, item) => total + item.viagensHoje, 0);

    return { onibusAtivos, viagensHoje };
  }, [frota]);

  const abrirTelaCadastro = (onibus?: OnibusFrota) => {
    if (!onibus) {
      router.push("/admin/onibus?modo=novo");
      return;
    }
    router.push(`/admin/onibus?id=${onibus.id}`);
  };

  const handleRemover = (onibus: OnibusFrota) => {
    if (onibus.status === "ativo" && onibus.viagensHoje > 0) {
      window.alert(
        `O ônibus ${onibus.placa} está com viagens em andamento/programadas hoje. Realoque as rotas antes de remover.`,
      );
      return;
    }

    const confirmado = window.confirm(`Remover o ônibus ${onibus.placa} do sistema?`);
    if (!confirmado) return;

    setFrota((atual) => atual.filter((item) => item.id !== onibus.id));
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans pb-24 text-slate-900">
      <Navigation tipoUsuario="admin"/>
      
      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        <AdminHeader onNovoOnibus={() => abrirTelaCadastro()} />

        <AdminMetrics 
          totalFrota={frota.length} 
          onibusAtivos={metricas.onibusAtivos}  
          viagensHoje={metricas.viagensHoje} 
        />

        <NavigationAdmin />

        <AdminFleetList 
          frota={frotaFiltrada}
          busca={busca}
          setBusca={setBusca}
          filtroStatus={filtroStatus}
          setFiltroStatus={setFiltroStatus}
          onEditar={abrirTelaCadastro}
          onRemover={handleRemover}
        />
      </main>

      <FooterSection />
      
      <DevModeBar />
    </div>
  );
}