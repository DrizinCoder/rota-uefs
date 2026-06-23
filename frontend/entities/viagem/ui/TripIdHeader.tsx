import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export type TripStatus = "bloqueada" | "pronta" | "em_curso" | "finalizada" | "cancelada";

interface TripIdHeaderProps {
  diaSemana: string;
  status?: TripStatus;
}

const STATUS_CONFIG: Record<TripStatus, { dotClass: string; label: string; labelClass: string }> = {
  bloqueada: {
    dotClass: "fill-slate-300 text-slate-300",
    label: "Agendada",
    labelClass: "text-slate-400",
  },
  pronta: {
    dotClass: "fill-[#4A6FB5] text-[#4A6FB5]",
    label: "Aguardando",
    labelClass: "text-[#4A6FB5]",
  },
  em_curso: {
    dotClass: "fill-[#23B99A] text-[#23B99A]",
    label: "Em Curso",
    labelClass: "text-[#23B99A]",
  },
  finalizada: {
    dotClass: "fill-[#103173] text-[#103173]",
    label: "Concluída",
    labelClass: "text-[#103173]",
  },
  cancelada: {
    dotClass: "fill-slate-500 text-slate-500",
    label: "Cancelada",
    labelClass: "text-slate-500",
  },
};

export function TripIdHeader({ diaSemana, status }: TripIdHeaderProps) {
  const config = status ? STATUS_CONFIG[status] : STATUS_CONFIG["bloqueada"];

  return (
    <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2 py">
      <div className="flex items-center gap-2">
        <Circle className={cn("h-2.5 w-2.5", config.dotClass)} />
        <span className={cn("text-[11px] font-bold tracking-wider uppercase", config.labelClass)}>
          {config.label}
        </span>
      </div>

      <span className="text-[11px] font-medium text-slate-400 lowercase first-letter:uppercase">
        {diaSemana}
      </span>
    </div>
  );
}