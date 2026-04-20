import { LifeBuoy } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";

export function EmergencyButton() {
  return (
    <DialogTrigger asChild>
      <button 
        type="button"
        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full border border-red-100 hover:bg-red-100 transition-colors shadow-sm md:mb-0 mb-6 shrink-0"
      >
        <LifeBuoy className="h-4 w-4" />
        <span className="text-xs font-bold uppercase tracking-wider">
          Ajuda e Emergência
        </span>
      </button>
    </DialogTrigger>
  );
}