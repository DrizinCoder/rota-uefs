"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { RoleHeader } from "@/components/shared/role-header";
import { WeekDaysMenu } from "@/components/shared/week-days-menu";
import { CurrentDayHeader } from "@/components/shared/current-day-header";
import { TripRouteHeader } from "@/entities/viagem/ui/TripRouteHeader";
import { PassengerListInfo } from "@/entities/viagem/ui/PassengerListInfo";
import { GuestSubscribeButton } from "@/features/inscrever-convidado/ui/GuestSubscribeButton";
import { GuestSubscribeModal } from "@/features/inscrever-convidado/ui/GuestSubscribeModal";
import { TripCard } from "@/entities/viagem/ui/TripCard";
import { ManageSubscriptionButton } from "@/features/gerenciar-inscricao/ui/ManageSubscriptionButton";
import { TripModeToggle } from "@/entities/viagem/ui/TripModeToggle";
import { SubscribeButton } from "@/features/inscrever-rota/ui/SubscribeButton";
import { passengerService, type HomePassageiro } from "@/services/passengerService";
import { GraduationCap } from "lucide-react";
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

export default function PaginaProfessor() {
  const [data, setData] = useState<HomePassageiro | null>(null);
  const [diaAtivo, setDiaAtivo] = useState("Segunda");
  const diaAtual = DIAS_SEMANA.find((d) => d.id === diaAtivo);
  const [modalConvidado, setModalConvidado] = useState<string | null>(null);

  // Busca os dados da home do passageiro
  useEffect(() => {
    const fetchData = async () => {
      const resultado = await passengerService.getHomePassageiro();
      setData(resultado);
    }
    fetchData();
  }, [])

  // Define o dia ativo como o dia atual, quando os dados são carregados
  useEffect(() => {
    if (data?.reference_weekday) {
      setDiaAtivo(data.reference_weekday);
    }
  }, [data])

  // Estado para armazenar a modalidade escolhida para cada card de viagem
  const [modalidades, setModalidades] = useState<Record<string, "ida" | "ida-volta">>({});

  const viagensDoDia = (data?.trips || []).filter(viagem => viagem.weekday === diaAtivo);
  

  const selecionarModalidade = (viagemId: string, modalidade: "ida" | "ida-volta") => {
    setModalidades(prev => ({ ...prev, [viagemId]: modalidade }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f4f8]">
      <div className="bg-[#103173] relative overflow-hidden">
        <Navigation tipoUsuario="Staff" />

      </div>

      <main className="flex-1 max-w-lg md:max-w-3xl lg:max-w-[80vw] mx-auto w-full px-4 pt-10 pb-32">
         <RoleHeader
          icon={<GraduationCap className="h-4 w-4 text-[#103173]" />}
          portalName="Portal do Professor"
          title="Inscreva-se na sua rota"
          subtitle="Confira as viagens da semana."
          dateRange={data ? `(${formatarData(data.start_date)} - ${formatarData(data.end_date)})` : ""}
        />

        <WeekDaysMenu dias={DIAS_SEMANA} diaAtivo={diaAtivo} onDiaChange={setDiaAtivo} />
       
        <CurrentDayHeader dayName={diaAtual?.full} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {viagensDoDia.map((viagem) => {
            const modalidadeAtual = modalidades[viagem.trip_id] || "ida";

            return (
              <TripCard key={viagem.trip_id}>
                <TripRouteHeader origem={viagem.boarding_point} destino={viagem.drop_off_point} horarioInicio={formatarHorario(viagem.departure_time)} />

                <PassengerListInfo userType="professor" vagasTotais={viagem.bus_capacity} inscritosAlunos={viagem.student_count} inscritosProfessores={viagem.staff_count} totalInscritos={viagem.total_enrolled} />

                <div className="flex flex-col gap-3">
                  {viagem.jaInscrito ? (
                    <ManageSubscriptionButton viagemId={viagem.trip_id} />
                  ) : (
                    <div className="space-y-3">
                      <TripModeToggle modalidadeAtual={modalidadeAtual} onChange={(nova) => selecionarModalidade(viagem.trip_id, nova)} />
                      <SubscribeButton viagemId={viagem.trip_id} />
                    </div>
                  )}

                  <div className="w-full h-px bg-[#103173]/5 my-0" />

                  <GuestSubscribeButton onClick={() => setModalConvidado(viagem.trip_id)} />
                </div>
              </TripCard>
            );
          })}
        </div>

        {viagensDoDia.length === 0 && (
          <EmptyDayCard diaNome={diaAtual?.full} />
        )}
      </main>

        <GuestSubscribeModal 
          viagemId={modalConvidado} 
          onClose={() => setModalConvidado(null)} 
        />

      <FooterSection />
    </div>
  );
}