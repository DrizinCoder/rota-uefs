"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface ManageSubscriptionButtonProps {
  viagemId: string;
}

export function ManageSubscriptionButton({ viagemId }: ManageSubscriptionButtonProps) {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.push(`/passageiro/status?viagemId=${viagemId}`)} 
      className="w-full py-4 rounded-xl text-sm font-bold bg-emerald-50 text-emerald-700 flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors ring-1 ring-emerald-200/60"
    >
      <CheckCircle2 className="h-4 w-4" />
      Ver minha inscrição <ArrowRight className="h-4 w-4" />
    </button>
  );
}