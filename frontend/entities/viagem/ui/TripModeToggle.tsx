interface TripModeToggleProps {
  modalidadeAtual: "ida" | "ida-volta";
  onChange: (novaModalidade: "ida" | "ida-volta") => void;
}

export function TripModeToggle({ modalidadeAtual, onChange }: TripModeToggleProps) {
  return (
    <div>
      <label className="text-[10px] font-bold text-[#103173]/60 uppercase tracking-wider mb-1.5 block">
        Modalidade da Viagem
      </label>
      <div className="flex gap-2">
        <button
          onClick={() => onChange("ida")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            modalidadeAtual === "ida"
              ? "bg-[#103173] text-white shadow-md"
              : "bg-[#f0f4f8] text-[#103173]/60 hover:bg-[#e2e8f0] hover:text-[#103173]"
          }`}
        >
          Apenas Ida
        </button>
        <button
          onClick={() => onChange("ida-volta")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            modalidadeAtual === "ida-volta"
              ? "bg-[#103173] text-white shadow-md"
              : "bg-[#f0f4f8] text-[#103173]/60 hover:bg-[#e2e8f0] hover:text-[#103173]"
          }`}
        >
          Ida e Volta
        </button>
      </div>
    </div>
  );
}