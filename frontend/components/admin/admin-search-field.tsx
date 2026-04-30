"use client";

import { Search } from "lucide-react";

type AdminSearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  marginBottom?: "mb-6" | "mb-8";
};

export function AdminSearchField({
  value,
  onChange,
  placeholder,
  className = "",
  marginBottom = "mb-6",
}: AdminSearchFieldProps) {
  return (
    <div
      className={`bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center ${marginBottom} ${className}`}
    >
      <Search className="h-5 w-5 text-slate-400 ml-3 mr-2 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none focus:outline-none text-[#103173] placeholder:text-slate-400 text-sm py-2"
      />
    </div>
  );
}
