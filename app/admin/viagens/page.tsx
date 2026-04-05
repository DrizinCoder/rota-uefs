"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { 
  Bus, Plus, Calendar, Clock, Users, 
  CheckCircle2, ShieldAlert, Search,
  UserCheck, AlertTriangle, GraduationCap, ArrowRight,
  PencilLine, Trash2, ArrowLeft
} from "lucide-react";
import Link from "next/link";

// Dados simulados com informações operacionais detalhadas
const VIAGENS_MOCK = [
  {
    id: "VG-0042",
    origem: "Salvador",
    destino: "Feira de Santana",
    data: "15/04/2026",
    horario: "08:30",
    onibus: "XYZ-9876",
    motorista: "Carlos Silva",
    reservasAlunos: 35,
    reservasProfessores: 2,
    checkIns: 32,
    status: "Confirmada",
  },
  {
    id: "VG-0045",
    origem: "Feira de Santana",
    destino: "Salvador",
    data: "17/04/2026",
    horario: "14:00",
    onibus: "ABC-1234",
    motorista: "Ana Souza",
    reservasAlunos: 28,
    reservasProfessores: 0, // Não cumpre quórum legal inicial
    checkIns: 0,
    status: "Pendente",
  }
];

export default function AdminViagensPage() {
  const router = useRouter();
  const [viagens, setViagens] = useState(VIAGENS_MOCK);

  const handleExcluir = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta viagem?")) {
      setViagens((prev) => prev.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f8]">
      <Navigation tipoUsuario="admin" />

      <main className="flex-1 max-w-lg md:max-w-4xl lg:max-w-5xl mx-auto w-full px-4 pt-10 pb-32">
        
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-2 text-sm font-bold text-[#103173] hover:text-[#23B99A] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          VOLTAR PARA ADMIN
        </button>
        {/* Cabeçalho */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#103173] tracking-tight">
              Gestão de Viagens
            </h1>
            <p className="text-[#73AABF] text-sm mt-1 font-medium">
              Visualize escalas, controle quórum e acompanhe embarques em tempo real.
            </p>
          </div>
          
          <Link 
            href="/admin/viagens/cadastro"
            className="flex items-center gap-2 bg-[#F2D022] hover:bg-[#d9ba1f] text-[#103173] font-bold py-2.5 px-5 rounded-xl shadow-sm transition-colors active:scale-95 shrink-0"
          >
            <Plus className="h-5 w-5" />
            Nova Viagem
          </Link>
        </header>

        {/* Barra de Pesquisa */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center mb-8">
            <Search className="h-5 w-5 text-slate-400 ml-3 mr-2" />
            <input 
              type="text" 
              placeholder="Buscar por rota, motorista ou ID da viagem..." 
              className="flex-1 bg-transparent border-none focus:outline-none text-[#103173] placeholder:text-slate-400 text-sm py-2"
            />
        </div>

        {/* Listagem de Viagens */}
        <div className="grid gap-8">
          {viagens.length > 0 ? (
            viagens.map((viagem) => {
              const temProfessor = viagem.reservasProfessores > 0;
              const totalReservas = viagem.reservasAlunos + viagem.reservasProfessores;

              return (
                <div 
                  key={viagem.id} 
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* HEADER DO CARTÃO: Rota e Status */}
                  <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-black text-[#103173] uppercase tracking-wider bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                        {viagem.id}
                      </span>
                      <span className={`text-xs font-black uppercase px-3 py-1.5 rounded-lg ${
                        viagem.status === 'Confirmada' ? 'bg-[#23B99A]/10 text-[#23B99A]' : 'bg-[#F2D022]/20 text-[#b8960a]'
                      }`}>
                        {viagem.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[#103173] font-extrabold text-xl md:text-2xl">
                      {viagem.origem} <ArrowRight className="h-6 w-6 text-[#F2D022]" /> {viagem.destino}
                    </div>
                  </div>

                  {/* CORPO DO CARTÃO: Informações e Métricas */}
                  <div className="p-5 md:p-6 grid md:grid-cols-2 gap-8 md:gap-12">
                    
                    {/* Bloco 1: Informações Operacionais */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                        Detalhes Operacionais
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 bg-[#103173]/5 rounded-xl shrink-0"><Calendar className="h-5 w-5 text-[#103173]"/></div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Data</p>
                            <p className="text-sm font-extrabold text-[#103173] mt-0.5">{viagem.data}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 bg-[#103173]/5 rounded-xl shrink-0"><Clock className="h-5 w-5 text-[#103173]"/></div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Horário</p>
                            <p className="text-sm font-extrabold text-[#103173] mt-0.5">{viagem.horario}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 bg-[#103173]/5 rounded-xl shrink-0"><Bus className="h-5 w-5 text-[#103173]"/></div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Veículo</p>
                            <p className="text-sm font-extrabold text-[#103173] mt-0.5 line-clamp-2">{viagem.onibus}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 bg-[#103173]/5 rounded-xl shrink-0"><UserCheck className="h-5 w-5 text-[#103173]"/></div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Motorista</p>
                            <p className="text-sm font-extrabold text-[#103173] mt-0.5 line-clamp-2">{viagem.motorista}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bloco 2: Quórum e Presença */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                        Quórum e Ocupação
                      </h3>
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                        <div className="flex items-end justify-between mb-5">
                          <div>
                            <p className="text-[11px] font-bold text-slate-500 uppercase mb-1">Reservas</p>
                            <p className="text-3xl font-black text-[#103173]">{totalReservas}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] font-bold text-slate-500 uppercase mb-1">Check-ins</p>
                            <p className="text-3xl font-black text-[#23B99A]">{viagem.checkIns}</p>
                          </div>
                        </div>
                        
                        {/* Separação Professor / Aluno */}
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
                          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-100">
                            <GraduationCap className="h-4 w-4 text-slate-400" /> 
                            <span className="text-xs font-bold text-slate-600">Profs: <span className="text-[#103173]">{viagem.reservasProfessores}</span></span>
                          </div>
                          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-100">
                            <Users className="h-4 w-4 text-slate-400" /> 
                            <span className="text-xs font-bold text-slate-600">Alunos: <span className="text-[#103173]">{viagem.reservasAlunos}</span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>

                  {/* RODAPÉ: Alerta Legal */}
                  <div className={`px-5 md:px-6 py-4 flex items-center gap-3 border-t ${
                    temProfessor ? 'bg-[#23B99A]/5 border-[#23B99A]/10' : 'bg-red-50 border-red-100'
                  }`}>
                    {temProfessor ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-[#23B99A]" /> 
                        <div>
                          <p className="text-sm font-bold text-[#23B99A]">Quórum Legal Atingido</p>
                          <p className="text-xs text-[#1fa889]">A viagem cumpre o requisito de ter ao menos um servidor a bordo.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 text-red-600" /> 
                        <div>
                          <p className="text-sm font-bold text-red-700">Atenção ao Quórum</p>
                          <p className="text-xs text-red-600">Nenhum professor/servidor reservou vaga para esta viagem ainda.</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* AÇÕES DA VIAGEM */}
                  <div className="px-5 md:px-6 py-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <button 
                      onClick={() => router.push(`/admin/viagens/cadastro?id=${viagem.id}`)}
                      className="px-4 py-2 text-sm font-bold text-[#103173] bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <PencilLine className="h-4 w-4" />
                      Editar Viagem
                    </button>
                    <button 
                      onClick={() => handleExcluir(viagem.id)}
                      className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </button>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <Bus className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <p className="text-[#103173] font-bold text-lg">Nenhuma viagem cadastrada</p>
              <p className="text-slate-500 text-sm mt-1">Não há registros de viagens para exibir no momento.</p>
            </div>
          )}
        </div>
      </main>
      <FooterSection />
    </div>
  );
}