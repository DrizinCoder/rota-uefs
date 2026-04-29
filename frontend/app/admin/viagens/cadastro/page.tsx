"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { 
  ArrowLeft, Save, MapPin, Calendar, Clock, Bus, 
  UserCircle, Users, Repeat, ArrowRightLeft, AlertTriangle, CheckCircle2 
} from "lucide-react";
import { adminService, type CadastroViagemPayload, type Rota,type Motorista,type BusAdmin } from "@/services/adminService";

export default function CadastroViagemPage() {
  const router = useRouter();

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

    } catch (err) {
      setErro("Erro inesperado ao carregar dados.");
    }
  };
  buscarDados();
}, []);

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

    console.log("🚀 ENVIANDO PAYLOAD:", JSON.stringify(payload, null, 2));

    try {
      setLoading(true);
      await adminService.cadastrarViagem(payload);
      setSucesso(true);
      setTimeout(() => router.back(), 2000);
    } catch (err: any) {
      setErro(err?.response?.data?.message ?? "Erro ao cadastrar viagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Carregando...</div>}>
      <div className="flex flex-col min-h-screen bg-[#f0f4f8]">
      <Navigation tipoUsuario="admin" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pt-6 pb-32">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-[#103173] hover:text-[#103173]/70 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Viagens
        </button>

        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#103173] tracking-tight">
            Nova Viagem
          </h1>
          <p className="text-[#73AABF] text-sm mt-1 font-medium">
            Configure a rota, horários e equipe operacional da viagem.
          </p>
        </header>

        {/* Feedback de Erro */}
        {erro && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-800">Falha ao cadastrar</p>
              <p className="text-sm text-red-600 mt-1">{erro}</p>
            </div>
          </div>
        )}

        {/* Feedback de Sucesso */}
        {sucesso && (
          <div className="mb-6 p-4 rounded-xl bg-[#23B99A]/10 border border-[#23B99A]/30 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#23B99A] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#1fa889]">Sucesso!</p>
              <p className="text-sm text-[#23B99A] mt-1">Viagem cadastrada e associada ao veículo com sucesso. Redirecionando...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSalvar} className="space-y-6">
          
          {/* SEÇÃO 1: Roteiro e Tipo */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-extrabold text-[#103173] mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ArrowRightLeft className="h-5 w-5 text-[#F2D022]" /> 
              Roteiro e Tipo
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Modalidade</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="tipo" value="ida" checked={tipoViagem === "ida"} onChange={(e) => setTipoViagem(e.target.value)} className="accent-[#103173]" />
                    <span className="text-sm font-bold text-[#103173]">Somente Ida</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="tipo" value="ida_volta" checked={tipoViagem === "ida_volta"} onChange={(e) => setTipoViagem(e.target.value)} className="accent-[#103173]" />
                    <span className="text-sm font-bold text-[#103173]">Ida e Volta</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* SELECT DE RECORRÊNCIA */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Recorrência</label>
                <select 
                  value={recorrencia} 
                  onChange={(e) => setRecorrencia(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-[#103173] focus:outline-none"
                >
                  <option value="Single">Viagem Única (Individual)</option>
                  <option value="Weekly">Escala Semanal Fixa</option>
                  <option value="Monthly">Escala Mensal Fixa</option>
                </select>
              </div>

              {/* SELECT DE ROTA (DINÂMICO) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Rota</label>
                <select 
                  value={rotaSelecionada} 
                  onChange={(e) => setRotaSelecionada(e.target.value)}
                  disabled={rotas.length === 0}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-[#103173] focus:outline-none disabled:bg-slate-100 disabled:text-slate-400">
                  <option value="" disabled>
                    {rotas.length === 0 ? "Carregando rotas..." : "Selecione a rota"}
                  </option>
                  
                  {rotas.map((rota) => (
                    <option key={rota.route_id} value={rota.route_id}>
                      {rota.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: Data e Horário */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-extrabold text-[#103173] mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="h-5 w-5 text-[#F2D022]" /> 
              Agendamento
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data de Saída</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="w-full pl-9 p-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#103173] focus:outline-none text-[#103173] font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Horário de Saída</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input type="time" value={horario} onChange={(e) => setHorario(e.target.value)} className="w-full pl-9 p-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#103173] focus:outline-none text-[#103173] font-medium" />
                </div>
              </div>
            </div>
          </div>

          {/* SEÇÃO 3: Operacional */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-extrabold text-[#103173] mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bus className="h-5 w-5 text-[#F2D022]" /> 
              Equipe e Operacional
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Veículo</label>
                <div className="relative">
                  <Bus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select 
                    value={veiculoSelecionado} 
                    onChange={(e) => setVeiculoSelecionado(e.target.value)}
                    disabled={onibus.length === 0}
                    className="w-full pl-8 p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-[#103173] focus:outline-none disabled:bg-slate-100 disabled:text-slate-400">
                    <option value="" disabled>
                      {onibus.length === 0 ? "Carregando veículos..." : "Selecione o Veículo"}
                    </option>
                    
                    {onibus.map((onibus) => (
                      <option key={onibus.bus_plate} value={onibus.bus_plate}>
                        {onibus.bus_plate} | {onibus.capacity}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Motorista</label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select 
                    value={motoristaId} 
                    onChange={(e) => setMotoristaId(e.target.value)}
                    disabled={motoristas.length === 0}
                    className="w-full pl-8 p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-[#103173] focus:outline-none disabled:bg-slate-100 disabled:text-slate-400">
                    <option value="" disabled>
                      {motoristas.length === 0 ? "Carregando motoristas..." : "Selecione o motorista"}
                    </option>
                    
                    {motoristas.map((motorista) => (
                      <option key={motorista.user_id} value={motorista.user_id}>
                        {motorista.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quórum Mínimo</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="number" min="1" max="46" value={quorum} onChange={(e) => setQuorum(e.target.value)} placeholder="Ex: 20" className="w-full pl-9 p-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#103173] focus:outline-none" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Mínimo de passageiros para confirmar viagem</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Capacidade (Máx 46)</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="number" min="1" max="46" value={vagas} onChange={(e) => setVagas(e.target.value)} placeholder="46" className="w-full pl-9 p-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#103173] focus:outline-none" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Limite do sistema e do veículo</p>
              </div>
            </div> */}
          </div>

          {/* Ações */}
          <div className="flex flex-col md:flex-row gap-3 pt-4">
            <button 
              type="submit" 
              className="flex-1 bg-[#23B99A] text-white py-3.5 rounded-xl font-extrabold text-lg flex items-center justify-center gap-2 hover:bg-[#1fa889] transition-all active:scale-[0.98] shadow-md"
            >
              <Save className="h-5 w-5" />
              Salvar Viagem
            </button>
            <button 
              type="button" 
              onClick={() => router.back()}
              className="md:w-32 bg-white text-slate-500 border border-slate-200 py-3.5 rounded-xl font-bold flex items-center justify-center hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
      <FooterSection />
    </div>
    </Suspense>
  );
}