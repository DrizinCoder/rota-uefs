import { MapPin, CircleDot } from "lucide-react";

interface TripRouteHeaderProps {
  origem: string;
  destino: string;
  horarioInicio: string;
  horarioFim: string;
}

export function TripRouteHeader({ origem, destino, horarioInicio, horarioFim }: TripRouteHeaderProps) {
  return (
    // Exatamente o seu código!
    <div className="flex items-start gap-3 mb-4">
      <div className="flex flex-col items-center pt-0.5 shrink-0">
        <CircleDot className="h-4 w-4 text-[#F2D022]" />
        <div className="w-px h-6 bg-gradient-to-b from-[#F2D022] to-[#103173] my-0.5" />
        <MapPin className="h-4 w-4 text-[#103173]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <p className="text-base font-extrabold text-[#103173]">{origem}</p>
          <span className="text-[11px] font-bold text-[#103173]/50">{horarioInicio}</span>
        </div>
        <div className="flex justify-between mt-4.5">
          <p className="text-base font-extrabold text-[#103173]">{destino}</p>
          <span className="text-[11px] font-bold text-[#103173]/50">{horarioFim}</span>
        </div>
      </div>
    </div>
  );
}