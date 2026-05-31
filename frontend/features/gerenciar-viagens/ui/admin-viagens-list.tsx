"use client";

import { 
  Bus, Calendar, Clock, Users, 
  CheckCircle2, Search,
  UserCheck, AlertTriangle, GraduationCap, ArrowRight,
  PencilLine, Trash2
} from "lucide-react";
import type { ViagemAdmin } from "@/services/adminService";

export interface ViagemTela extends ViagemAdmin {}

const formatarDataBR = (dataStr: string): string => {
  if (!dataStr) return "";
  const partes = dataStr.split(/[-/]/);
  if (partes.length === 3) {
    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
  }
  return dataStr;
};

const getStatusStyles = (status: string): string => {
  const normalized = status.toLowerCase();
  if (normalized === "confirmada" || normalized === "confirmed") {
    return "bg-[#23B99A]/10 text-[#23B99A]";
  }
  if (normalized === "pendente" || normalized === "pending") {
    return "bg-[#F2D022]/20 text-[#b8960a]";
  }
  if (normalized === "cancelada" || normalized === "cancelled") {
    return "bg-red-500/10 text-red-600";
  }
  if (normalized === "concluída" || normalized === "concluida" || normalized === "completed") {
    return "bg-blue-500/10 text-blue-600";
  }
  return "bg-slate-100 text-slate-600";
};

interface AdminViagensListProps {
  viagens: ViagemTela[];
  busca: string;
  setBusca: (valor: string) => void;
  onEditar: (id: string) => void;
  onRemover: (id: string) => void;
}

export function AdminViagensList({
  viagens,
  busca,
  setBusca,
  onEditar,
  onRemover,
}: AdminViagensListProps) {
  return (
    <>
      {/* Barra de Pesquisa */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center mb-8">
          <Search className="h-5 w-5 text-slate-400 ml-3 mr-2" />
          <input 
            type="text" 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por rota, motorista ou ID da viagem..." 
            className="flex-1 bg-transparent border-none focus:outline-none text-[#103173] placeholder:text-slate-400 text-sm py-2"
          />
      </div>

      {/* Listagem de Viagens */}
      <div className="grid gap-8">
        {viagens.length > 0 ? (
          viagens.map((viagem) => {
            const temProfessor = viagem.teachers_count > 0;

            return (
              <div 
                key={viagem.trip_id} 
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* HEADER DO CARTÃO: Rota e Status */}
                <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-black text-[#103173] uppercase tracking-wider bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                      {viagem.route_name}
                    </span>
                    <span className={`text-xs font-black uppercase px-3 py-1.5 rounded-lg ${getStatusStyles(viagem.status)}`}>
                      {viagem.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[#103173] font-extrabold text-xl md:text-2xl">
                    {viagem.boarding_point} <ArrowRight className="h-6 w-6 text-[#F2D022]" /> {viagem.drop_off_point}
                  </div>
                </div>

                {/* CORPO DO CARTÃO: Informações e Métricas */}
                <div className="p-5 md:p-6 grid md:grid-cols-2 gap-8 md:gap-12">
                  
                  {/* Bloco 1: Informações Operacionais */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                      Detalhes Operacionais
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-[#103173]/5 rounded-xl shrink-0"><Calendar className="h-5 w-5 text-[#103173]"/></div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Data</p>
                          <p className="text-sm font-extrabold text-[#103173] mt-0.5">{formatarDataBR(viagem.trip_date)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-[#103173]/5 rounded-xl shrink-0"><Clock className="h-5 w-5 text-[#103173]"/></div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Horário</p>
                          <p className="text-sm font-extrabold text-[#103173] mt-0.5">
                            {viagem.departure_time.slice(0, 5)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-[#103173]/5 rounded-xl shrink-0"><Bus className="h-5 w-5 text-[#103173]"/></div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Veículo</p>
                          <p className="text-sm font-extrabold text-[#103173] mt-0.5 line-clamp-2">{viagem.bus_license_plate}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-[#103173]/5 rounded-xl shrink-0"><UserCheck className="h-5 w-5 text-[#103173]"/></div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Motorista</p>
                          <p className="text-sm font-extrabold text-[#103173] mt-0.5 line-clamp-2">{viagem.driver_name}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bloco 2: Quórum e Presença */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                      Quórum e Ocupação
                    </h3>
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <div className="flex items-end justify-between mb-5">
                        <div>
                          <p className="text-[11px] font-bold text-slate-500 uppercase mb-1">Reservas</p>
                          <p className="text-3xl font-black text-[#103173]">{viagem.total_reservations}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-bold text-slate-500 uppercase mb-1">Check-ins</p>
                          <p className="text-3xl font-black text-[#23B99A]">{viagem.total_checkins}</p>
                        </div>
                      </div>
                      
                      {/* Separação Professor / Aluno */}
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-100">
                          <GraduationCap className="h-4 w-4 text-slate-400" /> 
                          <span className="text-xs font-bold text-slate-600">Profs: <span className="text-[#103173]">{viagem.teachers_count}</span></span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-100">
                          <Users className="h-4 w-4 text-slate-400" /> 
                          <span className="text-xs font-bold text-slate-600">Alunos: <span className="text-[#103173]">{viagem.students_count}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>

                {/* RODAPÉ: Alerta Legal */}
                <div className={`px-5 md:px-6 py-4 flex items-center gap-3 border-t ${
                  temProfessor ? 'bg-[#23B99A]/5 border-[#23B99A]/10' : 'bg-red-50 border-red-100'
                }`}>
                  {temProfessor ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-[#23B99A]" /> 
                      <div>
                        <p className="text-sm font-bold text-[#23B99A]">Quórum Legal Atingido</p>
                        <p className="text-xs text-[#1fa889]">A viagem cumpre o requisito de ter ao menos um servidor a bordo.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 text-red-600" /> 
                      <div>
                        <p className="text-sm font-bold text-red-700">Atenção ao Quórum</p>
                        <p className="text-xs text-red-600">Nenhum professor/servidor reservou vaga para esta viagem.</p>
                      </div>
                    </>
                  )}
                </div>

                {/* AÇÕES DA VIAGEM */}
                <div className="px-5 md:px-6 py-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button 
                    onClick={() => onEditar(viagem.trip_id)}
                    className="px-4 py-2 text-sm font-bold text-[#103173] bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <PencilLine className="h-4 w-4" />
                    Editar Viagem
                  </button>
                  <button 
                    onClick={() => onRemover(viagem.trip_id)}
                    className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </button>
                </div>

              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
            <Bus className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p className="text-[#103173] font-bold text-lg">Nenhuma viagem cadastrada</p>
            <p className="text-slate-500 text-sm mt-1">Não há registros de viagens para exibir no momento.</p>
          </div>
        )}
      </div>
    </>
  );
}
