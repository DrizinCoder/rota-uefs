import { AlertTriangle } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";

export function EmergencyButton() {
  return (
    <DialogTrigger asChild>
      <button 
        type="button" 
        className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-4 mb-2 md:mb-2 bg-red-50 text-red-600 rounded-xl border border-red-100 hover:bg-red-100 transition-colors shadow-sm shrink-0"
      >
        <AlertTriangle className="h-4 w-4" />
        <span className="text-xs font-bold uppercase tracking-wider">
          Ajuda e Emergência
        </span>
      </button>
    </DialogTrigger>
  );
}