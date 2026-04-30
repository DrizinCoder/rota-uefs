"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { api } from "@/services/api";
import { AdminPageLayout } from "@/components/admin/admin-page-layout";
import { AdminBackLink } from "@/components/admin/admin-back-link";
import { AdminSubpageHeader } from "@/components/admin/admin-subpage-header";
import { AdminSearchField } from "@/components/admin/admin-search-field";
import { AdminErrorBanner } from "@/components/admin/admin-error-banner";
import { AdminLoadingCenter } from "@/components/admin/admin-loading-center";

interface Servidor {
  user_id: string;
  full_name: string;
  registration_id: string;
  email: string | null;
  phone: string;
  department: string;
  employment_type: string;
  registration_status: string;
}

const mainWideClass =
  "flex-1 max-w-lg md:max-w-4xl lg:max-w-5xl mx-auto w-full px-4 pt-10 pb-32";

export default function AdminValidarProfessorPage() {
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [processando, setProcessando] = useState<string | null>(null);

  useEffect(() => {
    carregarServidores();
  }, []);

  async function carregarServidores() {
    setLoading(true);
    setErro("");
    try {
      const response = await api.get("/users/staff/");
      setServidores(response.data.data ?? []);
    } catch {
      setErro("Não foi possível carregar as solicitações. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAprovar(servidor: Servidor) {
    if (!confirm(`Aprovar o cadastro de "${servidor.full_name}"?`)) return;
    setProcessando(servidor.user_id);
    try {
      await api.patch(`/users/staff/accept/${servidor.user_id}`);
      setServidores((prev) => prev.filter((s) => s.user_id !== servidor.user_id));
    } catch {
      alert("Erro ao aprovar. Tente novamente.");
    } finally {
      setProcessando(null);
    }
  }

  async function handleRejeitar(servidor: Servidor) {
    if (!confirm(`Rejeitar e remover o cadastro de "${servidor.full_name}"?`)) return;
    setProcessando(servidor.user_id);
    try {
      await api.patch(`/users/staff/reject/${servidor.user_id}`);
      setServidores((prev) => prev.filter((s) => s.user_id !== servidor.user_id));
    } catch {
      alert("Erro ao rejeitar. Tente novamente.");
    } finally {
      setProcessando(null);
    }
  }

  const sanitizarBusca = (valor: string) =>
    valor.normalize("NFKC").replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s{2,}/g, " ");

  const filtrados = servidores.filter(
    (s) =>
      s.full_name.toLowerCase().includes(busca.trim().toLowerCase()) ||
      s.registration_id.toLowerCase().includes(busca.trim().toLowerCase()),
  );

  return (
    <AdminPageLayout mainClassName={mainWideClass}>
      <AdminBackLink />

      <AdminSubpageHeader
        title="Validar Acesso de Professor"
        description="Aprove ou rejeite solicitações de cadastro enviadas por novos professores (Servidores)."
      />

      <AdminSearchField
        value={busca}
        onChange={(v) => setBusca(sanitizarBusca(v))}
        placeholder="Buscar por nome ou matrícula..."
      />

      {erro ? <AdminErrorBanner message={erro} onRetry={carregarServidores} /> : null}

      {loading ? (
        <AdminLoadingCenter message="Carregando solicitações..." />
      ) : (
        <div className="grid gap-4">
          {filtrados.length > 0 ? (
            filtrados.map((servidor) => {
              const emProcessamento = processando === servidor.user_id;
              return (
                <div
                  key={servidor.user_id}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0 border border-orange-200">
                      <Users className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#103173] text-lg leading-tight mb-1">
                        {servidor.full_name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-500">
                        <span className="font-bold text-[#103173]">
                          Matrícula: {servidor.registration_id}
                        </span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span>{servidor.department}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span>{servidor.employment_type}</span>
                        {servidor.email ? (
                          <>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span>{servidor.email}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAprovar(servidor)}
                      disabled={emProcessamento}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#23B99A] hover:bg-[#1fa889] text-white px-4 py-2.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {emProcessamento ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      Aprovar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejeitar(servidor)}
                      disabled={emProcessamento}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {emProcessamento ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      Rejeitar
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <ShieldAlert className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <p className="text-[#103173] font-bold text-lg">Nenhuma solicitação pendente</p>
              <p className="text-slate-500 text-sm mt-1">
                {busca
                  ? `Nenhum resultado para "${busca}".`
                  : "Todas as contas de professores já foram validadas ou não existem novos cadastros."}
              </p>
            </div>
          )}
        </div>
      )}
    </AdminPageLayout>
  );
}
