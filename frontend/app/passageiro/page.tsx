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
import { TripCard } from "@/entities/viagem/ui/TripCard";
import { TripRouteHeader } from "@/entities/viagem/ui/TripRouteHeader";
import { PassengerListInfo } from "@/entities/viagem/ui/PassengerListInfo";
import { TripModeToggle } from "@/entities/viagem/ui/TripModeToggle";
import { ManageSubscriptionButton } from "@/features/gerenciar-inscricao/ui/ManageSubscriptionButton";
import { SubscribeButton } from "@/features/inscrever-rota/ui/SubscribeButton";

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
  const diaAtual = DIAS_SEMANA.find((d) => d.id === diaAtivo);

  // Estado para armazenar a modalidade escolhida para cada card de viagem
  const [modalidades, setModalidades] = useState<Record<string, "ida" | "ida-volta">>({});

  const viagensDoDia = VIAGENS_REQUISITOS.filter((v) => v.dia === diaAtivo);
  

  const selecionarModalidade = (viagemId: string, modalidade: "ida" | "ida-volta") => {
    setModalidades(prev => ({ ...prev, [viagemId]: modalidade }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f4f8]">
      <div className="bg-[#103173] relative overflow-hidden">
        <Navigation tipoUsuario="aluno" />
      </div>

      <div className="flex-1 max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto w-full px-4 pt-10 pb-32">
        <RoleHeader
          icon={<GraduationCap className="h-4 w-4 text-[#103173]" />}
          portalName="Portal do Aluno"
          title="Inscreva-se na sua rota"
          subtitle="Confira as viagens da semana."
          dateRange="(06/04 - 10/04)"
        />
        <WeekDaysMenu dias={DIAS_SEMANA} diaAtivo={diaAtivo} onDiaChange={setDiaAtivo} />
      
        <CurrentDayHeader dayName={diaAtual?.full} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {viagensDoDia.map((viagem) => {
            const modalidadeAtual = modalidades[viagem.id] || "ida";

            return (
              <TripCard key={viagem.id}>
                <TripRouteHeader 
                  origem={viagem.origem} 
                  destino={viagem.destino} 
                  horarioInicio={viagem.horarioInicio} 
                  horarioFim={viagem.horarioFim} 
                />

                <PassengerListInfo 
                  userType="aluno"
                  vagasTotais={viagem.vagasTotais}
                  inscritosAlunos={viagem.inscritosAlunos}
                  inscritosProfessores={viagem.inscritosProfessores}
                />

                {viagem.jaInscrito ? (
                  
                  <ManageSubscriptionButton viagemId={viagem.id} />
                  
                ) : (
                  <div className="space-y-3">
                    
                    <TripModeToggle 
                      modalidadeAtual={modalidadeAtual} 
                      onChange={(nova) => selecionarModalidade(viagem.id, nova)} 
                    />

                    <SubscribeButton viagemId={viagem.id} />
                    
                  </div>
                )}
              </TripCard>
            );
          })}
        </div>
      </div>
      <DevModeBar />
      <FooterSection />
    </div>
  );
}