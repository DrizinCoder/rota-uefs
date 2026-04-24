"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { 
  ArrowLeft, Save, MapPin, Calendar, Clock, Bus, 
  UserCircle, Users, Repeat, ArrowRightLeft, AlertTriangle, CheckCircle2 
} from "lucide-react";

export default function CadastroViagemPage() {
  const router = useRouter();

  // Estados do formulário
  const [tipoViagem, setTipoViagem] = useState("ida");
  const [recorrencia, setRecorrencia] = useState("individual");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [onibus, setOnibus] = useState("");
  const [motorista, setMotorista] = useState("");
  const [quorum, setQuorum] = useState("");
  const [vagas, setVagas] = useState("46");

  // Estados de feedback
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso(false);
    const origemNormalizada = origem.trim();
    const destinoNormalizado = destino.trim();
    const quorumNumero = Number.parseInt(quorum, 10);
    const vagasNumero = Number.parseInt(vagas, 10);

    if (!origemNormalizada || !destinoNormalizado || !data || !horario || !onibus || !motorista || !quorum || !vagas) {
      setErro("Inconsistência de preenchimento: Todos os campos são obrigatórios.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (origemNormalizada.toLowerCase() === destinoNormalizado.toLowerCase()) {
      setErro("Origem e destino não podem ser iguais.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (Number.isNaN(quorumNumero) || Number.isNaN(vagasNumero)) {
      setErro("Quórum e vagas devem ser números inteiros válidos.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (quorumNumero < 1 || vagasNumero < 1) {
      setErro("Quórum e vagas devem ser maiores que zero.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (vagasNumero > 46) {
      setErro("A capacidade máxima permitida é de 46 vagas por veículo.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (quorumNumero > vagasNumero) {
      setErro("O quórum mínimo não pode ser maior que o número de vagas.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const agora = new Date();
    const dataHoraViagem = new Date(`${data}T${horario}:00`);
    if (Number.isNaN(dataHoraViagem.getTime()) || dataHoraViagem < agora) {
      setErro("Data e horário de saída devem estar no futuro.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Simulação de Sucesso
    setSucesso(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Redireciona após 2 segundos
    setTimeout(() => {
      router.push("/admin/viagens");
    }, 2000);
  };

  return (
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

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Recorrência</label>
                <select 
                  value={recorrencia} onChange={(e) => setRecorrencia(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-[#103173] focus:outline-none"
                >
                  <option value="individual">Viagem Única (Individual)</option>
                  <option value="semanal">Escala Semanal Fixa</option>
                  <option value="mensal">Escala Mensal Fixa</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Origem</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" value={origem} onChange={(e) => setOrigem(e.target.value)} placeholder="Ex: Salvador (Iguatemi)" className="w-full pl-9 p-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#103173] focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Destino</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Ex: Feira de Santana (UEFS)" className="w-full pl-9 p-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#103173] focus:outline-none" />
                </div>
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
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Veículo Escalado</label>
                <div className="relative">
                  <Bus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select value={onibus} onChange={(e) => setOnibus(e.target.value)} className="w-full pl-9 p-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#103173] focus:outline-none bg-white">
                    <option value="" disabled>Selecione o ônibus...</option>
                    <option value="volare-01">Volare Fly 10 (ABC-1234) - 30 vagas</option>
                    <option value="marcopolo-02">Marcopolo Paradiso (XYZ-9876) - 46 vagas</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Motorista</label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select value={motorista} onChange={(e) => setMotorista(e.target.value)} className="w-full pl-9 p-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#103173] focus:outline-none bg-white">
                    <option value="" disabled>Selecione o motorista...</option>
                    <option value="mot-01">Carlos Silva (MOT-001)</option>
                    <option value="mot-02">Ana Souza (MOT-002)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
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
            </div>
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
  );
}