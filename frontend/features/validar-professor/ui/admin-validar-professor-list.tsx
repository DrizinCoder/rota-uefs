"use client";

import { Users, CheckCircle2, XCircle, Search, ShieldAlert, Loader2, AlertTriangle } from "lucide-react";

export interface Servidor {
  user_id: string;
  full_name: string;
  registration_id: string;
  email: string | null;
  phone: string;
  department: string;
  employment_type: string;
  registration_status: string;
}

interface AdminValidarProfessorListProps {
  busca: string;
  onBuscaChange: (valor: string) => void;
  erro: string;
  loading: boolean;
  filtrados: Servidor[];
  processando: string | null;
  handleAprovar: (servidor: Servidor) => void;
  handleRejeitar: (servidor: Servidor) => void;
  carregarServidores: () => void;
}

export function AdminValidarProfessorList({
  busca,
  onBuscaChange,
  erro,
  loading,
  filtrados,
  processando,
  handleAprovar,
  handleRejeitar,
  carregarServidores
}: AdminValidarProfessorListProps) {
  return (
    <>
      {/* Barra de pesquisa */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center mb-6">
        <Search className="h-5 w-5 text-slate-400 ml-3 mr-2 shrink-0" />
        <input
          type="text"
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          placeholder="Buscar por nome ou matrícula..."
          className="flex-1 bg-transparent border-none focus:outline-none text-[#103173] placeholder:text-slate-400 text-sm py-2"
        />
      </div>

      {/* Erro */}
      {erro && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm font-medium text-red-700">{erro}</p>
          <button
            onClick={carregarServidores}
            className="ml-auto text-xs font-bold text-red-600 underline hover:no-underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 text-[#103173] animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Carregando solicitações...</p>
        </div>
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
                        {servidor.email && (
                          <>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span>{servidor.email}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex items-center gap-2">
                    <button
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
    </>
  );
}
