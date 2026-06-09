"use client";

import { Star } from "lucide-react";

interface AdminMetricsProps {
  totalFrota: number;
  onibusAtivos: number;
  viagensHoje: number;
}

export function AdminMetrics({ totalFrota, onibusAtivos, viagensHoje }: AdminMetricsProps) {
  const inativos = totalFrota - onibusAtivos;

  return (
    <>
      {/* ROW 1 DOS GRÁFICOS ADAPTADOS */}
      <div className="grid grid-cols-10 gap-6">
        {/* Donut Charts Card */}
        <div className="col-span-12 lg:col-span-6 bg-white p-6 shadow-sm rounded-2xl border border-slate-200 flex flex-wrap items-center justify-around gap-4">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full border-[12px] border-slate-100 border-l-cyan-500 border-b-[#23B99A] flex items-center justify-center mx-auto mb-4 relative">
              <div className="text-center">
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Frota</div>
                <div className="text-2xl font-black text-slate-800">{totalFrota}</div>
              </div>
            </div>
            <h3 className="font-bold text-sm text-slate-700">VEÍCULOS</h3>
            <p className="text-[10px] text-gray-400 mt-1 max-w-[150px] mx-auto">Total de ônibus registrados no sistema.</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 rounded-full border-[12px] border-slate-100 border-t-cyan-500 flex items-center justify-center mx-auto mb-4 relative">
              <div className="text-center">
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Ativos</div>
                <div className="text-2xl font-black text-slate-800">{onibusAtivos}</div>
              </div>
            </div>
            <h3 className="font-bold text-sm text-slate-700">EM OPERAÇÃO</h3>
            <p className="text-[10px] text-gray-400 mt-1 max-w-[150px] mx-auto">Veículos rodando ou prontos para viagem.</p>
          </div>
        </div>

        {/* Progress Bars Card */}
        <div className="col-span-12 lg:col-span-4 bg-white p-6 shadow-sm rounded-2xl border border-slate-200 flex flex-col justify-center space-y-4">
          {[
            { label: 'VIAGENS HOJE', val: viagensHoje.toString(), color: 'bg-cyan-500', width: `${(viagensHoje / Math.max(viagensHoje, totalFrota, 1)) * 100}%` },
            { label: 'ATIVOS', val: onibusAtivos.toString(), color: 'bg-[#23B99A]', width: `${(onibusAtivos / Math.max(totalFrota, 1)) * 100}%` },
            { label: 'INATIVOS', val: inativos.toString(), color: 'bg-slate-400', width: `${(inativos / Math.max(totalFrota, 1)) * 100}%` },
          ].map((item) => (
            <div key={item.label} className="flex items-center text-xs">
              <span className="w-28 font-bold text-slate-600 uppercase tracking-tight">{item.label}</span>
              <div className="flex-1 bg-slate-100 h-6 flex items-center relative rounded-r-md overflow-hidden">
                <div 
                  className={`${item.color} h-full flex items-center px-2 text-white font-bold transition-all duration-500`}
                  style={{ width: item.width }}
                >
                  {item.val}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </>
  );
}