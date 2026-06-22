import { CircleDot, MapPin, Users, UserCheck } from "lucide-react";

interface TripInfoCardProps {
  boardingPoint: string;
  dropOffPoint: string;
  totalReservations: number;
  embarcados: number;
}

export function TripInfoCard({
  boardingPoint,
  dropOffPoint,
  totalReservations,
  embarcados,
}: TripInfoCardProps) {
  const progress = totalReservations > 0 ? (embarcados / totalReservations) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Route Card */}
      <div className="md:col-span-1 bg-[#103173] rounded-2xl p-5 text-white relative overflow-hidden">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#73AABF] mb-3">
          Trajeto
        </p>
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex flex-col items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-[#F2D022] ring-2 ring-[#F2D022]/30" />
            <div className="w-0.5 h-6 bg-white/20 rounded-full" />
            <MapPin className="h-4 w-4 text-[#73AABF]" />
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-[#73AABF] font-semibold">Embarque</p>
              <p className="font-bold text-sm">{boardingPoint}</p>
            </div>
            <div>
              <p className="text-xs text-[#73AABF] font-semibold">Desembarque</p>
              <p className="font-bold text-sm">{dropOffPoint}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#73AABF]">
            Reservas
          </p>
          <div className="h-9 w-9 bg-[#103173]/5 rounded-xl flex items-center justify-center">
            <Users className="h-4 w-4 text-[#103173]" />
          </div>
        </div>
        <p className="text-4xl font-black text-[#103173] leading-none">
          {totalReservations}
        </p>
        <p className="text-xs font-semibold text-[#73AABF] mt-1">
          passageiros confirmados
        </p>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#23B99A]">
            Embarcados
          </p>
          <div className="h-9 w-9 bg-[#23B99A]/10 rounded-xl flex items-center justify-center">
            <UserCheck className="h-4 w-4 text-[#23B99A]" />
          </div>
        </div>
        <p className="text-4xl font-black text-[#23B99A] leading-none">
          {embarcados}
        </p>
        {/* Progress Bar */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-semibold text-slate-400">Progresso</p>
            <p className="text-[10px] font-bold text-[#23B99A]">{Math.round(progress)}%</p>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#23B99A] to-[#2dd4a8] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}