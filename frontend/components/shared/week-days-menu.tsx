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
    <div className="max-w-lg md:max-w-3xl mt-2.5 lg:max-w-5xl mx-auto px-0 py-0">
      <div className="flex gap-2">
        {dias.map((dia) => (
          <button
            key={dia.id}
            onClick={() => onDiaChange(dia.id)}
            className={`flex-1 py-4 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 relative ${
              dia.id === diaAtivo
                ? "bg-[#103173] text-white shadow-lg"
                : "bg-white text-[#103173]/70"
            }`}
          >
            {dia.label}
          </button>
        ))}
      </div>
    </div>
  );
}
