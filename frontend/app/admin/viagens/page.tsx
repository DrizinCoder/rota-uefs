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
        
        // Mapeia os dados pra injetar o mock de reservas e check-ins
        const viagensMapeadas = data.map((viagem) => ({
          ...viagem, // Puxa tudo que veio do banco (id, rota, onibus, etc)
          status: tradutorStatus[viagem.status] || viagem.status,
          // 👇 Injeta os dados mockados temporários
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

    return viagens.filter((viagem) => {
      return (
        viagem.bus_license_plate.toLowerCase().includes(termo) ||
        viagem.driver_name.toLowerCase().includes(termo) ||
        viagem.route_name.toLowerCase().includes(termo) ||
        viagem.trip_id.toLowerCase().includes(termo)
      );
    });
  }, [viagens, busca]);

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
              onEditar={handleEditar}
              onRemover={handleExcluir}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
