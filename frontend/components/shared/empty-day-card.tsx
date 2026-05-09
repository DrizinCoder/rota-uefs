import { CalendarDays } from "lucide-react";

interface EmptyDayCardProps {
  diaNome?: string;
  titulo?: string;
  subtitulo?: string;
}

export function EmptyDayCard({ 
  diaNome,
  titulo = "Nenhuma viagem para este dia",
  subtitulo
}: EmptyDayCardProps) {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
      <CalendarDays className="h-10 w-10 text-slate-300 mb-3" />
      <p className="text-[#103173] font-bold">{titulo}</p>
      <p className="text-slate-500 text-sm mt-1">
        {subtitulo ?? `Não há viagens disponíveis ${diaNome?.toLowerCase()}.`}
      </p>
    </div>
  );
}