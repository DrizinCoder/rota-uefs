import { Users, GraduationCap } from "lucide-react";

interface PassengerListInfoProps {
  userType: "aluno" | "professor" | "motorista";
  vagasTotais: number;
  inscritosAlunos: number;
  inscritosProfessores: number;
   totalInscritos: number;
}

export function PassengerListInfo({ userType, vagasTotais, inscritosAlunos, inscritosProfessores,  totalInscritos}: PassengerListInfoProps) {

  if (userType === "professor") {
    return (
      <div className="bg-[#f0f4f8] rounded-xl p-3 mb-4 flex items-center justify-between">
        <p className="text-[10px] font-bold text-[#103173]/60 uppercase tracking-wider">Lista ({inscritosProfessores}/{vagasTotais})</p>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-[#F2D022]" />
          <span className="text-sm font-semibold text-[#103173]">{inscritosProfessores} Professores</span>
        </div>
      </div>
    );
  }if (userType === "motorista") {
    return (
      <div className="bg-[#f0f4f8] rounded-xl p-3 mb-4 flex items-center gap-4">
        <Users className="w-5 h-5 text-slate-400" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Passageiros
          </span>
          <span className="text-base font-extrabold text-[#103173]">
            {totalInscritos} <span className="font-normal text-slate-400">/ {vagasTotais}</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    // Exatamente o seu código do Aluno
    <div className="bg-[#f0f4f8] rounded-xl p-3 mb-4">
      <p className="text-[10px] font-bold text-[#103173]/60 uppercase tracking-wider mb-2">Lista ({totalInscritos}/{vagasTotais})</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#73AABF]" />
          <span className="text-sm font-semibold text-[#103173]">{inscritosAlunos} Alunos</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#F2D022]/20 text-[#b8960a] px-2 py-0.5 rounded font-bold">PRIORIDADE</span>
          <GraduationCap className="w-4 h-4 text-[#F2D022]" />
          <span className="text-sm font-semibold text-[#103173]">{inscritosProfessores} Profs</span>
        </div>
      </div>
    </div>
  );
}