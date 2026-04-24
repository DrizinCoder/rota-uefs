"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CheckinButtonProps {
  viagemId: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function CheckinButton({ viagemId, onClick, disabled, className }: CheckinButtonProps) {
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