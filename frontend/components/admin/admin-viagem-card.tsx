"use client";

import {
  Bus,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  ArrowRight,
  PencilLine,
  Trash2,
  UserCheck,
} from "lucide-react";
import type { ViagemAdmin } from "@/services/adminService";

export interface AdminViagemCardModel extends ViagemAdmin {
  reservasAlunos: number;
  reservasProfessores: number;
  checkIns: number;
}

type AdminViagemCardProps = {
  viagem: AdminViagemCardModel;
  onEditar: (tripId: string) => void;
  onExcluir: (tripId: string) => void;
};

export function AdminViagemCard({ viagem, onEditar, onExcluir }: AdminViagemCardProps) {
  const temProfessor = viagem.reservasProfessores > 0;
  const totalReservas = viagem.reservasAlunos + viagem.reservasProfessores;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-black text-[#103173] uppercase tracking-wider bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
            {viagem.trip_id}
          </span>
          <span
            className={`text-xs font-black uppercase px-3 py-1.5 rounded-lg ${
              viagem.status === "Confirmada"
                ? "bg-[#23B99A]/10 text-[#23B99A]"
                : "bg-[#F2D022]/20 text-[#b8960a]"
            }`}
          >
            {viagem.status}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[#103173] font-extrabold text-xl md:text-2xl">
          {viagem.route_name} <ArrowRight className="h-6 w-6 text-[#F2D022]" /> {viagem.route_name}
        </div>
      </div>

      <div className="p-5 md:p-6 grid md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            Detalhes Operacionais
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-[#103173]/5 rounded-xl shrink-0">
                <Calendar className="h-5 w-5 text-[#103173]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Data</p>
                <p className="text-sm font-extrabold text-[#103173] mt-0.5">{viagem.trip_date}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-[#103173]/5 rounded-xl shrink-0">
                <Clock className="h-5 w-5 text-[#103173]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Horário</p>
                <p className="text-sm font-extrabold text-[#103173] mt-0.5">
                  {viagem.departure_time.slice(0, 5)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-[#103173]/5 rounded-xl shrink-0">
                <Bus className="h-5 w-5 text-[#103173]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Veículo</p>
                <p className="text-sm font-extrabold text-[#103173] mt-0.5 line-clamp-2">
                  {viagem.bus_license_plate}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-[#103173]/5 rounded-xl shrink-0">
                <UserCheck className="h-5 w-5 text-[#103173]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Motorista</p>
                <p className="text-sm font-extrabold text-[#103173] mt-0.5 line-clamp-2">
                  {viagem.driver_name}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            Quórum e Ocupação
          </h3>
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase mb-1">Reservas</p>
                <p className="text-3xl font-black text-[#103173]">{totalReservas}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-slate-500 uppercase mb-1">Check-ins</p>
                <p className="text-3xl font-black text-[#23B99A]">{viagem.checkIns}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-100">
                <GraduationCap className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-600">
                  Profs: <span className="text-[#103173]">{viagem.reservasProfessores}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-100">
                <Users className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-600">
                  Alunos: <span className="text-[#103173]">{viagem.reservasAlunos}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`px-5 md:px-6 py-4 flex items-center gap-3 border-t ${
          temProfessor ? "bg-[#23B99A]/5 border-[#23B99A]/10" : "bg-red-50 border-red-100"
        }`}
      >
        {temProfessor ? (
          <>
            <CheckCircle2 className="h-5 w-5 text-[#23B99A]" />
            <div>
              <p className="text-sm font-bold text-[#23B99A]">Quórum Legal Atingido</p>
              <p className="text-xs text-[#1fa889]">
                A viagem cumpre o requisito de ter ao menos um servidor a bordo.
              </p>
            </div>
          </>
        ) : (
          <>
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm font-bold text-red-700">Atenção ao Quórum</p>
              <p className="text-xs text-red-600">
                Nenhum professor/servidor reservou vaga para esta viagem ainda.
              </p>
            </div>
          </>
        )}
      </div>

      <div className="px-5 md:px-6 py-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:justify-end">
        <button
          type="button"
          onClick={() => onEditar(viagem.trip_id)}
          className="px-4 py-2 text-sm font-bold text-[#103173] bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
        >
          <PencilLine className="h-4 w-4" />
          Editar Viagem
        </button>
        <button
          type="button"
          onClick={() => onExcluir(viagem.trip_id)}
          className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Excluir
        </button>
      </div>
    </div>
  );
}
