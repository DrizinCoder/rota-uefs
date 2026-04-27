"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { NavigationAdmin } from "@/components/landing/navigation_admin";
import { FooterSection } from "@/components/landing/footer-section";

// Importações dos novos componentes extraídos
import { AdminHeader } from "@/components/admin/admin-header";
import { DevModeBar } from "@/components/shared/dev-mode-bar";
import { AdminMetrics } from "@/features/gerenciar-frota/ui/admin-metrics";
import { AdminFleetList, type FiltroStatus } from "@/features/gerenciar-frota/ui/admin-fleet-list";
import { adminService, type HomeAdmin, type BusHomeAdmin } from "@/services/adminService";

export default function PaginaAdmin() {
  const router = useRouter();
  const [homeData, setHomeData] = useState<HomeAdmin | null>(null);
  const [loading, setLoading] = useState(false);

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todos");
  
  useEffect(() => {
  async function carregarDados() {
    try {
      setLoading(true);
      const data = await adminService.getHomeAdmin();
      setHomeData(data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }
  carregarDados();
}, []);

  const metricas = {
    onibusAtivos: homeData?.summary.active_buses ?? 0,
    viagensHoje: homeData?.summary.total_trips_today ?? 0,
    totalFrota: homeData?.summary.total_buses ?? 0,
  };

  const frotaFiltrada = useMemo(() => {
  const buses = homeData?.buses ?? [];
  const termo = busca.trim().toLowerCase();

  return buses.filter((onibus) => {
    const correspondeStatus = filtroStatus === "todos" || onibus.status === filtroStatus;
    const correspondeBusca = termo.length === 0 || onibus.plate.toLowerCase().includes(termo);

    return correspondeStatus && correspondeBusca;
  });
}, [homeData, busca, filtroStatus]);

  const abrirTelaCadastro = (onibus?: BusHomeAdmin) => {
    if (!onibus) {
      router.push("/admin/onibus?modo=novo");
      return;
    }
    router.push(`/admin/onibus?id=${onibus.plate}`);
  };

  const handleRemover = (onibus: BusHomeAdmin) => {
    if (onibus.status === "Active" && onibus.trips_today > 0) {
      window.alert(
        `O ônibus ${onibus.placa} está com viagens em andamento/programadas hoje. Realoque as rotas antes de remover.`,
      );
      return;
    }

    const confirmado = window.confirm(`Remover o ônibus ${onibus.placa} do sistema?`);
    if (!confirmado) return;

    setFrota((atual) => atual.filter((item) => item.id !== onibus.id));
  };

  if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-slate-500 text-sm">Carregando dados...</p>
    </div>
  );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans pb-24 text-slate-900">
      <Navigation tipoUsuario="admin"/>
      
      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        <AdminHeader onNovoOnibus={() => abrirTelaCadastro()} />

        <AdminMetrics 
          totalFrota={metricas.totalFrota} 
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