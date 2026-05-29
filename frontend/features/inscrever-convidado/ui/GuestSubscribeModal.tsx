"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TripModeToggle } from "@/entities/viagem/ui/TripModeToggle";
import { passengerService } from "@/services/homeService";
import { useRouter } from "next/navigation";

interface GuestSubscribeModalProps {
  viagemId: string | null;
  onClose: () => void;
}

export function GuestSubscribeModal({ viagemId, onClose }: GuestSubscribeModalProps) {
  const router = useRouter();
  const [modalidade, setModalidade] = useState<"ida" | "ida-volta">("ida");
  const [nomeConvidado, setNomeConvidado] = useState("");
  const [erro, setErro] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!viagemId) return null;

  const handleConfirmar = async () => {
    setErro("");
    if (nomeConvidado.trim().length < 3) {
      setErro("Informe o nome completo do convidado.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await passengerService.subscribeUser(viagemId, nomeConvidado);
      alert("Convidado inscrito com sucesso!");
      onClose();
      // Recarrega a página para buscar a lista de viagens atualizada
      window.location.reload();
    } catch (err: any) {
      setErro(err?.response?.data?.message || err?.message || "Erro ao inscrever convidado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#103173]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all">
      <div className="bg-white rounded-[32px] w-full max-w-sm p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition-colors bg-slate-100 p-2 rounded-full">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-black text-[#103173] mb-2 tracking-tight">Convidado</h2>
        <p className="text-sm text-[#73AABF] font-medium mb-6 leading-relaxed">
          Você está usando sua prioridade de professor para adicionar um convidado à viagem.
        </p>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-xs font-black text-[#103173] uppercase tracking-wider ml-1">
              Nome Completo do Convidado
            </Label>
            <Input
              id="nome"
              value={nomeConvidado}
              onChange={(e) => setNomeConvidado(e.target.value)}
              placeholder="Ex: João da Silva"
              className="h-14 rounded-2xl bg-slate-50 border-slate-200 px-4 text-[#103173] font-medium focus-visible:ring-[#23B99A]"
              disabled={isSubmitting}
            />
            {erro && <p className="text-xs font-bold text-red-500 ml-1">{erro}</p>}
          </div>

          {/* <TripModeToggle 
            modalidadeAtual={modalidade} 
            onChange={setModalidade} 
          /> */}

          <Button
            className="w-full h-14 rounded-2xl bg-[#23B99A] hover:bg-[#1d9980] text-white font-black text-lg mt-4 shadow-lg shadow-[#23B99A]/30 transition-all"
            onClick={handleConfirmar}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Inscrevendo...
              </>
            ) : (
              "Confirmar Inscrição"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}