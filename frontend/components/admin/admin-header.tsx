import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AdminHeaderProps {
  onNovoOnibus: () => void;
}

export function AdminHeader({ onNovoOnibus }: AdminHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3 tracking-tight">
          Gestão de Onibus
        </h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">
          Visão geral e controle operacional da frota.
        </p>
      </div>

      <Button
        className="h-10 bg-[#23B99A] hover:bg-[#1d957c] text-white font-semibold shadow-sm transition-all w-full sm:w-auto rounded-lg"
        onClick={onNovoOnibus}
      >
        <Plus className="h-4 w-4 mr-2" /> Novo Ônibus
      </Button>
    </header>
  );
}
