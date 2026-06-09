import { Suspense } from "react";
import { ConfirmacaoInscricaoScreen } from "@/components/passageiro/screens/confirmacao-inscricao-screen";

export default function ConfirmacaoInscricaoPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#E4F2F1]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#103173]"></div></div>}>
      <ConfirmacaoInscricaoScreen />
    </Suspense>
  );
}