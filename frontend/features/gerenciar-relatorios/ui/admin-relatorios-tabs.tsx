"use client";

import { 
  FileText, FileSpreadsheet, ShieldAlert, 
  Calendar, Users, AlertTriangle, Building2, 
  Bus, Search, CheckCircle2, FileDown 
} from "lucide-react";

interface AdminRelatoriosTabsProps {
  abaAtiva: "gestao" | "seguro";
  setAbaAtiva: (aba: "gestao" | "seguro") => void;
  mesSelecionado: string;
  setMesSelecionado: (mes: string) => void;
  handleDownloadGestao: (formato: string) => void;
  handleDownloadSeguro: (idViagem: string) => void;
  DADOS_GESTAO: any;
  VIAGENS_SEGURO: any[];
}

export function AdminRelatoriosTabs({
  abaAtiva,
  setAbaAtiva,
  mesSelecionado,
  setMesSelecionado,
  handleDownloadGestao,
  handleDownloadSeguro,
  DADOS_GESTAO,
  VIAGENS_SEGURO
}: AdminRelatoriosTabsProps) {
  return (
    <>
      {/* Navegação de Abas */}
      <div className="flex gap-6 mb-8 border-b border-slate-200">
        <button 
          onClick={() => setAbaAtiva("gestao")}
          className={`pb-4 font-extrabold text-sm border-b-2 transition-all ${
            abaAtiva === "gestao" ? "border-[#103173] text-[#103173]" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Gestão Logística e Faturamento
        </button>
        <button 
          onClick={() => setAbaAtiva("seguro")}
          className={`pb-4 font-extrabold text-sm border-b-2 transition-all ${
            abaAtiva === "seguro" ? "border-[#103173] text-[#103173]" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Auditoria de Seguro (Lista Nominal)
        </button>
      </div>

      {/* CONTEÚDO: Relatórios de Gestão (RF018) */}
      {abaAtiva === "gestao" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Filtro de Período e Botões de Exportação */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#103173]/5 rounded-xl shrink-0">
                <Calendar className="h-6 w-6 text-[#103173]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Período de Análise
                </label>
                <input 
                  type="month" 
                  value={mesSelecionado}
                  onChange={(e) => setMesSelecionado(e.target.value)}
                  className="font-extrabold text-[#103173] bg-transparent border-none focus:outline-none text-lg p-0"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              <button 
                onClick={() => handleDownloadGestao('pdf')}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-[#103173] border border-slate-200 hover:border-[#103173]/30 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all hover:bg-slate-50"
              >
                <FileText className="h-4 w-4" /> Exportar PDF
              </button>
              <button 
                onClick={() => handleDownloadGestao('excel')}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#23B99A] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all hover:bg-[#1fa889]"
              >
                <FileSpreadsheet className="h-4 w-4" /> Exportar Excel
              </button>
            </div>
          </div>

          {/* Prévia das Métricas (RF018) */}
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-8 mb-4">Prévia do Período</h2>
          <div className="grid md:grid-cols-3 gap-4">
            
            {/* Ocupação */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-5 w-5 text-[#103173]" />
                <h3 className="font-bold text-[#103173]">Métrica de Ocupação</h3>
              </div>
              <p className="text-3xl font-black text-[#103173] mb-1">{DADOS_GESTAO.ocupacao.taxa}</p>
              <p className="text-xs font-medium text-slate-500">
                {DADOS_GESTAO.ocupacao.assentosOcupados} ocupados de {DADOS_GESTAO.ocupacao.assentosOfertados} ofertados em {DADOS_GESTAO.ocupacao.realizadas} viagens.
              </p>
            </div>

            {/* Quórum */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="font-bold text-red-700">Viagens Canceladas</h3>
              </div>
              <p className="text-3xl font-black text-red-600 mb-1">{DADOS_GESTAO.quorum.canceladas}</p>
              <p className="text-xs font-medium text-slate-500">
                Cancelamentos por falta de quórum ou {DADOS_GESTAO.quorum.motivo.toLowerCase()}.
              </p>
            </div>

            {/* 2º Ônibus */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <Bus className="h-5 w-5 text-[#F2D022]" />
                <h3 className="font-bold text-[#103173]">Uso do 2º Ônibus</h3>
              </div>
              <p className="text-3xl font-black text-[#103173] mb-1">{DADOS_GESTAO.segundoOnibus.acionamentos} <span className="text-sm font-bold text-slate-400">vezes</span></p>
              <p className="text-xs font-medium text-slate-500">
                Acionamentos no mês com média de ocupação real de {DADOS_GESTAO.segundoOnibus.ocupacaoMedia}.
              </p>
            </div>

            {/* Departamentos */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 md:col-span-3">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-5 w-5 text-[#103173]" />
                <h3 className="font-bold text-[#103173]">Por Departamento</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {DADOS_GESTAO.departamentos.map((dep: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-sm border border-slate-100 p-3 rounded-xl bg-slate-50">
                    <span className="font-bold text-slate-600">{dep.nome}</span>
                    <span className="font-extrabold text-[#103173]">{dep.professores} profs</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CONTEÚDO: Auditoria de Seguro (RF021) */}
      {abaAtiva === "seguro" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center">
            <Search className="h-5 w-5 text-slate-400 ml-3 mr-2" />
            <input 
              type="text" 
              placeholder="Buscar viagem por ID, data ou motorista..." 
              className="flex-1 bg-transparent border-none focus:outline-none text-[#103173] placeholder:text-slate-400 text-sm py-2"
            />
          </div>

          <div className="grid gap-4">
            {VIAGENS_SEGURO.map((viagem: any) => (
              <div key={viagem.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#23B99A]/10 rounded-xl shrink-0">
                    <ShieldAlert className="h-6 w-6 text-[#23B99A]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-[#103173] bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">{viagem.id}</span>
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase text-[#23B99A]"><CheckCircle2 className="h-3 w-3" /> Viagem Finalizada</span>
                    </div>
                    <p className="text-base font-extrabold text-[#103173] mb-2">{viagem.origem} para {viagem.destino}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {viagem.data} às {viagem.horario}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="flex items-center gap-1"><Bus className="h-3.5 w-3.5" /> {viagem.onibus}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {viagem.passageiros} embarcados</span>
                    </div>
                  </div>
                </div>

                <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0">
                  <button 
                    onClick={() => handleDownloadSeguro(viagem.id)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#103173] hover:bg-[#103173]/90 text-white font-bold py-3 px-5 rounded-xl shadow-sm transition-all active:scale-[0.98]"
                  >
                    <FileDown className="h-5 w-5" />
                    Baixar Lista Nominal (PDF)
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-2">Documento oficial para Seguradora</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
