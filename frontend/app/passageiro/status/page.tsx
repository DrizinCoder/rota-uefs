import { Suspense } from "react";
import { StatusViagemScreen } from "@/components/passageiro/screens/status-viagem-screen";

export default function StatusViagemInscritaPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#E4F2F1]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#103173]"></div></div>}>
      <StatusViagemScreen />
    </Suspense>
  );
}