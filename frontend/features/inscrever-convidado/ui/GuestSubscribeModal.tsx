"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TripModeToggle } from "@/entities/viagem/ui/TripModeToggle";

interface GuestSubscribeModalProps {
  viagemId: string | null;
  onClose: () => void;
}

export function GuestSubscribeModal({ viagemId, onClose }: GuestSubscribeModalProps) {
  const [modalidade, setModalidade] = useState<"ida" | "ida-volta">("ida");

  if (!viagemId) return null;

  const handleConfirmar = () => {
    alert("Convidado inscrito com sucesso!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-extrabold text-[#103173] mb-1">Inscrever Convidado</h2>
        <p className="text-xs text-gray-500 mb-5">Você está usando sua prioridade para adicionar alguém à lista.</p>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="nome" className="text-xs font-bold text-[#103173]">Nome do Convidado</Label>
            <Input id="nome" placeholder="Digite o nome completo" />
          </div>

          <TripModeToggle 
            modalidadeAtual={modalidade} 
            onChange={setModalidade} 
          />

          <Button
            className="w-full bg-[#23B99A] hover:bg-[#1d9980] text-white font-bold mt-2"
            onClick={handleConfirmar}
          >
            Confirmar Inscrição
          </Button>
        </div>
      </div>
    </div>
  );
}