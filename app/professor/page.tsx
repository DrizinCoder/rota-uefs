"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Bus,
  User,
  Ticket,
  CircleDot,
  GraduationCap,
  UserPlus,
  X,
  UserCircle,
  ShieldAlert
} from "lucide-react";

const VIAGENS_REQUISITOS = [
  { id: "1", dia: "segunda", origem: "Salvador", destino: "Feira de Santana", horarioInicio: "06:00", horarioFim: "08:00", inscritos: 18, vagasTotais: 44, jaInscrito: false },
  { id: "2", dia: "segunda", origem: "Feira de Santana", destino: "Salvador", horarioInicio: "18:30", horarioFim: "20:30", inscritos: 35, vagasTotais: 44, jaInscrito: true },
  { id: "3", dia: "terca", origem: "Salvador", destino: "Feira de Santana", horarioInicio: "06:00", horarioFim: "08:00", inscritos: 22, vagasTotais: 44, jaInscrito: false },
  { id: "4", dia: "terca", origem: "Feira de Santana", destino: "Salvador", horarioInicio: "18:30", horarioFim: "20:30", inscritos: 40, vagasTotais: 44, jaInscrito: false },
  { id: "5", dia: "quarta", origem: "Salvador", destino: "Feira de Santana", horarioInicio: "06:00", horarioFim: "08:00", inscritos: 15, vagasTotais: 44, jaInscrito: false },
  { id: "6", dia: "quarta", origem: "Feira de Santana", destino: "Salvador", horarioInicio: "18:30", horarioFim: "20:30", inscritos: 30, vagasTotais: 44, jaInscrito: false },
  { id: "7", dia: "quinta", origem: "Salvador", destino: "Feira de Santana", horarioInicio: "06:00", horarioFim: "08:00", inscritos: 44, vagasTotais: 44, jaInscrito: true },
  { id: "8", dia: "quinta", origem: "Feira de Santana", destino: "Salvador", horarioInicio: "18:30", horarioFim: "20:30", inscritos: 25, vagasTotais: 44, jaInscrito: false },
  { id: "9", dia: "sexta", origem: "Salvador", destino: "Feira de Santana", horarioInicio: "06:00", horarioFim: "08:00", inscritos: 38, vagasTotais: 44, jaInscrito: false },
  { id: "10", dia: "sexta", origem: "Feira de Santana", destino: "Salvador", horarioInicio: "18:30", horarioFim: "20:30", inscritos: 42, vagasTotais: 44, jaInscrito: true },
];

const DIAS_SEMANA = [
  { id: "segunda", label: "Seg", full: "Segunda-feira" },
  { id: "terca", label: "Ter", full: "Terça-feira" },
  { id: "quarta", label: "Qua", full: "Quarta-feira" },
  { id: "quinta", label: "Qui", full: "Quinta-feira" },
  { id: "sexta", label: "Sex", full: "Sexta-feira" },
];

export default function PaginaProfessor() {
  const router = useRouter();
  const [diaAtivo, setDiaAtivo] = useState("segunda");
  const [modalConvidado, setModalConvidado] = useState<string | null>(null);

  // Estado para os botões de modalidade da viagem principal e do convidado
  const [modalidades, setModalidades] = useState<Record<string, "ida" | "ida-volta">>({});
  const [modalidadeConvidado, setModalidadeConvidado] = useState<"ida" | "ida-volta">("ida");

  const viagensDoDia = VIAGENS_REQUISITOS.filter((v) => v.dia === diaAtivo);

  const selecionarModalidade = (viagemId: string, modalidade: "ida" | "ida-volta") => {
    setModalidades(prev => ({ ...prev, [viagemId]: modalidade }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f4f8]">
      <div className="bg-[#103173] relative overflow-hidden">
        <Navigation tipoUsuario="professor" />

        
      </div>

      <main className="flex-1 max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto w-full px-4 pt-5 pb-32">
         <header className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="h-4 w-4 text-[#103173]" />
              <span className="text-[11px] font-bold text-[#103173] uppercase tracking-widest">
                Portal do Professor (Prioridade) 
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

      <div className="sticky top-0 z-20 bg-[#f0f4f8]/95 backdrop-blur-md border-b border-[#103173]/5">
        <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4 py-3 flex gap-2">
          {DIAS_SEMANA.map((dia) => (
            <button
              key={dia.id}
              onClick={() => setDiaAtivo(dia.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold uppercase transition-all duration-200 ${dia.id === diaAtivo ? "bg-[#103173] text-white shadow-lg" : "bg-white text-[#103173]/70"}`}
            >
              {dia.label}
            </button>
          ))}
          </div>
        </div>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {viagensDoDia.map((viagem) => {
            const modalidadeAtual = modalidades[viagem.id] || "ida";

            return (
              <div key={viagem.id} className="bg-white rounded-2xl overflow-hidden shadow-sm p-4">
                <div className="flex items-start gap-3 mb-6">
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

                <div className="flex flex-col gap-3">
                  {viagem.jaInscrito ? (
                    <Button variant="outline" className="w-full text-[#103173] border-[#103173]/20" onClick={() => router.push("/passageiro/status")}>
                      Ver minha inscrição
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => selecionarModalidade(viagem.id, "ida")}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${modalidadeAtual === "ida" ? "bg-[#103173] text-white shadow-md" : "bg-[#f0f4f8] text-[#103173]/60 hover:bg-[#103173]/5"}`}
                        >
                          Apenas Ida
                        </button>
                        <button
                          onClick={() => selecionarModalidade(viagem.id, "ida-volta")}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${modalidadeAtual === "ida-volta" ? "bg-[#103173] text-white shadow-md" : "bg-[#f0f4f8] text-[#103173]/60 hover:bg-[#103173]/5"}`}
                        >
                          Ida e Volta
                        </button>
                      </div>

                      <Button className="w-full bg-[#103173] text-white hover:bg-[#0d2a63]">
                        <Ticket className="h-4 w-4 mr-2" /> Inscrever-me
                      </Button>
                    </div>
                  )}

                  <div className="w-full h-px bg-[#103173]/5 my-1" />

                  <Button
                    variant="secondary"
                    className="w-full bg-[#F2D022]/10 text-[#b8960a] hover:bg-[#F2D022]/20 font-bold"
                    onClick={() => {
                      setModalidadeConvidado("ida"); // Reseta para 'ida' ao abrir
                      setModalConvidado(viagem.id);
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" /> Inscrever Convidado
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Modal de Inscrição de Terceiros */}
      {modalConvidado && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
            <button onClick={() => setModalConvidado(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-lg font-extrabold text-[#103173] mb-1">Inscrever Convidado</h2>
            <p className="text-xs text-gray-500 mb-5">Você está usando sua prioridade para adicionar alguém à lista.</p>

            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="nome" className="text-xs font-bold text-[#103173]">Nome do Convidado</Label>
                <Input id="nome" placeholder="Digite o nome completo" />
              </div>

              {/* Toggle de Modalidade no Convidado */}
              <div className="space-y-1">
                <Label className="text-xs font-bold text-[#103173]">Modalidade da Viagem</Label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setModalidadeConvidado("ida")}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${modalidadeConvidado === "ida" ? "bg-[#103173] text-white shadow-md" : "bg-[#f0f4f8] text-[#103173]/60 hover:bg-[#103173]/5"}`}
                  >
                    Apenas Ida
                  </button>
                  <button
                    onClick={() => setModalidadeConvidado("ida-volta")}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${modalidadeConvidado === "ida-volta" ? "bg-[#103173] text-white shadow-md" : "bg-[#f0f4f8] text-[#103173]/60 hover:bg-[#103173]/5"}`}
                  >
                    Ida e Volta
                  </button>
                </div>
              </div>

              <Button
                className="w-full bg-[#23B99A] hover:bg-[#1d9980] text-white font-bold mt-2"
                onClick={() => { alert("Convidado inscrito com sucesso!"); setModalConvidado(null); }}
              >
                Confirmar Inscrição
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dev Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#103173] text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-4 z-40 border border-[#F2D022]/20 backdrop-blur-md w-[90%] md:w-auto overflow-x-auto">
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
    </div>
  );
}