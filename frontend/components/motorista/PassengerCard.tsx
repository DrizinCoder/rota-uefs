"use client";

import { Button } from "@/components/ui/button";
import { UserCheck, Clock, UserX, Trash2, ChevronRight } from "lucide-react";

interface PassengerCardProps {
  reservation_id: string;
  user_id: string;
  trip_id: string;
  nome: string;
  tipo: string;
  status: "pendente" | "embarcou" | "espera";
  isAvulso?: boolean;
  isWaitlist?: boolean;
  onEmbarcar: (user_id: string, reservation_id: string, trip_id: string) => void;
  onCancelarEmbarque: (reservation_id: string) => void;
  onMarcarFalta: (reservation_id: string) => void;
  onRemoverAvulso: (reservation_id: string) => void;
}

export function PassengerCard({
  user_id,
  trip_id,
  reservation_id,
  nome,
  tipo,
  status,
  isAvulso = false,
  isWaitlist = false,
  onEmbarcar,
  onCancelarEmbarque,
  onMarcarFalta,
  onRemoverAvulso,
}: PassengerCardProps) {
  const initials = nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const statusConfig = {
    embarcou: {
      label: "Embarcou",
      icon: <UserCheck className="w-3.5 h-3.5" />,
      bg: "bg-[#23B99A]/10",
      text: "text-[#23B99A]",
      ring: "ring-[#23B99A]/20",
      avatarBg: "bg-[#23B99A]",
    },
    pendente: {
      label: "Pendente",
      icon: <Clock className="w-3.5 h-3.5" />,
      bg: "bg-[#F2D022]/10",
      text: "text-[#b39912]",
      ring: "ring-[#F2D022]/20",
      avatarBg: "bg-[#103173]",
    },
    espera: {
      label: "Em Espera",
      icon: <Clock className="w-3.5 h-3.5" />,
      bg: "bg-orange-50",
      text: "text-orange-500",
      ring: "ring-orange-200",
      avatarBg: "bg-orange-400",
    },
  };

  const currentStatus = isWaitlist ? statusConfig.espera : statusConfig[status];

  return (
    <div
      className={`group relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.005] ${
        isWaitlist
          ? "bg-white/60 border border-dashed border-orange-200"
          : status === "embarcou"
            ? "bg-white border border-[#23B99A]/15 shadow-[0_2px_12px_rgba(35,185,154,0.08)]"
            : "bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto flex-1 min-w-0">
        {/* Avatar */}
        <div
          className={`relative h-11 w-11 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0 ${currentStatus.avatarBg} ${
            status === "embarcou" && !isWaitlist ? "ring-2 ring-offset-2 ring-[#23B99A]/30" : ""
          }`} 
        >
          {initials}
          {status === "embarcou" && !isWaitlist && (
            <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-[#23B99A] rounded-full flex items-center justify-center ring-2 ring-white">
              <UserCheck className="h-2.5 w-2.5 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-[#103173] text-[15px] truncate">
              {nome}
            </h3>
            {isAvulso && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#103173]/5 text-[#103173]/60 px-2 py-0.5 rounded-full shrink-0">
                Avulso
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-[#73AABF] mt-0.5">{tipo}</p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-1 sm:mt-0 pl-14 sm:pl-0">
        {/* Status Pill */}
        <div
          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ring-1 shrink-0 ${currentStatus.bg} ${currentStatus.text} ${currentStatus.ring}`}
        >
          {currentStatus.icon}
          {currentStatus.label}
        </div>

        {/* Actions */}
        {!isWaitlist && (
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isAvulso ? (
              <Button
                onClick={() => onRemoverAvulso(reservation_id)}
                variant="ghost"
                size="sm"
                className="h-9 px-3 rounded-xl text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center gap-1"
                title="Remover avulso"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Remover</span>
              </Button>
            ) : (
              <>
                {status === "embarcou" ? (
                  <Button
                    onClick={() => onCancelarEmbarque(reservation_id)}
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 rounded-xl text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    Desfazer
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => onMarcarFalta(reservation_id)}
                      variant="ghost"
                      size="sm"
                      className="h-9 px-3 rounded-xl text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center gap-1"
                      title="Marcar falta"
                    >
                      <UserX className="h-4 w-4" />
                      <span className="hidden sm:inline">Falta</span>
                    </Button>
                    <Button
                      onClick={() => onEmbarcar(user_id, reservation_id, trip_id)}
                      size="sm"
                      className="h-9 px-3 sm:px-4 rounded-xl font-bold text-xs bg-[#103173] text-white hover:bg-[#1a4a9e] shadow-sm transition-all flex items-center gap-1"
                    >
                      Embarcar
                      <ChevronRight className="h-3.5 w-3.5 hidden sm:block" />
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}