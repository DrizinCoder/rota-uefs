"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { passengerService } from "@/services/homeService";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  CalendarCheck,
} from "lucide-react";

export function ConfirmacaoInscricaoScreen() {
  const router = useRouter();
  
  const [viagemSelecionada, setViagemSelecionada] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchTrip() {
      const viagemId = sessionStorage.getItem("viagemIdSelecionada");
      
      if (!viagemId) {
        setIsLoading(false);
        return;
      }

      try {
        const tripData = await passengerService.getTripById(viagemId);

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

        setViagemSelecionada({
          origem,
          destino,
          horarioInicio: tripData.departure_time ? tripData.departure_time.substring(0, 5) : "",
          horarioFim,
        });
        console.log("Trip Data:", tripData);
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

  if (!viagemSelecionada) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#E4F2F1] px-4 text-center">
        <AlertCircle className="h-12 w-12 text-amber-600 mb-4" />
        <h2 className="text-xl font-bold text-[#103173] mb-2">Viagem não encontrada</h2>
        <p className="text-[#103173]/70 mb-6">Não conseguimos carregar os detalhes desta viagem.</p>
        <Button onClick={() => router.back()} className="bg-[#103173]">Voltar para Rotas</Button>
      </div>
    );
  }

  const handleConfirmar = async () => {
    try {
      setIsSubmitting(true);
      const viagemId = sessionStorage.getItem("viagemIdSelecionada");
      if (!viagemId) return;

      await passengerService.subscribeUser(viagemId);
      router.push("/passageiro/status");
    } catch (error) {
      console.error("Erro ao confirmar inscrição:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1]">
      <Navigation />

      <main className="flex-1 w-full max-w-2xl mx-auto py-12 px-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-[#103173] font-bold hover:bg-[#103173]/5"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> VOLTAR PARA ROTAS
        </Button>

        <Card className="border-none shadow-2xl bg-white overflow-hidden">
          <CardHeader className="bg-[#103173] text-white p-8 text-center">
            <div className="mx-auto bg-[#F2D022] p-3 rounded-full w-fit mb-4">
              <CalendarCheck className="h-8 w-8 text-[#103173]" />
            </div>
            <CardTitle className="text-2xl font-black tracking-tight">
              Confirme sua Inscrição
            </CardTitle>
            <p className="text-white/80 font-medium mt-2">
              Verifique os detalhes da viagem antes de prosseguir
            </p>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            <div className="relative space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-[#103173]/10 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-[#103173]" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#73AABF] uppercase tracking-widest">Ponto de Partida</p>
                  <p className="text-xl font-black text-[#103173]">{viagemSelecionada.origem}</p>
                </div>
              </div>

              <div className="absolute left-[26px] top-[45px] w-[2px] h-[30px] bg-dashed border-l-2 border-dashed border-[#103173]/20" />

              <div className="flex items-start gap-4">
                <div className="mt-1 bg-[#23B99A]/10 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-[#23B99A]" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#73AABF] uppercase tracking-widest">Destino Final</p>
                  <p className="text-xl font-black text-[#103173]">{viagemSelecionada.destino}</p>
                </div>
              </div>
            </div>

            <hr className="border-[#E4F2F1]" />

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#E4F2F1] p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-[#103173]" />
                  <p className="text-[10px] font-black text-[#73AABF] uppercase tracking-widest">Saída</p>
                </div>
                <p className="text-2xl font-black text-[#103173]">{viagemSelecionada.horarioInicio}</p>
              </div>

              <div className="bg-[#E4F2F1] p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-[#23B99A]" />
                  <p className="text-[10px] font-black text-[#73AABF] uppercase tracking-widest">Previsão</p>
                </div>
                <p className="text-2xl font-black text-[#103173]">{viagemSelecionada.horarioFim}</p>
              </div>
            </div>

            <div className="flex gap-3 bg-amber-50 border border-amber-100 p-4 rounded-xl">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800 font-medium">
                Após confirmação, será gerado um código que deve ser mostrado para o motorista no embarque.
              </p>
            </div>
          </CardContent>

          <CardFooter className="p-8 pt-0 flex flex-col gap-4">
            <Button
              onClick={handleConfirmar}
              disabled={isSubmitting}
              className="w-full h-16 bg-[#23B99A] hover:bg-[#1a8a73] text-white font-black text-lg rounded-2xl shadow-xl shadow-[#23B99A]/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              {isSubmitting ? "CONFIRMANDO..." : "CONFIRMAR MINHA VAGA"}
            </Button>
            <p className="text-center text-[11px] text-[#73AABF] font-bold uppercase tracking-tighter">
              Ao confirmar, você se compromete com o horário estabelecido.
            </p>
          </CardFooter>
        </Card>
      </main>

      <FooterSection />
    </div>
  );
}
