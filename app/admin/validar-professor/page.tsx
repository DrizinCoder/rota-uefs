"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { 
  Users, CheckCircle2, XCircle, FileText, 
  Search, ShieldAlert, ArrowLeft 
} from "lucide-react";

// Mock de Solicitações
const SOLICITACOES_MOCK = [
  { id: "REQ-01", nome: "Marta Ribeiro", matricula: "2024101", departamento: "DEXA", email: "marta@uefs.br", status: "pendente", anexo: "siape-01.pdf" },
  { id: "REQ-02", nome: "Paulo Andrade", matricula: "2024102", departamento: "DTEC", email: "paulo@uefs.br", status: "pendente", anexo: "siape-02.pdf" }
];

export default function AdminValidarProfessorPage() {
  const router = useRouter();
  const [solicitacoes, setSolicitacoes] = useState(SOLICITACOES_MOCK);
  const [busca, setBusca] = useState("");

  const handleAprovar = (id: string) => {
    if (confirm("Deseja aprovar o cadastro deste professor?")) {
      setSolicitacoes(solicitacoes.filter(req => req.id !== id));
      alert("Cadastro aprovado com sucesso!");
    }
  };

  const handleRejeitar = (id: string) => {
    if (confirm("Deseja rejeitar a solicitação deste professor?")) {
      setSolicitacoes(solicitacoes.filter(req => req.id !== id));
      alert("Solicitação rejeitada.");
    }
  };

  const filteredSolicitacoes = solicitacoes.filter(
    (req) => req.nome.toLowerCase().includes(busca.toLowerCase()) || req.matricula.includes(busca)
  );

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

        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#103173] tracking-tight">
              Validar Acesso de Professor
            </h1>
            <p className="text-[#73AABF] text-sm mt-1 font-medium">
              Aprove ou rejeite solicitações de cadastro enviadas por novos professores (Servidores).
            </p>
          </div>
        </header>

        {/* Barra de Pesquisa */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center mb-6">
            <Search className="h-5 w-5 text-slate-400 ml-3 mr-2" />
            <input 
              type="text" 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou matrícula..." 
              className="flex-1 bg-transparent border-none focus:outline-none text-[#103173] placeholder:text-slate-400 text-sm py-2"
            />
        </div>

        {/* Listagem */}
        <div className="grid gap-4">
          {filteredSolicitacoes.length > 0 ? (
            filteredSolicitacoes.map((req) => (
              <div 
                key={req.id} 
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0 border border-orange-200">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#103173] text-lg leading-tight mb-1">{req.nome}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                      <span className="font-bold text-[#103173]">UEFS/Matrícula: {req.matricula}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span>{req.departamento}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span>{req.email}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="text-[#23B99A] underline cursor-pointer flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Ver Anexo
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex items-center gap-2">
                  <button
                    onClick={() => handleAprovar(req.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#23B99A] hover:bg-[#1fa889] text-white px-4 py-2.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Aprovar
                  </button>
                  <button
                    onClick={() => handleRejeitar(req.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm"
                  >
                    <XCircle className="h-4 w-4" /> Rejeitar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <ShieldAlert className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <p className="text-[#103173] font-bold text-lg">Nenhuma solicitação pendente</p>
              <p className="text-slate-500 text-sm mt-1">Todas as contas de professores já foram validadas ou não existem novos cadastros.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
