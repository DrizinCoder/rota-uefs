"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface ManageSubscriptionButtonProps {
  viagemId: string;
}

export function ManageSubscriptionButton({ viagemId }: ManageSubscriptionButtonProps) {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.push("/passageiro/status")} 
      className="w-full py-3 rounded-xl text-sm font-bold bg-[#103173]/5 text-[#103173] flex items-center justify-center gap-2 hover:bg-[#103173]/10 transition-colors"
    >
      Ver minha inscrição <ArrowRight className="h-4 w-4" />
    </button>
  );
}