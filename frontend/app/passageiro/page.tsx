"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/landing/navigation";
import { RoleHeader } from "@/components/shared/role-header";
import { WeekDaysMenu } from "@/components/shared/week-days-menu";
import { CurrentDayHeader } from "@/components/shared/current-day-header";
import { TripCard } from "@/entities/viagem/ui/TripCard";
import { TripRouteHeader } from "@/entities/viagem/ui/TripRouteHeader";
import { PassengerListInfo } from "@/entities/viagem/ui/PassengerListInfo";
import { TripModeToggle } from "@/entities/viagem/ui/TripModeToggle";
import { ManageSubscriptionButton } from "@/features/gerenciar-inscricao/ui/ManageSubscriptionButton";
import { SubscribeButton } from "@/features/inscrever-rota/ui/SubscribeButton";
import { GuestSubscribeButton } from "@/features/inscrever-convidado/ui/GuestSubscribeButton";
import { GuestSubscribeModal } from "@/features/inscrever-convidado/ui/GuestSubscribeModal";
import { GraduationCap } from "lucide-react";
import { passengerService, type Home, type UserTrip } from "@/services/homeService";
import { userService, type UserProfile } from "@/services/userService";
import { EmptyDayCard } from "@/components/shared/empty-day-card";

const DIAS_SEMANA = [
  { id: "Segunda", label: "Seg", full: "Segunda-feira" },
  { id: "Terça", label: "Ter", full: "Terça-feira" },
  { id: "Quarta", label: "Qua", full: "Quarta-feira" },
  { id: "Quinta", label: "Qui", full: "Quinta-feira" },
  { id: "Sexta", label: "Sex", full: "Sexta-feira" },
];

const formatarHorario = (horario: string) => horario.slice(0, 5);
const formatarData = (data: string) => {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}`;
};

export default function PaginaPassageiro() {
  const [data, setData] = useState<Home | null>(null);
  const [diaAtivo, setDiaAtivo] = useState("Segunda");
  const [minhasViagens, setMinhasViagens] = useState<UserTrip[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [modalConvidado, setModalConvidado] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const diaAtual = DIAS_SEMANA.find((d) => d.id === diaAtivo);
  const normalizarDia = (dia: string) => {
      if (dia === "Sábado" || dia === "Domingo") {
        return "Segunda";
      }
      return dia;
    };

  // Estado para armazenar a modalidade escolhida para cada card de viagem
  const [modalidades, setModalidades] = useState<Record<string, "ida" | "ida-volta">>({});

  // Busca os dados da home do passageiro e as viagens do usuário
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultado = await passengerService.getHome();
        setData(resultado);

        const userData = await userService.getMe();
        setUser(userData);

        const trips = await passengerService.getUserTrips(userData.user_id);
        console.log("Viagens do usuário:", trips);
        setMinhasViagens(trips);
      } catch (error) {
        console.error("Erro ao buscar dados", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [])

  useEffect(() => {
    if (data?.reference_weekday) {
      setDiaAtivo(normalizarDia(data.reference_weekday));
    }
  }, [data])

  const viagensDoDia = (data?.trips || []).filter(viagem => viagem.weekday === diaAtivo);

  // IDs das viagens em que o usuário já está inscrito
  const idsInscritos = new Set(minhasViagens.map(v => v.trip_id));

  const selecionarModalidade = (viagemId: string, modalidade: "ida" | "ida-volta") => {
    setModalidades(prev => ({ ...prev, [viagemId]: modalidade }));
  };

  const isStaff = user?.profile === "Staff";
  const userTypeLabel = isStaff ? "professor" : "aluno";
  const portalName = isStaff ? "Portal do Professor" : "Portal do Aluno";

  if (isLoading) {
    return <div className="flex min-h-screen bg-[#f0f4f8] items-center justify-center font-medium text-[#103173]">Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f4f8]">
      <Navigation tipoUsuario="Student" />

      <main className="flex-1 max-w-lg md:max-w-3xl lg:max-w-[80vw] mx-auto w-full px-4 pt-10 pb-32">
        <RoleHeader
          icon={<GraduationCap className="h-4 w-4 text-[#103173]" />}
          portalName={portalName}
          title="Inscreva-se na sua rota"
          subtitle="Confira as viagens da semana."
          dateRange={data ? `(${formatarData(data.start_date)} - ${formatarData(data.end_date)})` : ""}
        />
        
        <WeekDaysMenu dias={DIAS_SEMANA} diaAtivo={diaAtivo} onDiaChange={setDiaAtivo} />

        <CurrentDayHeader dayName={diaAtual?.full} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {viagensDoDia.map((viagem) => {
            const modalidadeAtual = modalidades[viagem.trip_id] || "ida";
            const isSubscribed = idsInscritos.has(viagem.trip_id);

            return (
              <TripCard key={viagem.trip_id}>
                <TripRouteHeader
                  origem={viagem.boarding_point}
                  destino={viagem.drop_off_point}
                  horarioInicio={formatarHorario(viagem.departure_time)}
                />

                <PassengerListInfo
                  userType={userTypeLabel}
                  vagasTotais={viagem.bus_capacity}
                  inscritosAlunos={viagem.student_count}
                  inscritosProfessores={viagem.staff_count}
                  totalInscritos={viagem.total_enrolled}
                />

                <div className="flex flex-col gap-3">
                  {isSubscribed ? (
                    <ManageSubscriptionButton viagemId={viagem.trip_id} />
                  ) : (
                    <div className="space-y-3">
                      <TripModeToggle
                        modalidadeAtual={modalidadeAtual}
                        onChange={(nova) => selecionarModalidade(viagem.trip_id, nova)}
                      />
                      <SubscribeButton viagemId={viagem.trip_id} />
                    </div>
                  )}

                  {isStaff && (
                    <>
                      <div className="w-full h-px bg-[#103173]/5 my-0" />
                      <GuestSubscribeButton onClick={() => setModalConvidado(viagem.trip_id)} />
                    </>
                  )}
                </div>
              </TripCard>
            );
          })}
        </div>

        {viagensDoDia.length === 0 && (
          <EmptyDayCard diaNome={diaAtual?.full} />
        )}
      </main>

      {isStaff && (
        <GuestSubscribeModal 
          viagemId={modalConvidado} 
          onClose={() => setModalConvidado(null)} 
        />
      )}

    </div>
  );
}
