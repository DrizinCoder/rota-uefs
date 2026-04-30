"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Bus, Plus } from "lucide-react";
import { AdminPageLayout } from "@/components/admin/admin-page-layout";
import { AdminBackLink } from "@/components/admin/admin-back-link";
import { AdminSubpageHeader } from "@/components/admin/admin-subpage-header";
import { AdminPrimaryActionLink } from "@/components/admin/admin-primary-action-link";
import { AdminSearchField } from "@/components/admin/admin-search-field";
import {
  AdminViagemCard,
  type AdminViagemCardModel,
} from "@/components/admin/admin-viagem-card";
import { adminService, type ViagemAdmin } from "@/services/adminService";

const tradutorStatus: Record<string, string> = {
  Pending: "Pendente",
  Confirmed: "Confirmada",
  Cancelled: "Cancelada",
  Completed: "Concluída",
};

const mainWideClass =
  "flex-1 max-w-lg md:max-w-4xl lg:max-w-5xl mx-auto w-full px-4 pt-10 pb-32";

export default function AdminViagensPage() {
  const router = useRouter();
  const [viagens, setViagens] = useState<AdminViagemCardModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  const handleExcluir = (id: string) => {
    const confirmado = window.confirm("Tem certeza que deseja excluir esta viagem?");
    if (!confirmado) return;
    setViagens((atual) => atual.filter((v) => v.trip_id !== id));
  };

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const data = await adminService.listarViagens();

        const viagensMapeadas: AdminViagemCardModel[] = data.map((viagem: ViagemAdmin) => ({
          ...viagem,
          status: tradutorStatus[viagem.status] || viagem.status,
          reservasAlunos: Math.floor(Math.random() * 30) + 10,
          reservasProfessores: Math.floor(Math.random() * 3),
          checkIns: Math.floor(Math.random() * 20),
        }));

        setViagens(viagensMapeadas);
      } catch (err) {
        console.error("Erro ao carregar viagens:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const viagensFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (termo.length === 0) return viagens;

    return viagens.filter(
      (viagem) =>
        viagem.bus_license_plate.toLowerCase().includes(termo) ||
        viagem.driver_name.toLowerCase().includes(termo) ||
        viagem.route_name.toLowerCase().includes(termo) ||
        viagem.trip_id.toLowerCase().includes(termo),
    );
  }, [viagens, busca]);

  return (
    <AdminPageLayout mainClassName={mainWideClass}>
      <AdminBackLink />

      <AdminSubpageHeader
        title="Gestão de Viagens"
        description="Visualize escalas, controle quórum e acompanhe embarques em tempo real."
        action={
          <AdminPrimaryActionLink href="/admin/viagens/cadastro" icon={<Plus className="h-5 w-5" />}>
            Nova Viagem
          </AdminPrimaryActionLink>
        }
      />

      <AdminSearchField
        value={busca}
        onChange={setBusca}
        placeholder="Buscar por rota, motorista ou ID da viagem..."
        marginBottom="mb-8"
      />

      {loading ? (
        <p className="text-center text-slate-400 text-sm py-10">Carregando viagens...</p>
      ) : null}

      <div className="grid gap-8">
        {!loading && viagensFiltradas.length > 0 ? (
          viagensFiltradas.map((viagem) => (
            <AdminViagemCard
              key={viagem.trip_id}
              viagem={viagem}
              onEditar={(tripId) => router.push(`/admin/viagens/cadastro?id=${tripId}`)}
              onExcluir={handleExcluir}
            />
          ))
        ) : null}

        {!loading && viagensFiltradas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
            <Bus className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p className="text-[#103173] font-bold text-lg">
              {busca.trim() ? "Nenhuma viagem encontrada para a busca." : "Nenhuma viagem cadastrada"}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              {busca.trim()
                ? "Tente outro termo ou limpe o campo de busca."
                : "Não há registros de viagens para exibir no momento."}
            </p>
          </div>
        ) : null}
      </div>
    </AdminPageLayout>
  );
}
