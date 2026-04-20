"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Button } from "@/components/ui/button";
import { RoleHeader } from "@/components/shared/role-header";
import { DevModeBar } from "@/components/shared/dev-mode-bar";
import { WeekDaysMenu } from "@/components/shared/week-days-menu";
import { CurrentDayHeader } from "@/components/shared/current-day-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TripRouteHeader } from "@/entities/viagem/ui/TripRouteHeader";
import { PassengerListInfo } from "@/entities/viagem/ui/PassengerListInfo";
import { GuestSubscribeButton } from "@/features/inscrever-convidado/ui/GuestSubscribeButton";

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
  ShieldAlert,
  Users
} from "lucide-react";
import { GuestSubscribeModal } from "@/features/inscrever-convidado/ui/GuestSubscribeModal";
import { TripCard } from "@/entities/viagem/ui/TripCard";
import { ManageSubscriptionButton } from "@/features/gerenciar-inscricao/ui/ManageSubscriptionButton";
import { TripModeToggle } from "@/entities/viagem/ui/TripModeToggle";
import { SubscribeButton } from "@/features/inscrever-rota/ui/SubscribeButton";

const VIAGENS_REQUISITOS = [
  { id: "1", dia: "segunda", origem: "Salvador", destino: "Feira de Santana", horarioInicio: "06:00", horarioFim: "08:00", inscritosAlunos: 15, inscritosProfessores: 3, vagasTotais: 44, jaInscrito: false },
  { id: "2", dia: "segunda", origem: "Feira de Santana", destino: "Salvador", horarioInicio: "18:30", horarioFim: "20:30", inscritosAlunos: 30, inscritosProfessores: 5, vagasTotais: 44, jaInscrito: true },
  { id: "3", dia: "terca", origem: "Salvador", destino: "Feira de Santana", horarioInicio: "06:00", horarioFim: "08:00", inscritosAlunos: 20, inscritosProfessores: 2, vagasTotais: 44, jaInscrito: false },
  { id: "4", dia: "terca", origem: "Feira de Santana", destino: "Salvador", horarioInicio: "18:30", horarioFim: "20:30", inscritosAlunos: 35, inscritosProfessores: 5, vagasTotais: 44, jaInscrito: false },
  { id: "5", dia: "quarta", origem: "Salvador", destino: "Feira de Santana", horarioInicio: "06:00", horarioFim: "08:00", inscritosAlunos: 12, inscritosProfessores: 3, vagasTotais: 44, jaInscrito: false },
  { id: "6", dia: "quarta", origem: "Feira de Santana", destino: "Salvador", horarioInicio: "18:30", horarioFim: "20:30", inscritosAlunos: 25, inscritosProfessores: 5, vagasTotais: 44, jaInscrito: false },
  { id: "7", dia: "quinta", origem: "Salvador", destino: "Feira de Santana", horarioInicio: "06:00", horarioFim: "08:00", inscritosAlunos: 40, inscritosProfessores: 4, vagasTotais: 44, jaInscrito: true },
  { id: "8", dia: "quinta", origem: "Feira de Santana", destino: "Salvador", horarioInicio: "18:30", horarioFim: "20:30", inscritosAlunos: 20, inscritosProfessores: 5, vagasTotais: 44, jaInscrito: false },
  { id: "9", dia: "sexta", origem: "Salvador", destino: "Feira de Santana", horarioInicio: "06:00", horarioFim: "08:00", inscritosAlunos: 30, inscritosProfessores: 8, vagasTotais: 44, jaInscrito: false },
  { id: "10", dia: "sexta", origem: "Feira de Santana", destino: "Salvador", horarioInicio: "18:30", horarioFim: "20:30", inscritosAlunos: 35, inscritosProfessores: 7, vagasTotais: 44, jaInscrito: true },
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
  const diaAtual = DIAS_SEMANA.find((d) => d.id === diaAtivo);
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

      <main className="flex-1 max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto w-full px-4 pt-10 pb-32">
         <RoleHeader
          icon={<GraduationCap className="h-4 w-4 text-[#103173]" />}
          portalName="Portal do Professor"
          title="Inscreva-se na sua rota"
          subtitle="Confira as viagens do dias."
          dateRange="(06/04 - 10/04)"
        />

      <div className="sticky top-0 z-20 bg-[#f0f4f8]/95 backdrop-blur-md">
        <WeekDaysMenu dias={DIAS_SEMANA} diaAtivo={diaAtivo} onDiaChange={setDiaAtivo} />
      </div>
       
        <CurrentDayHeader dayName={diaAtual?.full} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {viagensDoDia.map((viagem) => {
            const modalidadeAtual = modalidades[viagem.id] || "ida";

            return (
              <TripCard key={viagem.id}>
                
                <TripRouteHeader origem={viagem.origem} destino={viagem.destino} horarioInicio={viagem.horarioInicio} horarioFim={viagem.horarioFim} />

                <PassengerListInfo userType="professor" vagasTotais={viagem.vagasTotais} inscritosAlunos={viagem.inscritosAlunos} inscritosProfessores={viagem.inscritosProfessores} />

                <div className="flex flex-col gap-3">
                  {viagem.jaInscrito ? (
                    <ManageSubscriptionButton viagemId={viagem.id} />
                  ) : (
                    <div className="space-y-3">
                      <TripModeToggle modalidadeAtual={modalidadeAtual} onChange={(nova) => selecionarModalidade(viagem.id, nova)} />
                      <SubscribeButton viagemId={viagem.id} />
                    </div>
                  )}

                  <div className="w-full h-px bg-[#103173]/5 my-1" />

                  {/* O NOVO BOTÃO DE CONVIDADO */}
                  <GuestSubscribeButton onClick={() => setModalConvidado(viagem.id)} />
                </div>
              </TripCard>
            );
          })}
        </div>
      </main>

        {/* O NOVO MODAL NO FINAL DA PÁGINA */}
        <GuestSubscribeModal 
          viagemId={modalConvidado} 
          onClose={() => setModalConvidado(null)} 
        />

      <DevModeBar />
      <FooterSection />
    </div>
  );
}