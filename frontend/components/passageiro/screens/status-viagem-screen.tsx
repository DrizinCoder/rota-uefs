"use client";

import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
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
} from "lucide-react";

export function StatusViagemScreen() {
  const router = useRouter();

  const viagemInscrita = {
    id: "ROT-UEFS-002",
    origem: "Burger King/Ao lado do Sam's Club",
    destino: "UEFS",
    horarioInicio: "06:00",
    horarioFim: "08:00",
    inscritos: 19,
    quorum: 1,
    vagasTotais: 44,
    motorista: "João Silva",
    placa: "JLS-1020",
    status: "Confirmada",
  };

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
                    <Clock className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase">Horário</span>
                  </div>
                  <p className="text-xl font-black text-[#103173]">
                    {viagemInscrita.horarioInicio} - {viagemInscrita.horarioFim}
                  </p>
                </div>
                <div className="bg-[#E4F2F1] p-4 rounded-2xl">
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
                  <p className="text-[10px] font-black text-[#73AABF] uppercase italic">Motorista e veículo</p>
                  <p className="font-bold text-[#103173]">
                    {viagemInscrita.motorista} · <span className="text-[#73AABF]">{viagemInscrita.placa}</span>
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
      </main>    </div>
  );
}

