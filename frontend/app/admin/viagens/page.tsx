"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminViagensList, type ViagemTela } from "@/features/gerenciar-viagens/ui/admin-viagens-list";
import { adminService } from "@/services/adminService";

const tradutorStatus: Record<string, string> = {
  "Pending": "Pendente",
  "Confirmed": "Confirmada",
  "Cancelled": "Cancelada",
  "Completed": "Concluída"
};

export default function AdminViagensPage() {
  const router = useRouter();
  const [viagens, setViagens] = useState<ViagemTela[]>([]);
  
  const [loading, setLoading] = useState(true);

  const [busca, setBusca] = useState("");
  const [activeTab, setActiveTab] = useState<"semana" | "futuras" | "passadas">("semana");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");

  const handleExcluir = (id: string) => {
    const confirmado = window.confirm("Tem certeza que deseja excluir esta viagem?");
    if (!confirmado) return;

    try {
      // Futuro: await adminService.deleteViagem(id);
      setViagens((atual) => atual.filter((v) => v.trip_id !== id));
    } catch (err) {
      window.alert("Erro ao remover a viagem. Tente novamente.");
    }
  };

  const handleEditar = (id: string) => {
    router.push(`/admin/viagens/cadastro?id=${id}`);
  };

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const data = await adminService.listarViagens();
        
        // Mapeia os dados pra ajustar o status
        const viagensMapeadas = data.map((viagem) => ({
          ...viagem, // Puxa tudo que veio do banco (id, rota, onibus, etc)
          status: tradutorStatus[viagem.status] || viagem.status,
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
    let filtradas = [...viagens];

    const agora = new Date();
    const seteDiasDepois = new Date();
    seteDiasDepois.setDate(agora.getDate() + 7);
    seteDiasDepois.setHours(23, 59, 59, 999);
    
    // 1. Filtro de Abas (Futuras vs Passadas)
    filtradas = filtradas.filter((viagem) => {
      const tripDate = new Date(`${viagem.trip_date}T${viagem.departure_time}`);
      if (activeTab === "semana") {
        return tripDate >= agora && tripDate <= seteDiasDepois;
      } else if (activeTab === "futuras") {
        return tripDate >= agora;
      } else {
        return tripDate < agora;
      }
    });

    // 2. Ordenação (Mais recentes/próximas primeiro)
    filtradas.sort((a, b) => {
      const dateA = new Date(`${a.trip_date}T${a.departure_time}`).getTime();
      const dateB = new Date(`${b.trip_date}T${b.departure_time}`).getTime();
      if (activeTab === "semana" || activeTab === "futuras") {
        return dateA - dateB; // Ascendente para o futuro
      } else {
        return dateB - dateA; // Descendente para o passado
      }
    });

    // 3. Filtro de Status
    if (statusFilter !== "Todos") {
      filtradas = filtradas.filter(v => v.status === statusFilter);
    }

    // 4. Busca em Texto
    const termo = busca.trim().toLowerCase();
    if (termo.length > 0) {
      filtradas = filtradas.filter((viagem) => {
        return (
          viagem.bus_license_plate.toLowerCase().includes(termo) ||
          viagem.driver_name.toLowerCase().includes(termo) ||
          viagem.route_name.toLowerCase().includes(termo) ||
          viagem.trip_id.toLowerCase().includes(termo)
        );
      });
    }

    return filtradas;
  }, [viagens, busca, activeTab, statusFilter]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 selection:bg-cyan-100 selection:text-cyan-900">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar 
          title="Gestão de Viagens" 
          subtitle="Visualize escalas, controle quórum e acompanhe embarques em tempo real." 
          buttonText="Nova Viagem" 
          onAction={() => router.push('/admin/viagens/cadastro')} 
        />

        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
          <div className="max-w-lg md:max-w-4xl lg:max-w-5xl mx-auto w-full space-y-6 pb-32">
            <AdminViagensList 
              viagens={viagensFiltradas}
              busca={busca}
              setBusca={setBusca}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onEditar={handleEditar}
              onRemover={handleExcluir}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
