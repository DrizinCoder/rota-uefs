"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { NavigationAdmin } from "@/components/landing/navigation_admin";
import { FooterSection } from "@/components/landing/footer-section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LucideIcon } from "lucide-react";
import { FROTA_MOCK, type OnibusFrota, type StatusOnibus } from "@/lib/mock/frota";
import {
  Bus,
  Plus,
  Route,
  Search,
  ShieldAlert,
  Trash2,
  UserCircle,
  UserRound,
  PencilLine,
  GraduationCap,
  BarChart3,
  Settings2
} from "lucide-react";

type FiltroStatus = "todos" | StatusOnibus;

export default function PaginaAdmin() {
  const router = useRouter();
  const [frota, setFrota] = useState<OnibusFrota[]>(() =>
    FROTA_MOCK.map((onibus) => ({ ...onibus, rotasVinculadas: [...onibus.rotasVinculadas] })),
  );
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todos");

  const frotaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return frota.filter((onibus) => {
      const correspondeStatus = filtroStatus === "todos" || onibus.status === filtroStatus;
      const correspondeBusca = termo.length === 0 || onibus.placa.toLowerCase().includes(termo);

      return correspondeStatus && correspondeBusca;
    });
  }, [frota, busca, filtroStatus]);

  const metricas = useMemo(() => {
    const onibusAtivos = frota.filter((item) => item.status === "ativo").length;
    const viagensHoje = frota
      .filter((item) => item.status === "ativo")
      .reduce((total, item) => total + item.viagensHoje, 0);

    return { onibusAtivos, viagensHoje };
  }, [frota]);

  const abrirTelaCadastro = (onibus?: OnibusFrota) => {
    if (!onibus) {
      router.push("/admin/onibus?modo=novo");
      return;
    }
    router.push(`/admin/onibus?id=${onibus.id}`);
  };

  const handleRemover = (onibus: OnibusFrota) => {
    if (onibus.status === "ativo" && onibus.viagensHoje > 0) {
      window.alert(
        `O ônibus ${onibus.placa} está com viagens em andamento/programadas hoje. Realoque as rotas antes de remover.`,
      );
      return;
    }

    const confirmado = window.confirm(`Remover o ônibus ${onibus.placa} do sistema?`);
    if (!confirmado) return;

    setFrota((atual) => atual.filter((item) => item.id !== onibus.id));
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans pb-24 text-slate-900">
      <Navigation tipoUsuario="admin"/>
      
      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* CABEÇALHO DO DASHBOARD */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#103173] flex items-center gap-3 tracking-tight">
              Gestão de Onibus
            </h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">
              Visão geral e controle operacional da frota.
            </p>
          </div>

          <Button
            className="h-10 bg-[#23B99A] hover:bg-[#1d957c] text-white font-semibold shadow-sm transition-all w-full sm:w-auto rounded-lg"
            onClick={() => abrirTelaCadastro()}
          >
            <Plus className="h-4 w-4 mr-2" /> Novo Ônibus
          </Button>
        </header>

        {/* MÉTRICAS (KPIs) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total da Frota"
            valor={frota.length.toString()}
            destaque="Veículos registrados"
            icon={Bus}
          />
          <MetricCard
            label="Ônibus Ativos"
            valor={metricas.onibusAtivos.toString()}
            destaque="Em operação hoje"
            icon={Settings2}
          />
          <MetricCard
            label="Viagens Hoje"
            valor={metricas.viagensHoje.toString()}
            destaque="Escalas em andamento"
            icon={Route}
          />
        </section>

        {/* BARRA DE FERRAMENTAS / NAVEGAÇÃO RÁPIDA */}
        <NavigationAdmin />

        {/* ÁREA DE LISTAGEM DOS ÔNIBUS */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Cabeçalho da Tabela / Filtros */}
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
            <h2 className="text-lg font-bold text-[#103173]">Gestão de Frota</h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  placeholder="Buscar por placa..."
                  className="pl-9 h-9 bg-white border-slate-200 focus-visible:ring-[#103173] text-sm"
                />
              </div>

              <Tabs value={filtroStatus} onValueChange={(value) => setFiltroStatus(value as FiltroStatus)} className="w-full sm:w-auto">
                <TabsList className="h-9 bg-slate-100 p-1 w-full grid grid-cols-3">
                  <TabsTrigger value="todos" className="text-xs font-semibold">Todos</TabsTrigger>
                  <TabsTrigger value="ativo" className="text-xs font-semibold">Ativos</TabsTrigger>
                  <TabsTrigger value="inativo" className="text-xs font-semibold">Inativos</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Lista Estilo Row (Tabela responsiva) */}
          <div className="divide-y divide-slate-100">
            {frotaFiltrada.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="bg-slate-100 p-3 rounded-full mb-3">
                  <Search className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-base font-bold text-slate-700">Nenhum ônibus encontrado</p>
                <p className="text-sm text-slate-500 mt-1">Ajuste os filtros ou tente uma nova busca.</p>
              </div>
            ) : (
              frotaFiltrada.map((onibus) => {
                const statusInfo = getStatusInfo(onibus.status);

                return (
                  <div key={onibus.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-slate-50/80 transition-colors gap-4">
                    
                    {/* Info Principal */}
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${onibus.status === 'ativo' ? 'bg-[#E4F2F1] border-[#73AABF]/30' : 'bg-slate-100 border-slate-200'}`}>
                        <Bus className={`h-5 w-5 ${onibus.status === 'ativo' ? 'text-[#103173]' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <p className="font-bold text-[#103173] text-base leading-none mb-1.5">{onibus.placa}</p>
                        <p className="text-xs font-medium text-slate-500">
                          {onibus.viagensHoje} {onibus.viagensHoje === 1 ? 'viagem registrada' : 'viagens registradas'} hoje
                        </p>
                      </div>
                    </div>

                    {/* Status & Ações */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <Badge variant="secondary" className={`${statusInfo.className} shadow-none border-0`}>
                        {statusInfo.label}
                      </Badge>

                      <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#73AABF] hover:text-[#103173] hover:bg-[#E4F2F1]"
                          onClick={() => abrirTelaCadastro(onibus)}
                          title="Editar"
                        >
                          <PencilLine className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleRemover(onibus)}
                          title="Remover"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <FooterSection />

      {/* --- BARRA DE NAVEGAÇÃO ENTRE PERFIS (DEVELOPER BAR) --- */}
      {/* Deixada um pouco mais discreta para não roubar a atenção do dashboard */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 z-50 border border-slate-700 w-[90%] md:w-auto overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-widest pl-2">
          Dev Mode
        </span>
        <div className="w-px h-4 bg-slate-700 shrink-0" />
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" className="hover:bg-slate-800 text-white font-medium text-xs h-8 px-3 rounded-full shrink-0" onClick={() => router.push("/passageiro")}>
            <UserCircle className="h-3.5 w-3.5 mr-1.5" /> Passageiro
          </Button>
          <Button size="sm" variant="ghost" className="hover:bg-slate-800 text-white font-medium text-xs h-8 px-3 rounded-full shrink-0" onClick={() => router.push("/professor")}>
            <GraduationCap className="h-3.5 w-3.5 mr-1.5" /> Professor
          </Button>
          <Button size="sm" variant="ghost" className="hover:bg-slate-800 text-white font-medium text-xs h-8 px-3 rounded-full shrink-0" onClick={() => router.push("/motorista")}>
            <Bus className="h-3.5 w-3.5 mr-1.5" /> Motorista
          </Button>
          <Button size="sm" variant="ghost" className="bg-white text-slate-900 hover:bg-slate-200 font-bold text-xs h-8 px-4 rounded-full shrink-0 shadow-sm" onClick={() => router.push("/admin")}>
            Admin
          </Button>
        </div>
      </div>
    </div>
  );
}

// Funções auxiliares mantidas intactas
function getStatusInfo(status: StatusOnibus) {
  if (status === "ativo") {
    return {
      label: "ATIVO",
      className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    };
  }

  return {
    label: "INATIVO",
    className: "bg-slate-100 text-slate-600 hover:bg-slate-100",
  };
}

interface MetricCardProps {
  label: string;
  valor: string;
  destaque: string;
  icon: LucideIcon;
}

function MetricCard({ label, valor, destaque, icon: Icon }: MetricCardProps) {
  return (
    <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden group">
      <CardContent className="p-5 flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-[#103173] leading-none">{valor}</p>
          <p className="text-xs font-medium text-slate-400">{destaque}</p>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[#73AABF] group-hover:text-[#103173] group-hover:bg-[#E4F2F1] transition-colors">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}