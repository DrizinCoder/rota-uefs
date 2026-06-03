"use client";

import {
  FileText, FileSpreadsheet, ShieldAlert,
  Calendar, Users, AlertTriangle,
  Bus, Search, CheckCircle2, FileDown,
} from "lucide-react";
import type { RelatorioFormato, ViagemAdmin } from "@/services/adminService";

type DownloadSeguroAtual = {
  tripId: string;
  formato: RelatorioFormato;
} | null;

interface AdminRelatoriosTabsProps {
  abaAtiva: "gestao" | "seguro";
  setAbaAtiva: (aba: "gestao" | "seguro") => void;
  mesSelecionado: string;
  setMesSelecionado: (mes: string) => void;
  handleDownloadGestao: (formato: RelatorioFormato) => void;
  handleDownloadSeguro: (idViagem: string, formato: RelatorioFormato) => void;
  viagensSeguro: ViagemAdmin[];
  buscaSeguro: string;
  setBuscaSeguro: (valor: string) => void;
  loadingViagens: boolean;
  erroViagens: string;
  erroRelatorio: string;
  downloadGestao: RelatorioFormato | null;
  downloadSeguroAtual: DownloadSeguroAtual;
}

const formatarDataBR = (dataStr?: string | null): string => {
  if (!dataStr) return "Data não informada";

  const partes = dataStr.split(/[-/]/);
  if (partes.length === 3) {
    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
  }

  return dataStr;
};

const formatarHorario = (horario?: string | null): string => {
  if (!horario) return "--:--";
  return horario.slice(0, 5);
};

const isDownloadSeguroAtivo = (
  downloadAtual: DownloadSeguroAtual,
  tripId: string,
  formato: RelatorioFormato,
) => downloadAtual?.tripId === tripId && downloadAtual.formato === formato;

export function AdminRelatoriosTabs({
  abaAtiva,
  setAbaAtiva,
  mesSelecionado,
  setMesSelecionado,
  handleDownloadGestao,
  handleDownloadSeguro,
  viagensSeguro,
  buscaSeguro,
  setBuscaSeguro,
  loadingViagens,
  erroViagens,
  erroRelatorio,
  downloadGestao,
  downloadSeguroAtual,
}: AdminRelatoriosTabsProps) {
  return (
    <>
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

      {erroRelatorio && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {erroRelatorio}
        </div>
      )}

      {abaAtiva === "gestao" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
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
                onClick={() => handleDownloadGestao("pdf")}
                disabled={downloadGestao !== null}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-[#103173] border border-slate-200 hover:border-[#103173]/30 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FileText className="h-4 w-4" />
                {downloadGestao === "pdf" ? "Gerando PDF..." : "Exportar PDF"}
              </button>
              <button
                onClick={() => handleDownloadGestao("csv")}
                disabled={downloadGestao !== null}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#23B99A] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all hover:bg-[#1fa889] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FileSpreadsheet className="h-4 w-4" />
                {downloadGestao === "csv" ? "Gerando CSV..." : "Exportar CSV"}
              </button>
            </div>
          </div>

          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-8 mb-4">
            Prévia do Período
          </h2>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-5 w-5 text-[#F2D022]" />
              <h3 className="font-bold text-[#103173]">Prévia indisponível</h3>
            </div>
            <p className="text-sm font-medium text-slate-500">
              O backend atual gera o arquivo mensal em PDF ou CSV, mas não retorna métricas consolidadas para esta prévia.
            </p>
          </div>
        </div>
      )}

      {abaAtiva === "seguro" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center">
            <Search className="h-5 w-5 text-slate-400 ml-3 mr-2" />
            <input
              type="text"
              value={buscaSeguro}
              onChange={(e) => setBuscaSeguro(e.target.value)}
              placeholder="Buscar viagem por ID, rota, data, placa ou motorista..."
              className="flex-1 bg-transparent border-none focus:outline-none text-[#103173] placeholder:text-slate-400 text-sm py-2"
            />
          </div>

          <div className="grid gap-4">
            {loadingViagens ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                <Bus className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                <p className="text-[#103173] font-bold text-lg">Carregando viagens...</p>
              </div>
            ) : erroViagens ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-red-200">
                <AlertTriangle className="h-12 w-12 text-red-200 mx-auto mb-4" />
                <p className="text-red-600 font-bold text-lg">{erroViagens}</p>
              </div>
            ) : viagensSeguro.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                <ShieldAlert className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                <p className="text-[#103173] font-bold text-lg">Nenhuma viagem concluída encontrada</p>
                <p className="text-slate-500 text-sm mt-1">A lista nominal fica disponível para viagens com status concluído.</p>
              </div>
            ) : (
              viagensSeguro.map((viagem) => {
                const origem = viagem.boarding_point || "Origem não informada";
                const destino = viagem.drop_off_point || "Destino não informado";
                const baixandoPdf = isDownloadSeguroAtivo(downloadSeguroAtual, viagem.trip_id, "pdf");
                const baixandoCsv = isDownloadSeguroAtivo(downloadSeguroAtual, viagem.trip_id, "csv");
                const algumDownloadSeguro = downloadSeguroAtual !== null;

                return (
                  <div key={viagem.trip_id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#23B99A]/10 rounded-xl shrink-0">
                        <ShieldAlert className="h-6 w-6 text-[#23B99A]" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-black text-[#103173] bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider break-all">
                            {viagem.trip_id}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase text-[#23B99A]">
                            <CheckCircle2 className="h-3 w-3" /> Viagem Concluída
                          </span>
                        </div>
                        <p className="text-base font-extrabold text-[#103173] mb-2">{origem} para {destino}</p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" /> {formatarDataBR(viagem.trip_date)} às {formatarHorario(viagem.departure_time)}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="flex items-center gap-1">
                            <Bus className="h-3.5 w-3.5" /> {viagem.bus_license_plate || "Veículo não informado"}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" /> {viagem.total_checkins ?? 0} embarcados
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-2">
                          Motorista: {viagem.driver_name || "Não informado"} {viagem.route_name ? `| Rota: ${viagem.route_name}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0 flex flex-col gap-2">
                      <button
                        onClick={() => handleDownloadSeguro(viagem.trip_id, "pdf")}
                        disabled={algumDownloadSeguro}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#103173] hover:bg-[#103173]/90 text-white font-bold py-3 px-5 rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <FileDown className="h-5 w-5" />
                        {baixandoPdf ? "Gerando PDF..." : "Baixar PDF"}
                      </button>
                      <button
                        onClick={() => handleDownloadSeguro(viagem.trip_id, "csv")}
                        disabled={algumDownloadSeguro}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-[#103173] border border-slate-200 hover:bg-slate-50 font-bold py-3 px-5 rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <FileSpreadsheet className="h-5 w-5" />
                        {baixandoCsv ? "Gerando CSV..." : "Baixar CSV"}
                      </button>
                      <p className="text-[10px] text-center text-slate-400 mt-1">Documento oficial para Seguradora</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
}
