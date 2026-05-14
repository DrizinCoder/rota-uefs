"use client";

import { Suspense, useState, useEffect} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";

import { driverService,type PassengerListResponse, type Reservation, type Stats } from "@/services/driverService";

interface PassageiroFormatado {
  id: string;
  nome: string;
  matricula: string;
  status: string;
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

  useEffect(() => {
    const carregarPassageiros = async () => {
      try {
        const dados = await driverService.listarPassageiros(tripId);
        
        console.log("DADOS COMPLETOS:", dados);
        
        // Função auxiliar pra ordenar
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
          id: res.reservation_id,
          nome: res.name,
          matricula: profileMap[res.profile] ?? res.profile,
          status: "pendente",
        }));

        const esperaOrdenada = ordenarPorProfileETimestamp([...dados.waitlist_reservations]);
        const passageirosEspera = esperaOrdenada.map((res) => ({
          id: res.reservation_id,
          nome: res.name,
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

  const alternarCheckIn = (id: string) => {
    setPassageiros(
      passageiros.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: p.status === "embarcou" ? "pendente" : "embarcou",
          };
        }
        return p;
      }),
    );
  };

  const chamarProximo = () => {
    const proximo = passageiros.find((p) => p.status === "espera");

    if (proximo) {
      alert(`Chamando próximo da lista de espera: ${proximo.nome}\nMatrícula: ${proximo.matricula}`);

      setPassageiros(
        passageiros.map((p) =>
          p.id === proximo.id ? { ...p, status: "pendente" } : p,
        ),
      );
    } else {
      alert("Não há mais passageiros na lista de espera.");
    }
  };

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

        <Card className="border-none shadow-lg bg-[#103173] text-white rounded-3xl overflow-hidden mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
                <p className="text-[10px] text-[#73AABF] font-black uppercase tracking-widest mb-1">
                  Trajeto
                </p>
                <div className="flex items-center flex-wrap justify-center sm:justify-start gap-2 text-sm md:text-base font-bold">
                  <CircleDot className="h-5 w-5 text-[#F2D022]" />
                  <span>{dadosViagem?.boarding_point}</span>
                  <span className="text-[#73AABF]">→</span>
                  <MapPin className="h-5 w-5 text-[#73AABF]" />
                  <span>{dadosViagem?.drop_off_point}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl w-full sm:w-fit justify-center">
                <div className="text-center px-4 border-r border-white/20">
                  <p className="text-[10px] text-[#73AABF] font-black uppercase tracking-widest">
                    Vagas Reservadas
                  </p>
                  <p className="text-2xl font-black">{dadosViagem?.stats.total_reservations ?? 0}</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-[10px] text-[#23B99A] font-black uppercase tracking-widest">
                    Embarcados
                  </p>
                  <p className="text-2xl font-black text-[#23B99A]">
                    {embarcados}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 shadow-sm rounded-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#73AABF]" />
            </div>
            <Input
              type="text"
              placeholder="Buscar por nome ou matrícula..."
              value={busca}
              onChange={(e) => setBusca(sanitizarBusca(e.target.value))}
              className="pl-12 h-14 bg-white border-none rounded-2xl text-[#103173] font-bold focus-visible:ring-2 focus-visible:ring-[#F2D022] shadow-sm w-full"
            />
          </div>

          <Button
            onClick={chamarProximo}
            className="h-14 px-6 bg-[#23B99A] hover:bg-[#1fa589] text-white rounded-2xl shadow-sm font-bold text-base flex items-center justify-center gap-2 w-full md:w-auto transition-all"
          >
            <Megaphone className="h-5 w-5" />
            Chamar da Espera
          </Button>
        </div>

        <div className="space-y-3">
          {passageirosFiltrados.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl shadow-sm border border-slate-100">
              <p className="text-[#73AABF] font-bold text-lg">
                Nenhum passageiro encontrado.
              </p>
            </div>
          ) : (
            passageirosFiltrados.map((passageiro) => (
              <Card
                key={passageiro.id}
                className={`border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden ${
                  passageiro.status === "espera" ? "opacity-75 bg-slate-50" : "bg-white"
                }`}
              >
                <CardContent className="p-0 flex items-center">
                  <div
                    className={`w-3 h-full min-h-[80px] shrink-0 ${
                      passageiro.status === "embarcou"
                        ? "bg-[#23B99A]"
                        : passageiro.status === "falta"
                          ? "bg-red-500"
                          : passageiro.status === "espera"
                            ? "bg-orange-400"
                            : "bg-[#F2D022]"
                    }`}
                  />

                  <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                        <User className={`h-6 w-6 ${passageiro.status === "espera" ? "text-slate-400" : "text-[#103173]/50"}`} />
                      </div>
                      <div>
                        <h3 className="font-black text-[#103173] text-base md:text-lg leading-tight">
                          {passageiro.nome}
                        </h3>
                        <p className="text-xs font-bold text-[#73AABF]">
                          {passageiro.matricula}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 ml-16 sm:ml-0">
                      <Badge
                        variant="outline"
                        className={`font-black uppercase tracking-wider text-[10px] py-1 border-2 ${
                          passageiro.status === "embarcou"
                            ? "border-[#23B99A] text-[#23B99A]"
                            : passageiro.status === "falta"
                              ? "border-red-500 text-red-500"
                              : passageiro.status === "espera"
                                ? "border-orange-400 text-orange-500"
                                : "border-[#F2D022] text-[#b39912]"
                        }`}
                      >
                        {passageiro.status === "embarcou" && (
                          <UserCheck className="w-3 h-3 mr-1" />
                        )}
                        {passageiro.status === "pendente" && (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {passageiro.status === "falta" && (
                          <UserX className="w-3 h-3 mr-1" />
                        )}
                        {passageiro.status === "espera" && (
                          <ListPlus className="w-3 h-3 mr-1" />
                        )}
                        {passageiro.status}
                      </Badge>

                      {passageiro.status !== "falta" && passageiro.status !== "espera" && (
                        <Button
                          onClick={() => alternarCheckIn(passageiro.id)}
                          variant="ghost"
                          className={`h-10 px-4 rounded-xl font-bold transition-all ${
                            passageiro.status === "embarcou"
                              ? "text-slate-400 hover:text-red-500 hover:bg-red-50"
                              : "bg-[#103173] text-white hover:bg-[#103B73] shadow-md"
                          }`}
                        >
                          {passageiro.status === "embarcou"
                            ? "Desfazer"
                            : "Embarcar"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
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
