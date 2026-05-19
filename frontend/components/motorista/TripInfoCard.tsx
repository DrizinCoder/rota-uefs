import { Card, CardContent } from "@/components/ui/card";
import { CircleDot, MapPin } from "lucide-react";

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
  return (
    <Card className="border-none shadow-lg bg-[#103173] text-white rounded-3xl overflow-hidden mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
            <p className="text-[10px] text-[#73AABF] font-black uppercase tracking-widest mb-1">
              Trajeto
            </p>
            <div className="flex items-center flex-wrap justify-center sm:justify-start gap-2 text-sm md:text-base font-bold">
              <CircleDot className="h-5 w-5 text-[#F2D022]" />
              <span>{boardingPoint}</span>
              <span className="text-[#73AABF]">→</span>
              <MapPin className="h-5 w-5 text-[#73AABF]" />
              <span>{dropOffPoint}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl w-full sm:w-fit justify-center">
            <div className="text-center px-4 border-r border-white/20">
              <p className="text-[10px] text-[#73AABF] font-black uppercase tracking-widest">
                Vagas Reservadas
              </p>
              <p className="text-2xl font-black">{totalReservations}</p>
            </div>
            <div className="text-center px-4">
              <p className="text-[10px] text-[#23B99A] font-black uppercase tracking-widest">
                Embarcados
              </p>
              <p className="text-2xl font-black text-[#23B99A]">
                {embarcados}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}