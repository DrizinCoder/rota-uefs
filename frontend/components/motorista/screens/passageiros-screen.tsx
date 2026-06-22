"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TripInfoCard } from "@/components/motorista/TripInfoCard";
import { SearchBar } from "@/components/motorista/SearchBar";
import { PassengerCard } from "@/components/motorista/PassengerCard";
import {
  ArrowLeft,
  ClipboardList,
  ListPlus,
  UserPlus,
  Users,
  Clock,
} from "lucide-react";

import { driverService, type PassengerListResponse, type Reservation } from "@/services/driverService";

interface PassageiroFormatado {
  reservation_id: string;
  user_id: string;
  nome: string;
  matricula: string;
  status: string;
  isAvulso?: boolean;
}

const profileMap: Record<string, string> = {
  Student: "Estudante",
  Staff: "Servidor",
};

function PassageirosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get("trip_id");
  const [busca, setBusca] = useState("");
  const [passageiros, setPassageiros] = useState<PassageiroFormatado[]>([]);
  const [listaEspera, setListaEspera] = useState<PassageiroFormatado[]>([]);
  const [dadosViagem, setDadosViagem] = useState<PassengerListResponse | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<"principal" | "espera">("principal");

  const termoBusca = busca.trim().toLowerCase();
  const sanitizarBusca = (valor: string) =>
    valor
      .normalize("NFKC")
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s{2,}/g, " ");

  if (!tripId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#E4F2F1]">
        <p className="font-bold text-[#103173]">Trip ID não encontrado</p>
      </div>
    );
  }

  const carregarPassageiros = async () => {
    try {
      const dados = await driverService.listarPassageiros(tripId!);

      const ordenarPorProfileETimestamp = (reservations: Reservation[]) => {
        return reservations.sort((a, b) => {
          const profileOrder = { "Professor": 0, "Aluno": 1 };
          const profileA = profileOrder[a.profile as keyof typeof profileOrder] ?? 2;
          const profileB = profileOrder[b.profile as keyof typeof profileOrder] ?? 2;

          if (profileA !== profileB) {
            return profileA - profileB;
          }

          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        });
      };

      const reservasOrdenadas = ordenarPorProfileETimestamp([...dados.valid_reservations]);
      const passageirosValidos = reservasOrdenadas.map((res) => ({
        reservation_id: res.reservation_id,
        user_id: res.user_id,
        nome: res.name === "Staff Não Registrado" ? "Servidor Avulso" : res.name,
        matricula: profileMap[res.profile] ?? res.profile,
        status: res.profile === "Staff" && res.name === "Staff Não Registrado" ? "embarcou" : (res.onboard ? "embarcou" : "pendente"),
        isAvulso: res.profile === "Staff" && res.name === "Staff Não Registrado",
      }));

      const esperaOrdenada = ordenarPorProfileETimestamp([...dados.waitlist_reservations]);
      const passageirosEspera = esperaOrdenada.map((res) => ({
        reservation_id: res.reservation_id,
        user_id: res.user_id,
        nome: res.name === "Staff Não Registrado" ? "Servidor Avulso" : res.name,
        matricula: profileMap[res.profile] ?? res.profile,
        status: "espera",
      }));

      setPassageiros(passageirosValidos);
      setListaEspera(passageirosEspera);
      setDadosViagem(dados);
    } catch (erro) {
      console.error("ERRO AO CARREGAR:", erro);
    }
  };

  useEffect(() => {
    carregarPassageiros();
  }, [tripId]);

  const passageirosFiltrados = passageiros.filter(
    (p) =>
      p.nome.toLowerCase().includes(termoBusca) ||
      p.matricula.toLowerCase().includes(termoBusca),
  );

  const listaEsperaFiltrada = listaEspera.filter(
    (p) =>
      p.nome.toLowerCase().includes(termoBusca) ||
      p.matricula.toLowerCase().includes(termoBusca),
  );

  const handleAdicionarAvulso = async () => {
    try {
      const resultado = await driverService.adicionarAvulso(tripId!);
      if (resultado.success) {
        await carregarPassageiros();
      } else {
        console.error("Erro ao adicionar avulso");
      }
    } catch (erro) {
      console.error("Erro:", erro);
    }
  };

  const handleRemoverAvulso = async (reservation_id: string) => {
    try {
      const resultado = await driverService.removerAvulso(reservation_id);
      if (resultado.success) {
        await carregarPassageiros();
      }
    } catch (erro) {
      console.error("Erro ao remover avulso:", erro);
    }
  };

  const handleEmbarcar = async (user_id: string, reservation_id: string, trip_id: string) => {
    try {
      const resultado = await driverService.embarcar(user_id, reservation_id, trip_id);
      if (resultado.success) {
        await carregarPassageiros();
      }
    } catch (erro) {
      console.error("Erro ao embarcar:", erro);
    }
  };

  const handleDesembarcar = async (reservation_id: string) => {
    try {
      const resultado = await driverService.desembarcar(reservation_id);
      if (resultado.success) {
        await carregarPassageiros();
      }
    } catch (erro) {
      console.error("Erro ao desembarcar:", erro);
    }
  };

  const handleMarcarFalta = async (reservation_id: string) => {
    try {
      const resultado = await driverService.marcarFalta(reservation_id);
      if (resultado.success) {
        await carregarPassageiros();
      }
    } catch (erro) {
      console.error("Erro ao marcar falta:", erro);
    }
  };

  const listaAtual = abaAtiva === "principal" ? passageirosFiltrados : listaEsperaFiltrada;

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1]">
      <Navigation tipoUsuario="Driver" />

      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#103173]/60 font-bold text-sm hover:text-[#103173] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <Badge
            variant="outline"
            className="border border-[#103173]/15 text-[#103173] font-bold px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg text-xs"
          >
            ROTA: {dadosViagem?.route_name}
          </Badge>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-[#103173]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#103173] tracking-tight leading-tight">
                Lista de Passageiros
              </h1>
              <p className="text-sm font-semibold text-[#73AABF]">
                Gerencie o embarque dos alunos nesta viagem.
              </p>
            </div>
          </div>
        </div>

        {/* Trip Info Cards */}
        <TripInfoCard
          boardingPoint={dadosViagem?.boarding_point ?? "Origem"}
          dropOffPoint={dadosViagem?.drop_off_point ?? "Destino"}
          totalReservations={dadosViagem?.stats.total_reservations ?? 0}
          embarcados={dadosViagem?.stats.total_onboarded ?? 0}
        />

        {/* Tabs + Search + Add Button */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-white rounded-xl p-1 w-fit border border-slate-100 shadow-sm">
            <button
              onClick={() => setAbaAtiva("principal")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                abaAtiva === "principal"
                  ? "bg-[#103173] text-white shadow-sm"
                  : "text-[#103173]/50 hover:text-[#103173] hover:bg-slate-50"
              }`}
            >
              <Users className="h-4 w-4" />
              Principal
              <span
                className={`text-[11px] font-black px-1.5 py-0.5 rounded-md ${
                  abaAtiva === "principal"
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {passageiros.length}
              </span>
            </button>
            {listaEspera.length > 0 && (
              <button
                onClick={() => setAbaAtiva("espera")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  abaAtiva === "espera"
                    ? "bg-orange-400 text-white shadow-sm"
                    : "text-orange-400/60 hover:text-orange-500 hover:bg-orange-50"
                }`}
              >
                <Clock className="h-4 w-4" />
                Espera
                <span
                  className={`text-[11px] font-black px-1.5 py-0.5 rounded-md ${
                    abaAtiva === "espera"
                      ? "bg-white/20 text-white"
                      : "bg-orange-100 text-orange-400"
                  }`}
                >
                  {listaEspera.length}
                </span>
              </button>
            )}
          </div>

          {/* Search + Add */}
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar
              value={busca}
              onChange={(valor) => setBusca(sanitizarBusca(valor))}
            />
            <Button
              onClick={handleAdicionarAvulso}
              className="h-12 px-5 bg-[#23B99A] hover:bg-[#1fa589] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 w-full sm:w-auto transition-all shadow-sm whitespace-nowrap"
            >
              <UserPlus className="h-4 w-4" />
              Servidor Avulso
            </Button>
          </div>
        </div>

        {/* Passenger List */}
        <div className="space-y-2">
          {listaAtual.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white/60 rounded-2xl border border-dashed border-slate-200">
              <div className="h-14 w-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                {abaAtiva === "principal" ? (
                  <Users className="h-6 w-6 text-slate-300" />
                ) : (
                  <ListPlus className="h-6 w-6 text-slate-300" />
                )}
              </div>
              <p className="text-[#73AABF] font-bold text-base">
                {busca
                  ? "Nenhum resultado encontrado."
                  : abaAtiva === "principal"
                    ? "Nenhum passageiro na lista."
                    : "Lista de espera vazia."}
              </p>
              <p className="text-slate-400 text-sm mt-1 font-medium">
                {busca ? "Tente outro termo de busca." : "Os passageiros aparecerão aqui."}
              </p>
            </div>
          ) : (
            listaAtual.map((passageiro) => (
              <PassengerCard
                key={passageiro.reservation_id}
                user_id={passageiro.user_id}
                reservation_id={passageiro.reservation_id}
                trip_id={tripId!}
                nome={passageiro.nome}
                tipo={passageiro.matricula}
                status={passageiro.status as "pendente" | "embarcou" | "espera"}
                isAvulso={passageiro.isAvulso}
                isWaitlist={abaAtiva === "espera"}
                onEmbarcar={handleEmbarcar}
                onCancelarEmbarque={handleDesembarcar}
                onMarcarFalta={handleMarcarFalta}
                onRemoverAvulso={handleRemoverAvulso}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export function PassageirosScreen() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#E4F2F1]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-3 border-[#103173] border-t-transparent rounded-full animate-spin" />
            <p className="font-bold text-[#103173] text-sm">Carregando passageiros...</p>
          </div>
        </div>
      }
    >
      <PassageirosContent />
    </Suspense>
  );
}
