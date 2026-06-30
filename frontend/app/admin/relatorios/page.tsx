"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminRelatoriosTabs } from "@/features/gerenciar-relatorios/ui/admin-relatorios-tabs";
import { adminService, type RelatorioFormato, type ViagemAdmin } from "@/services/adminService";
import { ArrowLeft } from "lucide-react";

type DownloadSeguroAtual = {
  tripId: string;
  formato: RelatorioFormato;
} | null;

function getMesAtual() {
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  return `${hoje.getFullYear()}-${mes}`;
}

function normalizarTexto(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isViagemConcluida(viagem: ViagemAdmin) {
  const status = normalizarTexto(viagem.status ?? "");
  return status === "completed" || status === "concluida";
}

export default function AdminRelatoriosPage() {
  const router = useRouter();
  const [mesSelecionado, setMesSelecionado] = useState(getMesAtual());
  const [viagens, setViagens] = useState<ViagemAdmin[]>([]);
  const [buscaSeguro, setBuscaSeguro] = useState("");
  const [loadingViagens, setLoadingViagens] = useState(true);
  const [erroViagens, setErroViagens] = useState("");
  const [erroRelatorio, setErroRelatorio] = useState("");
  const [downloadGestao, setDownloadGestao] = useState<RelatorioFormato | null>(null);
  const [downloadSeguroAtual, setDownloadSeguroAtual] = useState<DownloadSeguroAtual>(null);

  useEffect(() => {
    async function carregarViagens() {
      try {
        setLoadingViagens(true);
        setErroViagens("");
        const data = await adminService.listarViagens();
        setViagens(data ?? []);
      } catch (err) {
        console.error("Erro ao carregar viagens para relatórios:", err);
        setErroViagens("Não foi possível carregar as viagens para auditoria.");
      } finally {
        setLoadingViagens(false);
      }
    }

    carregarViagens();
  }, []);

  const viagensConcluidas = useMemo(
    () => viagens.filter((viagem) => isViagemConcluida(viagem)),
    [viagens],
  );

  const viagensSeguroFiltradas = useMemo(() => {
    const termo = normalizarTexto(buscaSeguro.trim());

    if (!termo) return viagensConcluidas;

    return viagensConcluidas.filter((viagem) => {
      const campos = [
        viagem.trip_id,
        viagem.route_name,
        viagem.driver_name,
        viagem.trip_date,
        viagem.bus_license_plate,
        viagem.boarding_point,
        viagem.drop_off_point,
        viagem.status,
      ];

      return campos.some((campo) => normalizarTexto(campo ?? "").includes(termo));
    });
  }, [viagensConcluidas, buscaSeguro]);

  const handleDownloadGestao = async (formato: RelatorioFormato) => {
    if (!mesSelecionado) {
      setErroRelatorio("Selecione um período para gerar o relatório mensal.");
      return;
    }

    try {
      setErroRelatorio("");
      setDownloadGestao(formato);
      await adminService.baixarRelatorioMensal(`${mesSelecionado}-01`, formato);
    } catch (err) {
      console.error("Erro ao gerar relatório mensal:", err);
      setErroRelatorio("Não foi possível gerar o relatório mensal. Tente novamente.");
    } finally {
      setDownloadGestao(null);
    }
  };

  const handleDownloadSeguro = async (tripId: string, formato: RelatorioFormato) => {
    try {
      setErroRelatorio("");
      setDownloadSeguroAtual({ tripId, formato });
      await adminService.baixarRelatorioViagem(tripId, formato);
    } catch (err) {
      console.error("Erro ao gerar relatório de viagem:", err);
      setErroRelatorio("Não foi possível gerar o relatório da viagem. Tente novamente.");
    } finally {
      setDownloadSeguroAtual(null);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 selection:bg-cyan-100 selection:text-cyan-900">
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar
          title="Central de Relatórios"
          subtitle="Acesse relatórios mensais e emita listas nominais para auditoria de seguro."
          buttonText="Voltar"
          buttonIcon={ArrowLeft}
          buttonVariant="outline"
          onAction={() => router.push("/admin")}
        />

        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
          <div className="max-w-7xl mx-auto pb-10">
            <AdminRelatoriosTabs
              mesSelecionado={mesSelecionado}
              setMesSelecionado={setMesSelecionado}
              handleDownloadGestao={handleDownloadGestao}
              handleDownloadSeguro={handleDownloadSeguro}
              viagensSeguro={viagensSeguroFiltradas}
              buscaSeguro={buscaSeguro}
              setBuscaSeguro={setBuscaSeguro}
              loadingViagens={loadingViagens}
              erroViagens={erroViagens}
              erroRelatorio={erroRelatorio}
              downloadGestao={downloadGestao}
              downloadSeguroAtual={downloadSeguroAtual}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
