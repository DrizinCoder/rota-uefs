"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  UserCircle,
  Trash2,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { AdminPageLayout } from "@/components/admin/admin-page-layout";
import { AdminBackLink } from "@/components/admin/admin-back-link";
import { AdminSubpageHeader } from "@/components/admin/admin-subpage-header";
import { AdminPrimaryActionLink } from "@/components/admin/admin-primary-action-link";
import { AdminSearchField } from "@/components/admin/admin-search-field";
import { AdminErrorBanner } from "@/components/admin/admin-error-banner";
import { AdminLoadingCenter } from "@/components/admin/admin-loading-center";
import { adminService, Administrador } from "@/services/adminService";

export default function AdminUsuariosPage() {
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
    } catch {
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
    } catch {
      alert("Erro ao excluir administrador. Tente novamente.");
    } finally {
      setExcluindo(null);
    }
  }

  const adminsFiltrados = admins.filter(
    (a) =>
      a.full_name.toLowerCase().includes(busca.toLowerCase()) ||
      a.registration_id.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <AdminPageLayout>
      <AdminBackLink />

      <AdminSubpageHeader
        title="Gestão de Administradores"
        description="Gerencie permissões e visualize quem possui acesso administrativo ao sistema."
        action={
          <AdminPrimaryActionLink href="/admin/usuarios/cadastro" icon={<Plus className="h-5 w-5" />}>
            Novo Administrador
          </AdminPrimaryActionLink>
        }
      />

      <AdminSearchField
        value={busca}
        onChange={setBusca}
        placeholder="Buscar por nome ou matrícula..."
      />

      {erro ? <AdminErrorBanner message={erro} onRetry={carregarAdmins} /> : null}

      {loading ? (
        <AdminLoadingCenter message="Carregando administradores..." />
      ) : (
        <div className="grid gap-4">
          {adminsFiltrados.length > 0 ? (
            adminsFiltrados.map((admin) => (
              <div
                key={admin.admin_id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#103173]/5 flex items-center justify-center shrink-0">
                    <UserCircle className="h-6 w-6 text-[#103173]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#103173]">{admin.full_name}</p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 font-medium mt-0.5">
                      <span className="inline-flex items-center gap-1 font-bold text-[#103173]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {admin.access_level === "Master" ? "Master" : "Operador"}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>Matrícula: {admin.registration_id}</span>
                      {admin.email ? (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span>{admin.email}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                  <button
                    type="button"
                    onClick={() => handleExcluir(admin)}
                    disabled={excluindo === admin.admin_id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {excluindo === admin.admin_id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Excluir
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-slate-500 font-medium">
              {busca
                ? `Nenhum administrador encontrado para "${busca}".`
                : "Nenhum administrador cadastrado."}
            </div>
          )}
        </div>
      )}
    </AdminPageLayout>
  );
}
