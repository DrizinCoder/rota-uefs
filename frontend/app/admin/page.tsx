"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavigationAdmin } from "@/components/landing/navigation_admin";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminPageLayout } from "@/components/admin/admin-page-layout";
import { AdminMetrics } from "@/features/gerenciar-frota/ui/admin-metrics";
import { AdminFleetList, type FiltroStatus } from "@/features/gerenciar-frota/ui/admin-fleet-list";
import { adminService, type HomeAdmin, type BusHomeAdmin } from "@/services/adminService";

export default function PaginaAdmin() {
  const router = useRouter();
  const [homeData, setHomeData] = useState<HomeAdmin | null>(null);

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todos");

  useEffect(() => {
    async function carregarDados() {
      try {
        const data = await adminService.getHomeAdmin();
        setHomeData(data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
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

  const handleRemover = async (onibus: BusHomeAdmin) => {
    if (onibus.status === "Active" && onibus.trips_today > 0) {
      window.alert(
        `O ônibus ${onibus.plate} está com viagens em andamento/programadas hoje. Realoque as rotas antes de remover.`,
      );
      return;
    }

    const confirmado = window.confirm(`Remover o ônibus ${onibus.plate} do sistema?`);
    if (!confirmado) return;

    try {
      await adminService.deleteOnibus(onibus.plate);
      setHomeData((atual) => {
        if (!atual) return atual;
        return {
          ...atual,
          summary: {
            ...atual.summary,
            total_buses: atual.summary.total_buses - 1,
            active_buses:
              onibus.status === "Active"
                ? atual.summary.active_buses - 1
                : atual.summary.active_buses,
          },
          buses: atual.buses.filter((item) => item.plate !== onibus.plate),
        };
      });
    } catch (err) {
      window.alert(`Erro ao remover o ônibus ${onibus.plate}. Tente novamente.`);
    }
  };

  return (
    <AdminPageLayout variant="dashboard" showDevBar>
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
    </AdminPageLayout>
  );
}
