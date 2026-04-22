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
import { EmergencyDialog } from "@/features/ajuda-emergencia/ui/EmergencyDialog";
import { EmergencyButton } from "@/features/ajuda-emergencia/ui/EmergencyButton";
import { TripCard } from "@/entities/viagem/ui/TripCard";
import { TripIdHeader } from "@/entities/viagem/ui/TripIdHeader";
import { PassengerListInfo } from "@/entities/viagem/ui/PassengerListInfo";
import { CheckinButton } from "@/features/fazer-checkin/ui/CheckinButton";
import { StartTripButton } from "@/features/iniciar-viagem/ui/StartTripButton";
import { TripRouteHeader } from "@/entities/viagem/ui/TripRouteHeader";


import {
  MapPin,
  CircleDot,
  Bus,
  CalendarDays
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


// Dados simulados atualizados para testar o filtro de dias
const VIAGENS = [
  {
    id: "VG-0042",
    origem: "Salvador",
    destino: "Feira de Santana",
    horarioPartida: "08:30",
    horarioChegada: "10:30",
    passageirosConfirmados: 38,
    vagasTotais: 44,
    dia: "Segunda-feira",
    statusInicial: "pronta",
  },
  {
    id: "VG-0043",
    origem: "Feira de Santana",
    destino: "Salvador",
    horarioPartida: "18:00",
    horarioChegada: "19:40",
    passageirosConfirmados: 42,
    vagasTotais: 44,
    dia: "Segunda-feira",
    statusInicial: "bloqueada",
  },
  {
    id: "VG-0044",
    origem: "Salvador",
    destino: "Camaçari",
    horarioPartida: "07:00",
    horarioChegada: "08:15",
    passageirosConfirmados: 25,
    vagasTotais: 44,
    dia: "Terça-feira",
    statusInicial: "bloqueada",
  },
];

// Dias da semana simulados para o filtro (Seg a Sex)
const DIAS_SEMANA = [
  { id: "segunda", label: "Seg", full: "Segunda-feira" },
  { id: "terca", label: "Ter", full: "Terça-feira" },
  { id: "quarta", label: "Qua", full: "Quarta-feira" },
  { id: "quinta", label: "Qui", full: "Quinta-feira" },
  { id: "sexta", label: "Sex", full: "Sexta-feira" },
];


function CentralSuporte() {
  return (
    <Dialog>
        <EmergencyButton />
        <EmergencyDialog />
      </Dialog>
  );
}

function ViagemCard({ viagem }: { viagem: (typeof VIAGENS)[0] }) {
  const router = useRouter();
  const [statusViagem, setStatusViagem] = useState<
    "bloqueada" | "pronta" | "em_curso" | "finalizada"
  >(viagem.statusInicial as any);

  const handleCheckIn = () => {
    router.push("/motorista/embarque");
  };

  const handleAcaoViagem = () => {
    if (statusViagem === "pronta") {
      setStatusViagem("em_curso");
    } else if (statusViagem === "em_curso") {
      setStatusViagem("finalizada");
    }
  };

  return (
    <TripCard className="p-0 shadow-[0_1px_3px_rgba(16,49,115,0.06),0_8px_24px_rgba(16,49,115,0.04)] mb-6">
      <div className="bg-[#103173]/5 pt-3 px-3">
        <TripIdHeader id={viagem.id} diaSemana={viagem.dia} />
      </div>

      <div className="px-5 pt-2 pb-5">

        <TripRouteHeader origem={viagem.origem} destino={viagem.destino} horarioInicio={viagem.horarioPartida} horarioFim={viagem.horarioChegada} />

        <PassengerListInfo 
          userType="motorista" 
          vagasTotais={viagem.vagasTotais} 
          inscritosAlunos={viagem.passageirosConfirmados}
          inscritosProfessores={0} 
        />

        <div className="flex flex-col gap-3">
          {statusViagem !== "finalizada" && (
            <CheckinButton 
              viagemId={viagem.id} 
              onClick={handleCheckIn} 
              className="py-10 rounded-2xl text-lg font-extrabold"
            />
          )}
          <StartTripButton 
            status={statusViagem} 
            onClick={handleAcaoViagem} 
            className="py-8 rounded-2xl text-lg font-extrabold "
          />
        </div>
      </div>
    </TripCard>
  );
}

export default function MotoristaPage() {
  const router = useRouter();
  const [diaAtivo, setDiaAtivo] = useState("segunda");
  const diaAtual = DIAS_SEMANA.find((d) => d.id === diaAtivo);

  // Filtra as viagens para mostrar apenas as do dia selecionado
  const viagensFiltradas = VIAGENS.filter((viagem) => viagem.dia === diaAtual?.full);

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f8]">
      <Navigation tipoUsuario="motorista" />

      <main className="flex-1 max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto w-full px-4 pt-10 pb-32">
        <RoleHeader
          icon={<Bus className="h-4 w-4 text-[#103173]" />}
          portalName="Painel do Motorista"
          title="Suas escalas"
          subtitle="Selecione o dia da semana para ver as viagens agendadas."
          dateRange="(06/04 - 10/04)"
          rightContent={<CentralSuporte />}
        />

        {/* Seletor de Dias da Semana */}
        <WeekDaysMenu 
          dias={DIAS_SEMANA} 
          diaAtivo={diaAtivo} 
          onDiaChange={setDiaAtivo} 
        />

        <CurrentDayHeader dayName={diaAtual?.full} />

        {/* Lista de Viagens do Dia Selecionado */}
        {viagensFiltradas.length > 0 ? (
          viagensFiltradas.map((viagem) => (
            <ViagemCard key={viagem.id} viagem={viagem} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
            <CalendarDays className="h-10 w-10 text-slate-300 mb-3" />
            <p className="text-[#103173] font-bold">Nenhuma escala para este dia</p>
            <p className="text-slate-500 text-sm mt-1">Você está livre de viagens na {diaAtual?.full.toLowerCase()}.</p>
          </div>
        )}
      </main>

      <FooterSection />

      <DevModeBar />
    </div>
  );
}