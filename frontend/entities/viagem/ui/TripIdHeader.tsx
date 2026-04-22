import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TripIdHeaderProps {
  id: string; 
  diaSemana: string; 
  status?: "bloqueada" | "pronta" | "em_curso" | "finalizada";
}

export function TripIdHeader({ id, diaSemana, status }: TripIdHeaderProps) {
  // Se estiver pronta ou em curso, fica verde. Caso contrário (bloqueada), cinza.
  const isActive = status === "pronta" || status === "em_curso";

  return (
    <div className="flex items-center justify-between px-1 mb-3 border-b border-slate-100 pb-2">
      <div className="flex items-center gap-2">
        <Circle 
          className={cn(
            "h-2 w-2",
            isActive 
              ? "fill-emerald-500 text-emerald-500" 
              : "fill-slate-300 text-slate-300"
          )} 
        />
        <span className="text-[11px] font-bold text-[#103173] tracking-wider uppercase">
          {id}
        </span>
      </div>
      
      <span className="text-[11px] font-medium text-slate-400 lowercase first-letter:uppercase">
        {diaSemana}
      </span>
    </div>
  );
}