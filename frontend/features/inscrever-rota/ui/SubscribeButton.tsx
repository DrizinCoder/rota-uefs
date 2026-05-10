"use client";

import { useRouter } from "next/navigation";
import { Ticket } from "lucide-react";

interface SubscribeButtonProps {
  viagemId: string; // Deixando pronto pra quando vc precisar passar o ID pra tela de confirmação
}

export function SubscribeButton({ viagemId }: SubscribeButtonProps) {
  const router = useRouter();

  return (
    <button 
      onClick={() => {
        sessionStorage.setItem("viagemIdSelecionada", viagemId);
        router.push("/passageiro/confirmacao");
      }} 
      className="w-full py-3.5 rounded-xl text-sm font-extrabold bg-[#103173] text-white shadow-lg flex items-center justify-center gap-2 hover:bg-[#0d2a63] transition-colors"
    >
      <Ticket className="h-4 w-4" /> Inscrever-se nesta rota
    </button>
  );
}