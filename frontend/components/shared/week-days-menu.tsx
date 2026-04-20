import React from "react";

export interface DiaSemana {
  id: string;
  label: string;
  full?: string;
}

interface WeekDaysMenuProps {
  dias: DiaSemana[];
  diaAtivo: string;
  onDiaChange: (id: string) => void;
}

export function WeekDaysMenu({ dias, diaAtivo, onDiaChange }: WeekDaysMenuProps) {
  return (
    <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4 py-3">
      <div className="flex gap-2">
        {dias.map((dia) => (
          <button
            key={dia.id}
            onClick={() => onDiaChange(dia.id)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 relative ${
              dia.id === diaAtivo
                ? "bg-[#103173] text-white shadow-lg"
                : "bg-white text-[#103173]/70 border border-[#103173]/8"
            }`}
          >
            {dia.label}
          </button>
        ))}
      </div>
    </div>
  );
}
