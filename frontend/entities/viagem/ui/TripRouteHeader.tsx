import { MapPin, CircleDot, Clock } from "lucide-react";

interface TripRouteHeaderProps {
  origem: string;
  destino: string;
  horarioInicio: string;
}

export function TripRouteHeader({ origem, destino, horarioInicio }: TripRouteHeaderProps) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex flex-col items-center pt-0.5 shrink-0">
        <CircleDot className="h-4 w-4 text-[#F2D022]" />
        <div className="w-px h-6 bg-gradient-to-b from-[#F2D022] to-[#73AABF] my-0.5" />
        <MapPin className="h-4 w-4 text-[#73AABF]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className="text-base font-extrabold text-[#103173]">{origem}</p>
          <span className="flex items-center gap-1 text-[11px] font-bold text-[#73AABF] bg-[#73AABF]/10 px-2 py-0.5 rounded-full shrink-0 ml-2">
            <Clock className="h-3 w-3" />
            {horarioInicio}
          </span>
        </div>
        <div className="flex justify-between mt-4.5">
          <p className="text-base font-extrabold text-[#103173]">{destino}</p>
        </div>
      </div>
    </div>
  );
}