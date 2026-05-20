"use client";

import { Suspense, useState, useEffect} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TripInfoCard } from "@/components/motorista/TripInfoCard";
import { SearchBar } from "@/components/motorista/SearchBar";
import { PassengerCard } from "@/components/motorista/PassengerCard";
import {
  ArrowLeft,
  Search,
  UserCheck,
  Clock,
  UserX,
  User,
  MapPin,
  CircleDot,
  ClipboardList,
  Megaphone,
  ListPlus,
  UserPlus,
} from "lucide-react";

import { driverService ,type PassengerListResponse, type Reservation } from "@/services/driverService";

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
  const [dadosViagem, setDadosViagem] = useState<PassengerListResponse  | null>(null);

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

  const embarcados = passageiros.filter((p) => p.status === "embarcou").length;

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
        setPassageiros(
          passageiros.map((p) =>
            p.reservation_id === reservation_id ? { ...p, status: "embarcou" } : p
          )
        );
      }
    } catch (erro) {
      console.error("Erro ao embarcar:", erro);
    }
  };

  const handleDesembarcar = async (reservation_id: string) => {
    try{
      const resultado = await driverService.desembarcar(reservation_id);
      if (resultado.success) {
        setPassageiros(
          passageiros.map((p) =>
            p.reservation_id === reservation_id ? { ...p, status: "pendente" } : p
          )
        );
      }
    } catch (erro) {
      console.error("Erro ao desembarcar:", erro);status
    }
  }

  const handleMarcarFalta = async (reservation_id: string) => {
    try{
      const resultado = await driverService.marcarFalta(reservation_id);
      if (resultado.success) {
        await carregarPassageiros();
      }
    } catch (erro) {
      console.error("Erro ao marcar falta:", erro);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1]">
      <Navigation tipoUsuario="Driver" />

      <main className="flex-1 w-full max-w-4xl mx-auto py-10 px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-white py-2 px-4 rounded-full shadow-md text-[#103173] font-black uppercase text-sm hover:opacity-70 transition-all mb-8 w-fit"
        >
          <ArrowLeft className="h-5 w-5" /> Voltar
        </button>

        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-[#103173] flex items-center gap-3 tracking-tight">
              <div className="bg-[#F2D022] p-2 rounded-xl shadow-sm">
                <ClipboardList className="h-10 w-10 text-[#103173]" />
              </div>
              Lista de Passageiros
            </h1>
            <p className="text-[#73AABF] font-bold text-lg">
              Gerencie o embarque dos alunos nesta viagem.
            </p>
          </div>
          <Badge
            variant="outline"
            className="w-fit border-2 border-[#103173] text-[#103173] font-black px-4 py-2 bg-white"
          >
            ROTA: {dadosViagem?.route_name}
          </Badge>
        </header>

        <TripInfoCard
          boardingPoint={dadosViagem?.boarding_point ?? "Origem"}
          dropOffPoint={dadosViagem?.drop_off_point ?? "Destino"}
          totalReservations={dadosViagem?.stats.total_reservations ?? 0}
          embarcados={embarcados}
        />

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <SearchBar
            value={busca}
            onChange={(valor) => setBusca(sanitizarBusca(valor))}
          />

          <Button
            onClick={handleAdicionarAvulso}
            className="h-14 px-6 bg-[#23B99A] hover:bg-[#1fa589] text-white rounded-2xl shadow-sm font-bold text-base flex items-center justify-center gap-2 w-full md:w-auto transition-all"
          >
            <UserPlus className="h-5 w-5" />
            Adicionar Servidor Avulso
          </Button>
        </div>

        <div className="space-y-8">

          {/* LISTA PRINCIPAL */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">

              <div>
                <h2 className="text-2xl font-black text-[#103173]">
                  Lista Principal
                </h2>

                <p className="text-sm font-bold text-[#73AABF]">
                  Passageiros confirmados
                </p>
              </div>
            </div>

            {passageirosFiltrados.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-3xl shadow-sm border border-slate-100">
                <p className="text-[#73AABF] font-bold text-lg">
                  Nenhum passageiro encontrado.
                </p>
              </div>
            ) : (
              passageirosFiltrados.map((passageiro) => (
                <PassengerCard
                  key={passageiro.reservation_id}
                  user_id={passageiro.user_id}
                  reservation_id={passageiro.reservation_id}
                  trip_id={tripId!}
                  nome={passageiro.nome}
                  tipo={passageiro.matricula}
                  status={passageiro.status as "pendente" | "embarcou" | "espera"}
                  isAvulso={passageiro.isAvulso}
                  isWaitlist={false}
                  onEmbarcar={handleEmbarcar}
                  onCancelarEmbarque={handleDesembarcar}
                  onMarcarFalta={handleMarcarFalta}
                  onRemoverAvulso={handleRemoverAvulso}
                />
              ))
            )}
          </section>

          {/* LISTA DE ESPERA */}
          {listaEsperaFiltrada.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-400 flex items-center justify-center">
                  <ListPlus className="h-5 w-5 text-white" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-[#103173]">
                    Lista de Espera
                  </h2>

                  <p className="text-sm font-bold text-[#73AABF]">
                    Passageiros aguardando vaga
                  </p>
                </div>
              </div>

              {listaEsperaFiltrada.map((passageiro) => (
                <PassengerCard
                  key={passageiro.reservation_id}
                  user_id={passageiro.user_id}
                  reservation_id={passageiro.reservation_id}
                  trip_id={tripId!}
                  nome={passageiro.nome}
                  tipo={passageiro.matricula}
                  isAvulso={passageiro.isAvulso}
                  status="espera"
                  isWaitlist={true}
                  onEmbarcar={handleEmbarcar}
                  onCancelarEmbarque={handleDesembarcar}
                  onMarcarFalta={handleMarcarFalta}
                  onRemoverAvulso={handleRemoverAvulso}
                />
              ))}
            </section>
          )}
        </div>
      </main>    </div>
  );
}

export function PassageirosScreen() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#E4F2F1] font-bold text-[#103173]">
          Carregando passageiros...
        </div>
      }
    >
      <PassageirosContent />
    </Suspense>
  );
}
