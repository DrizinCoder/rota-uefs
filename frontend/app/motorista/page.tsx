"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Button } from "@/components/ui/button";
import { RoleHeader } from "@/components/shared/role-header";
import {
  Clock,
  CheckCircle2,
  MapPin,
  CircleDot,
  Bus,
  Users,
  UserCircle,
  ShieldAlert,
  LifeBuoy,
  Phone,
  MessageCircle,
  AlertTriangle,
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
  const contatos = [
    { nome: "Suporte Uninfra", tel: "0800123456", tipo: "phone" },
    { nome: "WhatsApp Uninfra", tel: "5571999999999", tipo: "whatsapp" },
    { nome: "Emergência (SAMU)", tel: "192", tipo: "emergency" },
    { nome: "Polícia Rodoviária", tel: "191", tipo: "emergency" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full border border-red-100 hover:bg-red-100 transition-colors shadow-sm md:mb-0 mb-6 shrink-0">
          <LifeBuoy className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Ajuda e Emergência</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#103173] flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-600" />
            Central de Suporte
          </DialogTitle>
          <DialogDescription>
            Contatos diretos para suporte operacional e emergências.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {contatos.map((contato, index) => (
            <a
              key={index}
              href={contato.tipo === "whatsapp" ? `https://wa.me/${contato.tel}` : `tel:${contato.tel}`}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${contato.tipo === "emergency" ? "bg-red-100 text-red-600" : "bg-blue-100 text-[#103173]"}`}>
                  {contato.tipo === "whatsapp" ? <MessageCircle className="h-5 w-5" /> : contato.tipo === "emergency" ? <AlertTriangle className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-bold text-[#103173]">{contato.nome}</p>
                  <p className="text-xs text-slate-500">{contato.tel}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </DialogContent>
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
    <div className="mb-6">
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(16,49,115,0.06),0_8px_24px_rgba(16,49,115,0.04)]">
        <div className="bg-[#103173]/5 px-4 py-3 flex items-center justify-between border-b border-[#103173]/5">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${statusViagem === "em_curso" ? "bg-[#F2D022]" : statusViagem === "bloqueada" ? "bg-slate-300" : "bg-[#23B99A]"} ${statusViagem !== "bloqueada" && statusViagem !== "finalizada" ? "animate-pulse" : ""}`}
            />
            <span className="text-xs font-extrabold text-[#103173] uppercase tracking-wider">
              {viagem.id}
            </span>
          </div>
          <span className="text-xs font-bold text-[#103173]/40">
            {viagem.dia}
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-start gap-3 mb-5">
            <div className="flex flex-col items-center pt-0.5 shrink-0">
              <CircleDot className="h-5 w-5 text-[#F2D022]" />
              <div className="w-px h-8 bg-gradient-to-b from-[#F2D022] to-[#103173] my-1" />
              <MapPin className="h-5 w-5 text-[#103173]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between">
                <p className="text-lg font-extrabold text-[#103173]">
                  {viagem.origem}
                </p>
                <span className="text-sm font-bold text-[#103173]/50 ml-2 shrink-0">
                  {viagem.horarioPartida}
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-4">
                <p className="text-lg font-extrabold text-[#103173]">
                  {viagem.destino}
                </p>
                <span className="text-sm font-bold text-[#103173]/50 ml-2 shrink-0">
                  {viagem.horarioChegada}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#103173]/[0.03] rounded-xl mb-5">
            <Users className="h-5 w-5 text-[#103173]/60" />
            <div className="flex-1">
              <p className="text-xs font-bold text-[#103173]/40 uppercase tracking-wider">
                Passageiros
              </p>
              <p className="text-lg font-extrabold text-[#103173]">
                {viagem.passageirosConfirmados}{" "}
                <span className="text-sm font-bold text-[#103173]/30">
                  / {viagem.vagasTotais}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {statusViagem !== "finalizada" && (
              <button
                onClick={handleCheckIn}
                className="w-full py-4 rounded-2xl text-lg font-extrabold bg-[#23B99A] text-white hover:bg-[#1fa889] active:scale-[0.97] transition-all shadow-lg flex items-center justify-center gap-3"
              >
                <CheckCircle2 className="h-6 w-6" /> Fazer Check-in
              </button>
            )}
            <button
              onClick={handleAcaoViagem}
              disabled={
                statusViagem === "bloqueada" || statusViagem === "finalizada"
              }
              className={`w-full py-4 rounded-2xl text-lg font-extrabold transition-all duration-300 flex items-center justify-center gap-3 ${
                statusViagem === "bloqueada"
                  ? "bg-slate-200 text-slate-400"
                  : statusViagem === "pronta"
                    ? "bg-[#103173] text-white"
                    : statusViagem === "em_curso"
                      ? "bg-[#F2D022] text-[#103173]"
                      : "bg-slate-100 text-slate-400"
              }`}
            >
              {statusViagem === "bloqueada"
                ? "Aguardando Horário"
                : statusViagem === "pronta"
                  ? "Iniciar Viagem"
                  : statusViagem === "em_curso"
                    ? "Confirmar Chegada"
                    : "Viagem Concluída"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MotoristaPage() {
  const router = useRouter();
  const [diaSelecionado, setDiaSelecionado] = useState("Segunda-feira");
  const [diaAtivo, setDiaAtivo] = useState("segunda");

  // Filtra as viagens para mostrar apenas as do dia selecionado
  const viagensFiltradas = VIAGENS.filter((viagem) => viagem.dia === diaSelecionado);

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

        {/* Seletor de Dias da Semana (Layout mais espaçado) */}
        <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            {DIAS_SEMANA.map((dia) => (
              <button
                key={dia.id}
                onClick={() => setDiaAtivo(dia.id)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 relative ${dia.id === diaAtivo ? "bg-[#103173] text-white shadow-lg" : "bg-white text-[#103173]/70 border border-[#103173]/8"}`}
              >
                {dia.label}
              </button>
            ))}
            </div>
          </div>

        {/* Lista de Viagens do Dia Selecionado */}
        {viagensFiltradas.length > 0 ? (
          viagensFiltradas.map((viagem) => (
            <ViagemCard key={viagem.id} viagem={viagem} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
            <CalendarDays className="h-10 w-10 text-slate-300 mb-3" />
            <p className="text-[#103173] font-bold">Nenhuma escala para este dia</p>
            <p className="text-slate-500 text-sm mt-1">Você está livre de viagens na {diaSelecionado.toLowerCase()}.</p>
          </div>
        )}
      </main>

      {/* --- MODO DE TESTE --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#103173] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 z-50 border-2 border-[#F2D022]/30 backdrop-blur-md">
        <div className="flex flex-col border-r border-white/20 pr-4">
          <span className="text-[9px] font-black uppercase text-[#F2D022] tracking-tighter">
            Modo de Teste
          </span>
          <span className="text-xs font-bold">Alternar Perfil</span>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-white/10 text-white gap-2 font-bold"
            onClick={() => router.push("/passageiro")}
          >
            <UserCircle className="h-4 w-4" /> Passageiro
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="bg-[#F2D022] text-[#103173] gap-2 font-bold transition-colors"
            onClick={() => router.push("/motorista")}
          >
            <Bus className="h-4 w-4" /> Motorista
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-red-500 hover:text-white text-white gap-2 font-bold transition-colors"
            onClick={() => router.push("/admin")}
          >
            <ShieldAlert className="h-4 w-4" /> Admin
          </Button>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}