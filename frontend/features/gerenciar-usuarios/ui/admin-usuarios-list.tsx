"use client";

import { Search, AlertTriangle, Loader2, UserCircle, ShieldCheck, Trash2 } from "lucide-react";
import type { Administrador } from "@/services/adminService";

interface AdminUsuariosListProps {
  busca: string;
  setBusca: (val: string) => void;
  erro: string;
  loading: boolean;
  adminsFiltrados: Administrador[];
  excluindo: string | null;
  carregarAdmins: () => void;
  handleExcluir: (admin: Administrador) => void;
}

export function AdminUsuariosList({
  busca,
  setBusca,
  erro,
  loading,
  adminsFiltrados,
  excluindo,
  carregarAdmins,
  handleExcluir
}: AdminUsuariosListProps) {
  return (
    <>
      {/* Barra de pesquisa */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center mb-6">
        <Search className="h-5 w-5 text-slate-400 ml-3 mr-2 shrink-0" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou matrícula..."
          className="flex-1 bg-transparent border-none focus:outline-none text-[#103173] placeholder:text-slate-400 text-sm py-2"
        />
      </div>

      {/* Erro de carregamento */}
      {erro && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm font-medium text-red-700">{erro}</p>
          <button
            onClick={carregarAdmins}
            className="ml-auto text-xs font-bold text-red-600 underline hover:no-underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Estado de carregamento */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 text-[#103173] animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Carregando administradores...</p>
        </div>
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
                      {admin.email && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span>{admin.email}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                  <button
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
    </>
  );
}
