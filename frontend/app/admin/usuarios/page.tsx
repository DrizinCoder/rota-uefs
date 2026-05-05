"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminUsuariosList } from "@/features/gerenciar-usuarios/ui/admin-usuarios-list";
import { adminService, Administrador } from "@/services/adminService";

export default function AdminUsuariosPage() {
  const router = useRouter();

  const [admins, setAdmins] = useState<Administrador[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [excluindo, setExcluindo] = useState<string | null>(null);

  useEffect(() => {
    carregarAdmins();
  }, []);

  async function carregarAdmins() {
    setLoading(true);
    setErro("");
    try {
      const data = await adminService.listarAdmins();
      setAdmins(data);
    } catch (e: any) {
      setErro("Não foi possível carregar os administradores. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleExcluir(admin: Administrador) {
    if (!confirm(`Tem certeza que deseja excluir "${admin.full_name}"?`)) return;
    setExcluindo(admin.admin_id);
    try {
      await adminService.excluirAdmin(admin.admin_id);
      setAdmins((prev) => prev.filter((a) => a.admin_id !== admin.admin_id));
    } catch (e: any) {
      alert("Erro ao excluir administrador. Tente novamente.");
    } finally {
      setExcluindo(null);
    }
  }

  const adminsFiltrados = admins.filter(
    (a) =>
      a.full_name.toLowerCase().includes(busca.toLowerCase()) ||
      a.registration_id.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 selection:bg-cyan-100 selection:text-cyan-900">
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar 
          title="Gestão de Administradores" 
          subtitle="Gerencie permissões e visualize quem possui acesso administrativo ao sistema." 
          buttonText="Novo Administrador" 
          onAction={() => router.push('/admin/usuarios/cadastro')} 
        />

        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
          <div className="max-w-4xl mx-auto pb-10">
            <AdminUsuariosList
              busca={busca}
              setBusca={setBusca}
              erro={erro}
              loading={loading}
              adminsFiltrados={adminsFiltrados}
              excluindo={excluindo}
              carregarAdmins={carregarAdmins}
              handleExcluir={handleExcluir}
            />
          </div>
        </div>
      </main>
    </div>
  );
}