"use client";

import { Search, UserCircle, ChevronRight, PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Motorista } from "@/services/adminService";

interface AdminMotoristasListProps {
  motoristasFiltrados: Motorista[];
  busca: string;
  setBusca: (val: string) => void;
  loading: boolean;
  onEditar: (id: string) => void;
  onRemover: (id: string) => void;
}

export function AdminMotoristasList({
  motoristasFiltrados,
  busca,
  setBusca,
  loading,
  onEditar,
  onRemover
}: AdminMotoristasListProps) {
  const router = useRouter();

  return (
    <>
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center mb-6">
        <Search className="h-5 w-5 text-slate-400 ml-3 mr-2" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou matrícula..."
          className="flex-1 bg-transparent border-none focus:outline-none text-[#103173] placeholder:text-slate-400 text-sm py-2"
        />
      </div>

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
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#103173]/5 flex items-center justify-center shrink-0">
                <UserCircle className="h-6 w-6 text-[#103173]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-lg font-bold text-[#103173]">{motorista.full_name}</p>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${
                    motorista.registration_status === "ACTIVE"
                      ? "bg-[#23B99A]/10 text-[#23B99A]"
                      : "bg-slate-100 text-slate-500"
                  }`}>
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

            <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
              <button 
                onClick={() => onEditar(motorista.user_id)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#103173] bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <PencilLine className="h-4 w-4" />
                Editar
              </button>
              <button 
                onClick={() => onRemover(motorista.user_id)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
