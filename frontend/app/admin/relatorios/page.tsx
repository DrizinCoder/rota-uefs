  "use client";

  import { useState } from "react";
  import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminRelatoriosTabs } from "@/features/gerenciar-relatorios/ui/admin-relatorios-tabs";
import { ArrowLeft } from "lucide-react";

  // Mock de dados consolidados para o Relatório de Gestão (RF018)
  const DADOS_GESTAO = {
    mes: "Abril/2026",
    ocupacao: { realizadas: 42, assentosOfertados: 1932, assentosOcupados: 1650, taxa: "85%" },
    quorum: { canceladas: 2, motivo: "Falta de servidor a bordo" },
    segundoOnibus: { acionamentos: 4, ocupacaoMedia: "92%" },
    departamentos: [
      { nome: "DEXA", professores: 12 },
      { nome: "DCHF", professores: 8 },
      { nome: "DTEC", professores: 5 }
    ]
  };

  // Mock de viagens finalizadas para o Relatório de Seguro (RF021)
  const VIAGENS_SEGURO = [
    { id: "VG-0038", origem: "Salvador", destino: "Feira de Santana", data: "14/04/2026", horario: "08:30", onibus: "Marcopolo (XYZ-9876)", motorista: "Carlos Silva", passageiros: 42, status: "Finalizada" },
    { id: "VG-0039", origem: "Feira de Santana", destino: "Salvador", data: "14/04/2026", horario: "18:00", onibus: "Volare (ABC-1234)", motorista: "Ana Souza", passageiros: 28, status: "Finalizada" },
    { id: "VG-0040", origem: "Salvador", destino: "Feira de Santana", data: "15/04/2026", horario: "06:00", onibus: "Marcopolo (XYZ-9876)", motorista: "Carlos Silva", passageiros: 46, status: "Finalizada" },
  ];

  export default function AdminRelatoriosPage() {
    const router = useRouter();
    const [abaAtiva, setAbaAtiva] = useState<"gestao" | "seguro">("gestao");
    const [mesSelecionado, setMesSelecionado] = useState("2026-04");

    const handleDownloadGestao = (formato: string) => {
      // Lógica de exportação (Simulada)
      console.log(`Gerando Relatório de Gestão em ${formato} para ${mesSelecionado}`);
      alert(`Iniciando download do relatório de gestão em ${formato.toUpperCase()}...`);
    };

    const handleDownloadSeguro = (idViagem: string) => {
      // Lógica de exportação (Simulada)
      console.log(`Baixando apólice/lista nominal da viagem ${idViagem}`);
      alert(`Gerando PDF com lista nominal para seguro da viagem ${idViagem}...`);
    };

    return (
      <div className="flex h-screen bg-slate-50 font-sans text-slate-800 selection:bg-cyan-100 selection:text-cyan-900">
        <AdminSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <AdminTopbar 
            title="Central de Relatórios" 
            subtitle="Acesse métricas de faturamento e emita listas para auditoria de seguro." 
            buttonText="Voltar"
            buttonIcon={ArrowLeft}
            buttonVariant="outline"
            onAction={() => router.push('/admin')}
          />

          <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
            <div className="max-w-5xl mx-auto pb-10">
              <AdminRelatoriosTabs 
                abaAtiva={abaAtiva}
                setAbaAtiva={setAbaAtiva}
                mesSelecionado={mesSelecionado}
                setMesSelecionado={setMesSelecionado}
                handleDownloadGestao={handleDownloadGestao}
                handleDownloadSeguro={handleDownloadSeguro}
                DADOS_GESTAO={DADOS_GESTAO}
                VIAGENS_SEGURO={VIAGENS_SEGURO}
              />
            </div>
          </div>
        </main>
      </div>
    );
  }