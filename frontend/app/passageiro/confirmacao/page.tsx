"use client";

import { useRouter } from "next/navigation";
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
  CalendarCheck
} from "lucide-react";

export default function ConfirmacaoInscricao() {
  const router = useRouter();

  // Dados mockados da viagem selecionada (em um cenário real viriam via URL ou Estado)
  const viagemSelecionada = {
    origem: " Burger King/Ao lado do Sam's Club",
    destino: "UEFS",
    horarioInicio: "06:00",
    horarioFim: "08:00",
    data: "Segunda-feira, 6 de Abril"
  };

  const handleConfirmar = () => {
    // Lógica de confirmação aqui
    // Após confirmar, o PDF sugere a "Emissão de verificação" (Status da viagem)
    router.push("/passageiro/status");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1]">
      <Navigation />

      <main className="flex-1 w-full max-w-2xl mx-auto py-12 px-4">
        {/* Botão Voltar */}
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
            {/* Seção de Origem e Destino */}
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

              {/* Linha conectora visual */}
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

            {/* Seção de Horários */}
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

            {/* Aviso de Quorum */}
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
              className="w-full h-16 bg-[#23B99A] hover:bg-[#1a8a73] text-white font-black text-lg rounded-2xl shadow-xl shadow-[#23B99A]/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              CONFIRMAR MINHA VAGA
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