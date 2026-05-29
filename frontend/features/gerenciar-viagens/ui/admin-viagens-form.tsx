"use client";

import { useRouter } from "next/navigation";
import { 
  Save, Calendar, Clock, Bus, 
  UserCircle, ArrowRightLeft, AlertTriangle, CheckCircle2 
} from "lucide-react";
import type { Rota, Motorista, BusAdmin } from "@/services/adminService";

interface AdminViagensFormProps {
  motoristas: Motorista[];
  rotas: Rota[];
  onibus: BusAdmin[];
  
  rotaSelecionada: string;
  setRotaSelecionada: (val: string) => void;
  veiculoSelecionado: string;
  setVeiculoSelecionado: (val: string) => void;
  motoristaId: string;
  setMotoristaId: (val: string) => void;
  data: string;
  setData: (val: string) => void;
  horario: string;
  setHorario: (val: string) => void;
  recorrencia: string;
  setRecorrencia: (val: string) => void;
  tipoViagem: string;
  setTipoViagem: (val: string) => void;

  erro: string;
  sucesso: boolean;
  loading: boolean;
  onSalvar: (e: React.FormEvent) => void;
}

export function AdminViagensForm({
  motoristas, rotas, onibus,
  rotaSelecionada, setRotaSelecionada,
  veiculoSelecionado, setVeiculoSelecionado,
  motoristaId, setMotoristaId,
  data, setData,
  horario, setHorario,
  recorrencia, setRecorrencia,
  tipoViagem, setTipoViagem,
  erro, sucesso, loading, onSalvar
}: AdminViagensFormProps) {
  const router = useRouter();

  return (
    <>
      {/* Feedback de Erro */}
      {erro && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-800">Falha ao cadastrar</p>
            <p className="text-sm text-red-600 mt-1">{erro}</p>
          </div>
        </div>
      )}

      {/* Feedback de Sucesso */}
      {sucesso && (
        <div className="mb-6 p-4 rounded-xl bg-[#23B99A]/10 border border-[#23B99A]/30 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-[#23B99A] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#1fa889]">Sucesso!</p>
            <p className="text-sm text-[#23B99A] mt-1">Viagem cadastrada e associada ao veículo com sucesso. Redirecionando...</p>
          </div>
        </div>
      )}

      <form onSubmit={onSalvar} className="space-y-6">
        
        {/* SEÇÃO 1: Roteiro e Tipo */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-extrabold text-[#103173] mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <ArrowRightLeft className="h-5 w-5 text-[#F2D022]" /> 
            Roteiro e Tipo
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Modalidade</label>
              {/* <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tipo" value="ida" checked={tipoViagem === "ida"} onChange={(e) => setTipoViagem(e.target.value)} className="accent-[#103173]" />
                  <span className="text-sm font-bold text-[#103173]">Somente Ida</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tipo" value="ida_volta" checked={tipoViagem === "ida_volta"} onChange={(e) => setTipoViagem(e.target.value)} className="accent-[#103173]" />
                  <span className="text-sm font-bold text-[#103173]">Ida e Volta</span>
                </label>
              </div> */}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* SELECT DE RECORRÊNCIA */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Recorrência</label>
              <select 
                value={recorrencia} 
                onChange={(e) => setRecorrencia(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-[#103173] focus:outline-none"
              >
                <option value="Single">Viagem Única (Individual)</option>
                <option value="Weekly">Escala Semanal Fixa</option>
                <option value="Monthly">Escala Mensal Fixa</option>
              </select>
            </div>

            {/* SELECT DE ROTA (DINÂMICO) */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Rota</label>
              <select 
                value={rotaSelecionada} 
                onChange={(e) => setRotaSelecionada(e.target.value)}
                disabled={rotas.length === 0}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-[#103173] focus:outline-none disabled:bg-slate-100 disabled:text-slate-400">
                <option value="" disabled>
                  {rotas.length === 0 ? "Carregando rotas..." : "Selecione a rota"}
                </option>
                
                {rotas.map((rota) => (
                  <option key={rota.route_id} value={rota.route_id}>
                    {rota.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: Data e Horário */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-extrabold text-[#103173] mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="h-5 w-5 text-[#F2D022]" /> 
            Agendamento
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data de Saída</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="w-full pl-9 p-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#103173] focus:outline-none text-[#103173] font-medium" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Horário de Saída</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input type="time" value={horario} onChange={(e) => setHorario(e.target.value)} className="w-full pl-9 p-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#103173] focus:outline-none text-[#103173] font-medium" />
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 3: Operacional */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-extrabold text-[#103173] mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bus className="h-5 w-5 text-[#F2D022]" /> 
            Equipe e Operacional
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Veículo</label>
              <div className="relative">
                <Bus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select 
                  value={veiculoSelecionado} 
                  onChange={(e) => setVeiculoSelecionado(e.target.value)}
                  disabled={onibus.length === 0}
                  className="w-full pl-8 p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-[#103173] focus:outline-none disabled:bg-slate-100 disabled:text-slate-400">
                  <option value="" disabled>
                    {onibus.length === 0 ? "Carregando veículos..." : "Selecione o Veículo"}
                  </option>
                  
                  {onibus.map((onibus) => (
                    <option key={onibus.bus_plate} value={onibus.bus_plate}>
                      {onibus.bus_plate} | {onibus.capacity}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Motorista</label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select 
                  value={motoristaId} 
                  onChange={(e) => setMotoristaId(e.target.value)}
                  disabled={motoristas.length === 0}
                  className="w-full pl-8 p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-[#103173] focus:outline-none disabled:bg-slate-100 disabled:text-slate-400">
                  <option value="" disabled>
                    {motoristas.length === 0 ? "Carregando motoristas..." : "Selecione o motorista"}
                  </option>
                  
                  {motoristas.map((motorista) => (
                    <option key={motorista.user_id} value={motorista.user_id}>
                      {motorista.full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Ações */}
        <div className="flex flex-col md:flex-row gap-3 pt-4">
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#23B99A] text-white py-3.5 rounded-xl font-extrabold text-lg flex items-center justify-center gap-2 hover:bg-[#1fa889] transition-all active:scale-[0.98] shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            {loading ? "Salvando..." : "Salvar Viagem"}
          </button>
          <button 
            type="button" 
            onClick={() => router.back()}
            disabled={loading}
            className="md:w-32 bg-white text-slate-500 border border-slate-200 py-3.5 rounded-xl font-bold flex items-center justify-center hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}
