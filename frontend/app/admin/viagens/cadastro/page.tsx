"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminService, type CadastroViagemPayload, type Rota,type Motorista,type BusAdmin } from "@/services/adminService";
import { ArrowLeft } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminViagensForm } from "@/features/gerenciar-viagens/ui/admin-viagens-form";

function CadastroViagemContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get("id");
  const isEditMode = !!tripId;

  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [onibus, setOnibus] = useState<BusAdmin[]>([]);
  
  const [rotaSelecionada, setRotaSelecionada] = useState("");
  const [veiculoSelecionado, setVeiculoSelecionado] = useState("");
  const [motoristaId, setMotoristaId] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [recorrencia, setRecorrencia] = useState("Single");
  const [tipoViagem, setTipoViagem] = useState("ida");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const buscarDados = async () => {
    try {
      const resultados = await Promise.allSettled([
        adminService.listarMotoristas(),
        adminService.listarRotas(),
        adminService.listarOnibus(),
        adminService.listarViagens(),
      ]);

      // Tratamos cada resultado individualmente
      if (resultados[0].status === "fulfilled") {
        setMotoristas(resultados[0].value);
      }
      
      if (resultados[1].status === "fulfilled") {
        setRotas(resultados[1].value);
      } else {
        // Se a rota falhar setamos array vazio
        setRotas([]);
      }

      if (resultados[2].status === "fulfilled") {
        setOnibus(resultados[2].value);
      }

      if (tripId && resultados[3].status === "fulfilled") {
        const viagens = resultados[3].value;
        const v = viagens.find(x => x.trip_id === tripId);
        if (v) {
          setRotaSelecionada(v.route_id);
          setVeiculoSelecionado(v.bus_license_plate);
          setMotoristaId(v.driver_id);
          setData(v.trip_date);
          setHorario(v.departure_time);
        }
      }

    } catch (err) {
      setErro("Erro inesperado ao carregar dados.");
    }
  };
  buscarDados();
}, [tripId]);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso(false);

    // Validação básica
    if (!rotaSelecionada || !veiculoSelecionado || !motoristaId || !data || !horario) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    
    const horarioFormatado = horario.length === 5 ? `${horario}:00` : horario;

    const payload: CadastroViagemPayload = {
      bus_license_plate: veiculoSelecionado,
      driver_id: motoristaId,
      route_id: rotaSelecionada,
      trip_date: data,
      departure_time: horarioFormatado,
      recurrence: recorrencia,
    };

    try {
      setLoading(true);
      if (isEditMode && tripId) {
        await adminService.atualizarViagem(tripId, payload);
      } else {
        await adminService.cadastrarViagem(payload);
      }
      setSucesso(true);
      setTimeout(() => router.back(), 2000);
    } catch (err: any) {
      setErro(err?.response?.data?.message ?? "Erro ao salvar viagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex h-screen bg-slate-50 font-sans text-slate-800 selection:bg-cyan-100 selection:text-cyan-900">
        <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar 
          title={isEditMode ? "Editar Viagem" : "Nova Viagem"} 
          subtitle={isEditMode ? "Atualize os dados da viagem" : "Cadastre uma nova viagem"} 
          buttonText="Voltar"
          buttonIcon={ArrowLeft}
          buttonVariant="outline"
          onAction={() => router.back()}
        />

        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
          <div className="max-w-4xl mx-auto pb-10">
            <AdminViagensForm 
              motoristas={motoristas}
              rotas={rotas}
              onibus={onibus}
              rotaSelecionada={rotaSelecionada}
              setRotaSelecionada={setRotaSelecionada}
              veiculoSelecionado={veiculoSelecionado}
              setVeiculoSelecionado={setVeiculoSelecionado}
              motoristaId={motoristaId}
              setMotoristaId={setMotoristaId}
              data={data}
              setData={setData}
              horario={horario}
              setHorario={setHorario}
              recorrencia={recorrencia}
              setRecorrencia={setRecorrencia}
              tipoViagem={tipoViagem}
              setTipoViagem={setTipoViagem}
              erro={erro}
              sucesso={sucesso}
              loading={loading}
              onSalvar={handleSalvar}
              isEditMode={isEditMode}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CadastroViagemPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Carregando...</div>}>
      <CadastroViagemContent />
    </Suspense>
  );
}