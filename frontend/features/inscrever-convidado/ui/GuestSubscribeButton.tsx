"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuestSubscribeButtonProps {
  onClick: () => void;
}

export function GuestSubscribeButton({ onClick }: GuestSubscribeButtonProps) {
  return (
    <Button
      variant="secondary"
      className="w-full py-5 bg-[#F2D022]/10 text-[#b8960a] hover:bg-[#F2D022]/20 font-bold"
      onClick={onClick}
    >
      <UserPlus className="h-4 w-4 mr-2" /> Inscrever Convidado
    </Button>
  );
}