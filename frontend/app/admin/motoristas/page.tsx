"use client";

import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { Users, Plus, ChevronRight, UserCircle, ShieldAlert, Bus, Search, ArrowLeft } from "lucide-react";
import { FooterSection } from "@/components/landing/footer-section";
import Link from "next/link";

// Dados simulados baseados na estrutura que você já tem
const MOTORISTAS = [
  { id: "MOT-001", nome: "Carlos Silva", status: "Ativo", viagens: 12 },
  { id: "MOT-002", nome: "Ana Souza", status: "Em Viagem", viagens: 8 },
  { id: "MOT-003", nome: "Roberto Oliveira", status: "Inativo", viagens: 0 },
];

export default function AdminMotoristasPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f8]">
      <Navigation tipoUsuario="admin" />

      <main className="flex-1 max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto w-full px-4 pt-10 pb-32">
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-2 text-sm font-bold text-[#103173] hover:text-[#23B99A] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          VOLTAR PARA ADMIN
        </button>

        {/* Cabeçalho no padrão do Dashboard Admin */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#103173] tracking-tight">
              Gestão de Motoristas
            </h1>
            <p className="text-[#73AABF] text-sm mt-1 font-medium">
              Gerencie cadastros, status e históricos dos motoristas da frota.
            </p>
          </div>

          <Link
            href="/admin/motoristas/cadastro"
            className="flex items-center gap-2 bg-[#F2D022] hover:bg-[#d9ba1f] text-[#103173] font-bold py-2.5 px-5 rounded-xl shadow-sm transition-colors active:scale-95 shrink-0"
          >
            <Plus className="h-5 w-5" />
            Novo Motorista
          </Link>
        </header>

        {/* Barra de Pesquisa / Filtro rápida */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center mb-6">
          <Search className="h-5 w-5 text-slate-400 ml-3 mr-2" />
          <input
            type="text"
            placeholder="Buscar por nome ou ID..."
            className="flex-1 bg-transparent border-none focus:outline-none text-[#103173] placeholder:text-slate-400 text-sm py-2"
          />
        </div>

        {/* Lista de Motoristas */}
        <div className="grid gap-4">
          {MOTORISTAS.map((motorista) => (
            <div
              key={motorista.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow group cursor-pointer"
              onClick={() => router.push(`/admin/motoristas/${motorista.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#103173]/5 flex items-center justify-center shrink-0">
                  <UserCircle className="h-6 w-6 text-[#103173]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-lg font-bold text-[#103173]">{motorista.nome}</p>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${motorista.status === 'Ativo' ? 'bg-[#23B99A]/10 text-[#23B99A]' :
                        motorista.status === 'Em Viagem' ? 'bg-[#F2D022]/20 text-[#b8960a]' :
                          'bg-slate-100 text-slate-500'
                      }`}>
                      {motorista.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                    <span>ID: {motorista.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Editar</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#103173] group-hover:text-white transition-colors ml-auto md:ml-0">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <FooterSection />
    </div>
  );
}