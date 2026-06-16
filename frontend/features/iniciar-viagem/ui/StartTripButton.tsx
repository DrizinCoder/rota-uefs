"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

interface StartTripButtonProps {
  status: "bloqueada" | "pronta" | "em_curso" | "finalizada" | "cancelada";
  travado?: boolean;
  onClick?: () => void;
  className?: string;
}

export function StartTripButton({ status, travado = false, onClick, className }: StartTripButtonProps) {
  if (status === "bloqueada") {
    return (
      <Button 
        disabled 
        className={cn("w-full bg-slate-200 text-slate-400 font-bold py-6 text-lg rounded-2xl", className)}
      >
        Aguardando Horário
      </Button>
    );
  }

  if (status === "em_curso") {
    return (
      <Button 
        onClick={onClick}
        className={cn("w-full bg-[#F2D022] hover:bg-[#e0c01f] text-[#103173] font-bold py-6 text-lg rounded-2xl transition-all", className)}
      >
        Confirmar Chegada
      </Button>
    );
  }

  if (status === "finalizada" || status === "cancelada") {
    return (
      <Button 
        disabled 
        className={cn("w-full bg-slate-100 text-slate-400 font-bold py-6 text-lg rounded-2xl", className)}
      >
        {status === "cancelada" ? "Viagem Cancelada" : "Viagem Concluída"}
      </Button>
    );
  }

  if (travado) {
    return (
      <Button
        disabled
        className={cn("w-full bg-slate-200 text-slate-400 font-bold py-6 text-lg rounded-2xl flex items-center justify-center gap-2", className)}
      >
        <Lock className="h-5 w-5" />
        Iniciar Viagem
      </Button>
    );
  }

  return (
    <Button 
      onClick={onClick}
      className={cn("w-full bg-[#082257] hover:bg-[#061940] text-white font-bold py-6 text-lg rounded-2xl transition-all", className)}
    >
      Iniciar Viagem
    </Button>
  );
}