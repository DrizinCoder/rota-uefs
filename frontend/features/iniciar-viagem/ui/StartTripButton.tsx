"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StartTripButtonProps {
  status: "bloqueada" | "pronta" | "em_curso" | "finalizada";
  onClick?: () => void;
  className?: string;
}

export function StartTripButton({ status, onClick, className }: StartTripButtonProps) {
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

  if (status === "finalizada") {
    return (
      <Button 
        disabled 
        className={cn("w-full bg-slate-100 text-slate-400 font-bold py-6 text-lg rounded-2xl", className)}
      >
        Viagem Concluída
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