import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Buscar por nome ou tipo..." }: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-[#73AABF]" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-11 h-12 bg-white border border-slate-200 rounded-xl text-[#103173] font-semibold text-sm focus-visible:ring-2 focus-visible:ring-[#103173]/20 focus-visible:border-[#103173]/30 shadow-none placeholder:text-slate-300 w-full transition-all"
      />
    </div>
  );
}