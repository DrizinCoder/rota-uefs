"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronRight, UserCircle } from "lucide-react";
import { AdminPageLayout } from "@/components/admin/admin-page-layout";
import { AdminBackLink } from "@/components/admin/admin-back-link";
import { AdminSubpageHeader } from "@/components/admin/admin-subpage-header";
import { AdminPrimaryActionLink } from "@/components/admin/admin-primary-action-link";
import { AdminSearchField } from "@/components/admin/admin-search-field";
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

  const motoristasFiltrados = motoristas.filter(
    (m) =>
      m.full_name.toLowerCase().includes(busca.toLowerCase()) ||
      m.registration_id.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <AdminPageLayout>
      <AdminBackLink />

      <AdminSubpageHeader
        title="Gestão de Motoristas"
        description="Gerencie cadastros, status e históricos dos motoristas da frota."
        action={
          <AdminPrimaryActionLink href="/admin/motoristas/cadastro" icon={<Plus className="h-5 w-5" />}>
            Novo Motorista
          </AdminPrimaryActionLink>
        }
      />

      <AdminSearchField
        value={busca}
        onChange={setBusca}
        placeholder="Buscar por nome ou matrícula..."
      />

      <div className="grid gap-4">
        {loading && (
          <p className="text-center text-slate-400 text-sm py-10">Carregando motoristas...</p>
        )}

        {!loading && motoristasFiltrados.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-10">Nenhum motorista encontrado.</p>
        )}

        {motoristasFiltrados.map((motorista) => (
          <div
            key={motorista.user_id}
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow group cursor-pointer"
            onClick={() => router.push(`/admin/motoristas/${motorista.user_id}`)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#103173]/5 flex items-center justify-center shrink-0">
                <UserCircle className="h-6 w-6 text-[#103173]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-lg font-bold text-[#103173]">{motorista.full_name}</p>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${
                      motorista.registration_status === "ACTIVE"
                        ? "bg-[#23B99A]/10 text-[#23B99A]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {motorista.registration_status === "ACTIVE" ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                  <span>Matrícula: {motorista.registration_id}</span>
                  <span>·</span>
                  <span>{motorista.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Editar
              </span>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#103173] group-hover:text-white transition-colors ml-auto md:ml-0">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminPageLayout>
  );
}
