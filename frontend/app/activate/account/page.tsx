import { Spinner } from "@/components/ui/spinner";

export default function ActivateAccountPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] items-center justify-center p-4">
      <Spinner className="h-16 w-16 text-[#103173]" />
      <p className="mt-6 text-[#103173] font-black text-sm uppercase tracking-widest animate-pulse">
        Carregando...
      </p>
    </div>
  );
}
