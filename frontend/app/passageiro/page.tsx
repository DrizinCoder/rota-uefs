"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  ArrowRight,
  Bus,
  User,
  UserCircle,
  ShieldAlert,
  Ticket,
  CircleDot,
  GraduationCap,
  Users
} from "lucide-react";

// Dados mock atualizados
const VIAGENS_REQUISITOS = [
  { id: "1", dia: "segunda", origem: "Salvador", destino: "Feira de Santana", horarioInicio: "06:00", horarioFim: "08:00", inscritosAlunos: 15, inscritosProfessores: 3, quorum: 20, vagasTotais: 44, jaInscrito: false },
  { id: "2", dia: "segunda", origem: "Feira de Santana", destino: "Salvador", horarioInicio: "18:30", horarioFim: "20:30", inscritosAlunos: 30, inscritosProfessores: 5, quorum: 20, vagasTotais: 44, jaInscrito: true },
  { id: "3", dia: "terca", origem: "Salvador", destino: "Feira de Santana", horarioInicio: "07:00", horarioFim: "09:00", inscritosAlunos: 8, inscritosProfessores: 2, quorum: 20, vagasTotais: 44, jaInscrito: false },
];

const DIAS_SEMANA = [
  { id: "segunda", label: "Seg", full: "Segunda-feira" },
  { id: "terca", label: "Ter", full: "Terça-feira" },
  { id: "quarta", label: "Qua", full: "Quarta-feira" },
  { id: "quinta", label: "Qui", full: "Quinta-feira" },
  { id: "sexta", label: "Sex", full: "Sexta-feira" },
];

export default function PaginaAluno() {
  const router = useRouter();
  const [diaAtivo, setDiaAtivo] = useState("segunda");
  // Estado para armazenar a modalidade escolhida para cada card de viagem
  const [modalidades, setModalidades] = useState<Record<string, "ida" | "ida-volta">>({});

  const viagensDoDia = VIAGENS_REQUISITOS.filter((v) => v.dia === diaAtivo);
  const diaAtual = DIAS_SEMANA.find((d) => d.id === diaAtivo);

  const selecionarModalidade = (viagemId: string, modalidade: "ida" | "ida-volta") => {
    setModalidades(prev => ({ ...prev, [viagemId]: modalidade }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f4f8]">
      <div className="bg-[#103173] relative overflow-hidden">
        <Navigation tipoUsuario="aluno" />
      </div>

      <div className="flex-1 max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto w-full px-4 pt-10 pb-32">
        <header className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="h-4 w-4 text-[#103173]" />
              <span className="text-[11px] font-bold text-[#103173] uppercase tracking-widest">
                Portal do Aluno 
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#103173] tracking-tight">
              Inscreva-se na sua rota
            </h1>
            <p className="text-[#73AABF] text-sm mt-1 mb-1 font-medium">
              Confira as viagens do dias.
            </p>
            <span className="text-[15px] font-bold text-[#103173] uppercase tracking-widest">
              (06/04 - 10/04)
            </span> 
        </header>
        <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            {DIAS_SEMANA.map((dia) => (
              <button
                key={dia.id}
                onClick={() => setDiaAtivo(dia.id)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 relative ${dia.id === diaAtivo ? "bg-[#103173] text-white shadow-lg" : "bg-white text-[#103173]/70 border border-[#103173]/8"}`}
              >
                {dia.label}
              </button>
            ))}
          </div>
        </div>
      
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-[#103173]/40 uppercase tracking-widest">{diaAtual?.full}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {viagensDoDia.map((viagem) => {
            const totalInscritos = viagem.inscritosAlunos + viagem.inscritosProfessores;
            const modalidadeAtual = modalidades[viagem.id] || "ida"; // Default é 'ida'

            return (
              <div key={viagem.id} className="bg-white rounded-2xl overflow-hidden shadow-sm p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex flex-col items-center pt-0.5 shrink-0">
                    <CircleDot className="h-4 w-4 text-[#F2D022]" />
                    <div className="w-px h-6 bg-gradient-to-b from-[#F2D022] to-[#103173] my-0.5" />
                    <MapPin className="h-4 w-4 text-[#103173]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-base font-extrabold text-[#103173]">{viagem.origem}</p>
                      <span className="text-[11px] font-bold text-[#103173]/50">{viagem.horarioInicio}</span>
                    </div>
                    <div className="flex justify-between mt-3">
                      <p className="text-base font-extrabold text-[#103173]">{viagem.destino}</p>
                      <span className="text-[11px] font-bold text-[#103173]/50">{viagem.horarioFim}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f0f4f8] rounded-xl p-3 mb-4">
                  <p className="text-[10px] font-bold text-[#103173]/60 uppercase tracking-wider mb-2">Lista ({totalInscritos}/{viagem.vagasTotais})</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#73AABF]" />
                      <span className="text-sm font-semibold text-[#103173]">{viagem.inscritosAlunos} Alunos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-[#F2D022]/20 text-[#b8960a] px-2 py-0.5 rounded font-bold">PRIORIDADE</span>
                      <GraduationCap className="w-4 h-4 text-[#F2D022]" />
                      <span className="text-sm font-semibold text-[#103173]">{viagem.inscritosProfessores} Profs</span>
                    </div>
                  </div>
                </div>

                {viagem.jaInscrito ? (
                  <button onClick={() => router.push("/passageiro/status")} className="w-full py-3 rounded-xl text-sm font-bold bg-[#103173]/5 text-[#103173] flex items-center justify-center gap-2 hover:bg-[#103173]/10 transition-colors">
                    Ver minha inscrição <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="space-y-3">
                    {/* Botões de Seleção de Modalidade */}
                    <div>
                      <label className="text-[10px] font-bold text-[#103173]/60 uppercase tracking-wider mb-1.5 block">Modalidade da Viagem</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => selecionarModalidade(viagem.id, "ida")}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${modalidadeAtual === "ida" ? "bg-[#103173] text-white shadow-md" : "bg-white border border-[#103173]/10 text-[#103173] hover:bg-[#103173]/5"}`}
                        >
                          Apenas Ida
                        </button>
                        <button
                          onClick={() => selecionarModalidade(viagem.id, "ida-volta")}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${modalidadeAtual === "ida-volta" ? "bg-[#103173] text-white shadow-md" : "bg-white border border-[#103173]/10 text-[#103173] hover:bg-[#103173]/5"}`}
                        >
                          Ida e Volta
                        </button>
                      </div>
                    </div>

                    <button onClick={() => router.push("/passageiro/confirmacao")} className="w-full py-3.5 rounded-xl text-sm font-extrabold bg-[#103173] text-white shadow-lg flex items-center justify-center gap-2 hover:bg-[#0d2a63] transition-colors">
                      <Ticket className="h-4 w-4" /> Inscrever-se nesta rota
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dev Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#103173] text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-4 z-50 border border-[#F2D022]/20 backdrop-blur-md w-[90%] md:w-auto overflow-x-auto">
        <div className="flex flex-col border-r border-white/15 pr-3 shrink-0">
          <span className="text-[8px] font-extrabold uppercase text-[#F2D022] tracking-tight">Dev</span>
          <span className="text-[10px] font-bold text-white/70">Perfis</span>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" className="hover:bg-white/10 text-white gap-1.5 font-bold text-xs h-8 px-2.5 shrink-0" onClick={() => router.push("/passageiro")}>
            <UserCircle className="h-3.5 w-3.5" /> Passageiro
          </Button>
          <Button size="sm" variant="ghost" className="hover:bg-white/10 text-white gap-1.5 font-bold text-xs h-8 px-2.5 shrink-0" onClick={() => router.push("/professor")}>
            <GraduationCap className="h-3.5 w-3.5" /> Professor
          </Button>
          <Button size="sm" variant="ghost" className="hover:bg-[#F2D022] hover:text-[#103173] text-white gap-1.5 font-bold text-xs h-8 px-2.5 transition-colors shrink-0" onClick={() => router.push("/motorista")}>
            <Bus className="h-3.5 w-3.5" /> Motorista
          </Button>
          <Button size="sm" variant="ghost" className="hover:bg-red-500 hover:text-white text-white gap-1.5 font-bold text-xs h-8 px-2.5 transition-colors shrink-0" onClick={() => router.push("/admin")}>
            <ShieldAlert className="h-3.5 w-3.5" /> Admin
          </Button>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}