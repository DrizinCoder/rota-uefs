"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminMotoristasList } from "@/features/gerenciar-motoristas/ui/admin-motoristas-list";
import { adminService, type Motorista } from "@/services/adminService";

export default function AdminMotoristasPage() {
  const router = useRouter();
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const fetchMotoristas = async () => {
      try {
        const data = await adminService.listarMotoristas();
        setMotoristas(data);
      } catch (error) {
        console.error("Erro ao listar motoristas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMotoristas();
  }, []);

  const handleEditar = (id: string) => {
    router.push(`/admin/motoristas/cadastro?id=${id}`);
  };

  const handleExcluir = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este motorista?")) return;
    try {
      await adminService.excluirMotorista(id);
      setMotoristas((atual) => atual.filter((m) => m.user_id !== id));
      window.alert("Motorista excluído com sucesso.");
    } catch (e: any) {
      window.alert("Erro ao remover o motorista. Tente novamente.");
    }
  };

  const motoristasFiltrados = motoristas.filter((m) =>
    m.full_name.toLowerCase().includes(busca.toLowerCase()) ||
    m.registration_id.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 selection:bg-cyan-100 selection:text-cyan-900">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar 
          title="Gestão de Motoristas" 
          subtitle="Gerencie cadastros, atualizações e status dos motoristas." 
          buttonText="Novo Motorista" 
          onAction={() => router.push('/admin/motoristas/cadastro')} 
        />

        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
          <div className="max-w-4xl mx-auto space-y-6 pb-32">
            <AdminMotoristasList 
              motoristasFiltrados={motoristasFiltrados}
              busca={busca}
              setBusca={setBusca}
              loading={loading}
              onEditar={handleEditar}
              onRemover={handleExcluir}
            />
          </div>
        </div>
      </main>
    </div>
  );
}