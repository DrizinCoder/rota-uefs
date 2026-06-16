"use client";

import { CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CheckinButtonProps {
  viagemId: string;
  onClick?: () => void;
  disabled?: boolean;
  travado?: boolean;
  className?: string;
}

export function CheckinButton({ viagemId, onClick, disabled, travado = false, className }: CheckinButtonProps) {
  if (travado) {
    return (
      <Button
        disabled
        className={cn("w-full bg-slate-200 text-slate-400 font-extrabold py-6 text-lg rounded-2xl flex items-center justify-center gap-3", className)}
      >
        <Lock className="h-5 w-5" />
        Fazer Check-in
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn("w-full bg-[#23B99A] hover:bg-[#1fa889] text-white font-extrabold py-6 text-lg rounded-2xl flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.97]", className)}
    >
      <CheckCircle2 className="h-6 w-6" />
      Fazer Check-in
    </Button>
  );
}