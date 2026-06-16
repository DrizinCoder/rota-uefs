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
import { TripIdHeader, type TripStatus } from "@/entities/viagem/ui/TripIdHeader";
import { PassengerListInfo } from "@/entities/viagem/ui/PassengerListInfo";
import { CheckinButton } from "@/features/fazer-checkin/ui/CheckinButton";
import { StartTripButton } from "@/features/iniciar-viagem/ui/StartTripButton";
import { TripRouteHeader } from "@/entities/viagem/ui/TripRouteHeader";
import { passengerService, type Home, type CardViagemFeed } from "@/services/homeService";
import { isTripButtonLocked } from "@/entities/viagem/lib/tripTimeUtils";
import { NotificationToggle } from "@/features/gerenciar-notificacoes/ui/NotificationToggle";
import { driverService } from "@/services/driverService";

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
const mapStatus = (status?: string): TripStatus => {
  if (status === "Confirmed") return "em_curso";
  if (status === "Completed") return "finalizada";
  if (status === "Cancelled") return "cancelada";
  return "pronta";
};

function ViagemCard({ viagem, referenceWeekday }: { viagem: CardViagemFeed; referenceWeekday: string }) {
  const router = useRouter();
  const [statusViagem, setStatusViagem] = useState<TripStatus>(mapStatus(viagem.status));

  const [travadoIniciar, setTravadoIniciar] = useState(() =>
    isTripButtonLocked(viagem.weekday, referenceWeekday, viagem.departure_time, 10)
  );
  const [travadoCheckin, setTravadoCheckin] = useState(() =>
    isTripButtonLocked(viagem.weekday, referenceWeekday, viagem.departure_time, 60)
  );

  // Recalcula o estado de travamento a cada 30 segundos
  useEffect(() => {
    const tick = () => {
      setTravadoIniciar(isTripButtonLocked(viagem.weekday, referenceWeekday, viagem.departure_time, 10));
      setTravadoCheckin(isTripButtonLocked(viagem.weekday, referenceWeekday, viagem.departure_time, 60));
    };
    const interval = setInterval(tick, 30_000);
    return () => clearInterval(interval);
  }, [viagem.weekday, referenceWeekday, viagem.departure_time]);

  const handleCheckIn = () => {
    router.push(`/motorista/embarque?trip_id=${encodeURIComponent(viagem.trip_id)}`);
  };

  const handleAcaoViagem = async () => {
    if (statusViagem === "pronta") {
      try {
        const res = await driverService.iniciarViagem(viagem.trip_id);
        if (res.success) {
          setStatusViagem("em_curso");
        } else {
          alert("Não foi possível iniciar a viagem. Tente novamente.");
        }
      } catch (error) {
        console.error("Erro ao iniciar viagem:", error);
        alert("Erro ao iniciar viagem. Tente novamente.");
      }
    } else if (statusViagem === "em_curso") {
      try {
        const res = await driverService.finalizarViagem(viagem.trip_id);
        if (res.success) {
          setStatusViagem("finalizada");
        } else {
          alert("Não foi possível finalizar a viagem. Tente novamente.");
        }
      } catch (error) {
        console.error("Erro ao finalizar viagem:", error);
        alert("Erro ao finalizar viagem. Tente novamente.");
      }
    }
  };

  // Badge: viagem de outro dia da semana aparece como "Agendada"
  const statusBadge: TripStatus =
    viagem.weekday !== referenceWeekday ? "bloqueada" : statusViagem;

  return (
    <TripCard className="p-0 shadow-[0_1px_3px_rgba(16,49,115,0.06),0_8px_24px_rgba(16,49,115,0.04)] mb-6">
      <div className="bg-[#103173]/5 pt-3 px-3">
        <TripIdHeader
          diaSemana={traduzirDia(viagem.weekday)}
          status={statusBadge}
        />
      </div>

      <div className="px-5 pt-2 pb-5">

        <TripRouteHeader origem={viagem.boarding_point} destino={viagem.drop_off_point} horarioInicio={formatarHorario(viagem.departure_time)} />

        <PassengerListInfo
          userType="motorista"
          vagasTotais={viagem.bus_capacity}
          inscritosAlunos={viagem.student_count}
          inscritosServidores={viagem.staff_count}
          totalInscritos={viagem.total_enrolled}
        />

        <div className="flex flex-col gap-3">
          {statusViagem !== "finalizada" && (
            <CheckinButton
              viagemId={viagem.trip_id}
              onClick={handleCheckIn}
              travado={travadoCheckin}
              className="py-10 rounded-2xl text-lg font-extrabold"
            />
          )}
          <StartTripButton
            status={statusViagem}
            travado={travadoIniciar}
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
  const normalizarDia = (dia: string) => {
    if (dia === "Sábado" || dia === "Domingo") {
      return "Segunda";
    }
    return dia;
  };

  useEffect(() => {
    const fetchData = async () => {
      const resultado = await passengerService.getHome();
      setData(resultado);
    }
    fetchData();
  }, [])

  useEffect(() => {
    if (data?.reference_weekday) {
      setDiaAtivo(normalizarDia(data.reference_weekday));
    }
  }, [data]);

  const viagensDoDia = (data?.trips || []).filter(viagem => viagem.weekday === diaAtivo);
  //console.log("VIAGENS DO DIA: ", viagensDoDia);  
  //console.log("departure_time: ", viagensDoDia[0].departure_time, "weekday: ", viagensDoDia[0].weekday);

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
          rightContent={
            <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
              <NotificationToggle />
              <CentralSuporte />
            </div>
          }
        />

        <WeekDaysMenu
          dias={DIAS_SEMANA}
          diaAtivo={diaAtivo}
          onDiaChange={setDiaAtivo}
        />

        <CurrentDayHeader dayName={diaAtual?.full} />

        {viagensDoDia.length > 0 ? (
          viagensDoDia.map((viagem) => (
            <ViagemCard key={viagem.trip_id} viagem={viagem} referenceWeekday={data?.reference_weekday ?? ""} />
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
