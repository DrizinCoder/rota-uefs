"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { RoleHeader } from "@/components/shared/role-header";
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
import { passengerService, type Home, type CardViagemFeed} from "@/services/homeService";

import {
  Bus,
} from "lucide-react";
import {
  Dialog,
} from "@/components/ui/dialog";
import { EmptyDayCard } from "@/components/shared/empty-day-card";

const DIAS_SEMANA = [
  { id: "Segunda", label: "Seg", full: "Segunda-feira" },
  { id: "Terça", label: "Ter", full: "Terça-feira" },
  { id: "Quarta", label: "Qua", full: "Quarta-feira" },
  { id: "Quinta", label: "Qui", full: "Quinta-feira" },
  { id: "Sexta", label: "Sex", full: "Sexta-feira" },
];

const traduzirDia = (weekday: string) =>
  DIAS_SEMANA.find((d) => d.id === weekday)?.full ?? weekday;

function CentralSuporte() {
  return (
    <Dialog>
        <EmergencyButton />
        <EmergencyDialog />
      </Dialog>
  );
}

function ViagemCard({ viagem }: { viagem: CardViagemFeed }) {
  const router = useRouter();
  const [statusViagem, setStatusViagem] = useState <"bloqueada" | "pronta" | "em_curso" | "finalizada">("pronta");

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
        <TripIdHeader 
          id={viagem.trip_id} 
          diaSemana={traduzirDia(viagem.weekday)} 
          status={statusViagem} 
        />
      </div>

      <div className="px-5 pt-2 pb-5">

        <TripRouteHeader origem={viagem.boarding_point} destino={viagem.drop_off_point} horarioInicio={formatarHorario(viagem.departure_time)} />

        <PassengerListInfo 
          userType="motorista" 
          vagasTotais={viagem.bus_capacity} 
          inscritosAlunos={viagem.student_count}
          inscritosProfessores={viagem.staff_count}
          totalInscritos={viagem.total_enrolled}
        />

        <div className="flex flex-col gap-3">
          {statusViagem !== "finalizada" && (
            <CheckinButton 
              viagemId={viagem.trip_id} 
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

const formatarHorario = (horario: string) => horario.slice(0, 5);
const formatarData = (data: string) => {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}`;
};

export default function MotoristaPage() {
  const [data, setData] = useState<Home | null>(null);
    const [diaAtivo, setDiaAtivo] = useState("Segunda");
    const diaAtual = DIAS_SEMANA.find((d) => d.id === diaAtivo);
  
    useEffect(() => {
      const fetchData = async () => {
        const resultado = await passengerService.getHome();
        setData(resultado);
      }
      fetchData();
    }, [])
  
    useEffect(() => {
      if (data?.reference_weekday) {
        setDiaAtivo(data.reference_weekday);
      }
    }, [data])

    const viagensDoDia = (data?.trips || []).filter(viagem => viagem.weekday === diaAtivo);
  
  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f8]">
      <Navigation tipoUsuario="Driver" />

      <main className="flex-1 max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto w-full px-4 pt-10 pb-32">
        <RoleHeader
          icon={<Bus className="h-4 w-4 text-[#103173]" />}
          portalName="Painel do Motorista"
          title="Suas escalas"
          subtitle="Selecione o dia da semana para ver as viagens agendadas."
          dateRange={data ? `(${formatarData(data.start_date)} - ${formatarData(data.end_date)})` : ""}
          rightContent={<CentralSuporte />}
        />

        <WeekDaysMenu 
          dias={DIAS_SEMANA} 
          diaAtivo={diaAtivo} 
          onDiaChange={setDiaAtivo} 
        />

        <CurrentDayHeader dayName={diaAtual?.full} />

        {viagensDoDia.length > 0 ? (
          viagensDoDia.map((viagem) => (
            <ViagemCard key={viagem.trip_id} viagem={viagem} />
          ))
        ) : (
          <EmptyDayCard 
            diaNome={diaAtual?.full} 
            titulo="Nenhuma escala para este dia"
            subtitulo={`Você está livre de viagens na ${diaAtual?.full.toLowerCase()}.`}
          />
        )}
      </main>
    </div>
  );
}
