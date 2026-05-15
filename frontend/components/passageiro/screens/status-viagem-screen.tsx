"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { passengerService } from "@/services/homeService";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  QrCode,
  Info,
  ArrowLeft,
  Bus,
  CheckCircle2,
  Users,
  AlertCircle,
  Calendar,
} from "lucide-react";

export function StatusViagemScreen() {
  const router = useRouter();

  const [viagemInscrita, setViagemInscrita] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTrip() {
      const viagemId = sessionStorage.getItem("viagemIdSelecionada");

      if (!viagemId) {
        setIsLoading(false);
        return;
      }

      try {
        const tripData = await passengerService.getTripById(viagemId);
        
        // Busca a home para encontrar o total_enrolled com base na listagem de viagens
        const homeData = await passengerService.getHome();
        const tripFromHome = homeData.trips?.find(t => t.trip_id === viagemId);

        let origem = "Não informada";
        let destino = "Não informada";

        if (tripData.route_id) {
          const routeData = await passengerService.getRouteById(tripData.route_id);
          origem = routeData.boarding_point;
          destino = routeData.drop_off_point;
        } else {
          // Fallback caso a rota venha vazia
          origem = tripData.boarding_point || origem;
          destino = tripData.drop_off_point || destino;
        }

        // Se a viagem for Salvador-Feira ou Feira-Salvador, adiciona 2 horas ao horário de término
        const isSalvadorFeira =
          (origem.toLowerCase().includes("salvador") && destino.toLowerCase().includes("feira")) ||
          (origem.toLowerCase().includes("feira") && destino.toLowerCase().includes("salvador"));

        let horarioFim = "--:--";
        if (isSalvadorFeira && tripData.departure_time) {
          const [hoursStr, minutesStr] = tripData.departure_time.split(":");
          if (hoursStr && minutesStr) {
            let hours = parseInt(hoursStr, 10);
            hours = (hours + 2) % 24;
            horarioFim = `${hours.toString().padStart(2, "0")}:${minutesStr.substring(0, 2)}`;
          }
        }

        const inscritos = tripFromHome?.total_enrolled !== undefined 
          ? tripFromHome.total_enrolled 
          : (tripData.total_enrolled !== undefined ? tripData.total_enrolled : (tripData.student_count || 0) + (tripData.staff_count || 0));
        const dataFormatada = tripData.trip_date ? tripData.trip_date.split('-').reverse().join('/') : "--/--/----";

        setViagemInscrita({
          id: viagemId.substring(0, 8).toUpperCase(),
          data: dataFormatada,
          origem,
          destino,
          horarioInicio: tripData.departure_time ? tripData.departure_time.substring(0, 5) : "",
          horarioFim,
          inscritos: inscritos,
          quorum: 1,
          vagasTotais: tripData.bus_capacity || 44,
          placa: tripData.placa || "A DEFINIR",
          status: "Confirmada",
        });
      } catch (error) {
        console.error("Erro ao buscar detalhes da viagem:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrip();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#E4F2F1]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#103173]"></div>
      </div>
    );
  }

  if (!viagemInscrita) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#E4F2F1] px-4 text-center">
        <AlertCircle className="h-12 w-12 text-amber-600 mb-4" />
        <h2 className="text-xl font-bold text-[#103173] mb-2">Viagem não encontrada</h2>
        <p className="text-[#103173]/70 mb-6">Não conseguimos carregar os detalhes da sua viagem.</p>
        <Button onClick={() => router.push("/passageiro")} className="bg-[#103173]">Voltar para Home</Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1]">
      <Navigation />

      <main className="flex-1 w-full max-w-2xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/passageiro")}
            className="text-[#103173] font-bold"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> VOLTAR
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="bg-[#103173] text-white p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-[#F2D022] p-2 rounded-lg">
                    <Bus className="h-6 w-6 text-[#103173]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black">Detalhes da Rota</CardTitle>
                    <p className="text-white/70 text-xs font-bold uppercase">{viagemInscrita.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black opacity-70 uppercase">Status</p>
                  <p className="text-sm font-black text-[#F2D022]">{viagemInscrita.status}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="space-y-4 border-l-2 border-dashed border-[#103173]/20 ml-3 pl-6 relative">
                <div className="relative">
                  <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-[#F2D022] border-4 border-white shadow-sm" />
                  <p className="text-[10px] font-black text-[#73AABF] uppercase tracking-widest">Origem</p>
                  <p className="text-lg font-black text-[#103173]">{viagemInscrita.origem}</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-[#103173] border-4 border-white shadow-sm" />
                  <p className="text-[10px] font-black text-[#73AABF] uppercase tracking-widest">Destino</p>
                  <p className="text-lg font-black text-[#103173]">{viagemInscrita.destino}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#E4F2F1] p-4 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1 text-[#73AABF]">
                    <Calendar className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase">Data</span>
                  </div>
                  <p className="text-xl font-black text-[#103173]">
                    {viagemInscrita.data}
                  </p>
                </div>
                <div className="bg-[#E4F2F1] p-4 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1 text-[#73AABF]">
                    <Clock className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase">Horário</span>
                  </div>
                  <p className="text-xl font-black text-[#103173]">
                    {viagemInscrita.horarioInicio} - {viagemInscrita.horarioFim}
                  </p>
                </div>
                <div className="bg-[#E4F2F1] p-4 rounded-2xl col-span-2">
                  <div className="flex items-center gap-2 mb-1 text-[#73AABF]">
                    <Users className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase">Ocupação</span>
                  </div>
                  <p className="text-xl font-black text-[#103173]">
                    {viagemInscrita.inscritos}/{viagemInscrita.vagasTotais}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <Info className="text-[#103173] h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#73AABF] uppercase italic">Veículo</p>
                  <p className="font-bold text-[#103173]">
                    <span className="text-[#73AABF]">{viagemInscrita.placa}</span>
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 flex flex-col gap-4">
              <div className="w-full h-px bg-slate-100 mb-2" />

              <Button
                onClick={() => router.push("/passageiro/validar")}
                className="w-full h-16 bg-[#103173] hover:bg-[#103B73] text-white font-black text-lg rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-3"
              >
                <QrCode className="h-6 w-6 text-[#F2D022]" />
                VISUALIZAR CÓDIGO
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  if (confirm("Tem certeza que deseja cancelar sua vaga?")) {
                    router.push("/passageiro");
                  }
                }}
                className="text-red-500 font-bold hover:text-red-600 hover:bg-red-50"
              >
                CANCELAR MINHA INSCRIÇÃO
              </Button>
            </CardFooter>
          </Card>

          <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
            <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800 font-medium">
              Apresente-se no ponto de partida com 5 minutos de antecedência. A validação do código é feita diretamente com o motorista no embarque.
            </p>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
