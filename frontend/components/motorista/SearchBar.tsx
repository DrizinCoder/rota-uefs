import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Buscar por nome ou tipo..." }: SearchBarProps) {
  return (
    <div className="relative flex-1 shadow-sm rounded-2xl">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-[#73AABF]" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 h-14 bg-white border-none rounded-2xl text-[#103173] font-bold focus-visible:ring-2 focus-visible:ring-[#F2D022] shadow-sm w-full"
      />
    </div>
  );
}