import { Circle } from "lucide-react";

interface TripIdHeaderProps {
  id: string; 
  diaSemana: string; 
}

export function TripIdHeader({ id, diaSemana }: TripIdHeaderProps) {
  return (
    <div className="flex items-center justify-between px-1 mb-3 border-b border-slate-100 pb-2">
      <div className="flex items-center gap-2">
        <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
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