import { Users, GraduationCap } from "lucide-react";

interface PassengerListInfoProps {
  userType: "aluno" | "professor" | "motorista";
  vagasTotais: number;
  inscritosAlunos: number;
  inscritosProfessores: number;
  totalInscritos: number;
}

export function PassengerListInfo({ userType, vagasTotais, inscritosAlunos, inscritosProfessores,  totalInscritos}: PassengerListInfoProps) {
  const percentOcupacao = vagasTotais > 0 ? Math.min((totalInscritos / vagasTotais) * 100, 100) : 0;
  const barColor = percentOcupacao >= 90 ? "bg-red-400" : percentOcupacao >= 70 ? "bg-amber-400" : "bg-emerald-400";

  if (userType === "professor") {
    return (
      <div className="bg-[#f0f4f8] rounded-xl p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold text-[#73AABF] uppercase tracking-wider">Ocupação</p>
          <span className="text-[11px] font-extrabold text-[#103173]">{inscritosProfessores}/{vagasTotais}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2.5">
          <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${percentOcupacao}%` }} />
        </div>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-[#F2D022]" />
          <span className="text-sm font-semibold text-[#103173]/70">{inscritosProfessores} Professores</span>
        </div>
      </div>
    );
  }

  if (userType === "motorista") {
    return (
      <div className="bg-[#f0f4f8] rounded-xl p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#73AABF]" />
            <span className="text-[10px] font-bold text-[#73AABF] uppercase tracking-wider">Passageiros</span>
          </div>
          <span className="text-[11px] font-extrabold text-[#103173]">{totalInscritos}/{vagasTotais}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${percentOcupacao}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f0f4f8] rounded-xl p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold text-[#73AABF] uppercase tracking-wider">Ocupação</p>
        <span className="text-[11px] font-extrabold text-[#103173]">{totalInscritos}/{vagasTotais}</span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2.5">
        <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${percentOcupacao}%` }} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#73AABF]" />
          <span className="text-sm font-semibold text-[#103173]/70">{inscritosAlunos} Alunos</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#F2D022]/15 text-[#b8960a] px-2 py-0.5 rounded-full font-bold">PRIORIDADE</span>
          <GraduationCap className="w-4 h-4 text-[#F2D022]" />
          <span className="text-sm font-semibold text-[#103173]/70">{inscritosProfessores} Profs</span>
        </div>
      </div>
    </div>
  );
}