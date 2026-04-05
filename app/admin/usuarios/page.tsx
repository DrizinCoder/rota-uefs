"use client";

import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { Plus, ChevronRight, UserCircle, ShieldCheck, Search } from "lucide-react";
import Link from "next/link";

// Dados simulados baseados na estrutura do Motorista (adaptados para Usuários)
const USUARIOS = [
  { id: "USR-001", nome: "João Silva", matricula: "202300012", tipo: "Aluno", status: "Ativo", viagens: 4 },
  { id: "USR-002", nome: "Maria Oliveira", matricula: "199800045", tipo: "Professor", status: "Inativo", viagens: 12 },
  { id: "USR-003", nome: "Carlos Coordenação", matricula: "999999999", tipo: "Admin", status: "Pendente", viagens: 0 },
];

export default function AdminUsuariosPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f8]">
      <Navigation tipoUsuario="admin" />

      <main className="flex-1 max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto w-full px-4 pt-10 pb-32">
        {/* Cabeçalho no padrão do Dashboard Admin */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-4 w-4 text-[#103173]" />
              <span className="text-[11px] font-bold text-[#103173] uppercase tracking-widest">
                Controle de Acesso
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#103173] tracking-tight">
              Gestão de Usuários
            </h1>
            <p className="text-[#73AABF] text-sm mt-1 font-medium">
              Gerencie cadastros, status e históricos de alunos, professores e administradores.
            </p>
          </div>
          
          <Link 
            href="/admin/usuarios/cadastro"
            className="flex items-center gap-2 bg-[#F2D022] hover:bg-[#d9ba1f] text-[#103173] font-bold py-2.5 px-5 rounded-xl shadow-sm transition-colors active:scale-95 shrink-0"
          >
            <Plus className="h-5 w-5" />
            Novo Administrador
          </Link>
        </header>

        {/* Barra de Pesquisa / Filtro rápida */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center mb-6">
            <Search className="h-5 w-5 text-slate-400 ml-3 mr-2" />
            <input 
              type="text" 
              placeholder="Buscar por nome, matrícula ou ID..." 
              className="flex-1 bg-transparent border-none focus:outline-none text-[#103173] placeholder:text-slate-400 text-sm py-2"
            />
        </div>

        {/* Lista de Usuários (Layout igual ao de Motoristas) */}
        <div className="grid gap-4">
          {USUARIOS.map((usuario) => (
            <div 
              key={usuario.id} 
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow group cursor-pointer"
              onClick={() => router.push(`/admin/usuarios/${usuario.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#103173]/5 flex items-center justify-center shrink-0">
                  <UserCircle className="h-6 w-6 text-[#103173]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-lg font-bold text-[#103173]">{usuario.nome}</p>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${
                      usuario.status === 'Ativo' ? 'bg-[#23B99A]/10 text-[#23B99A]' : 
                      usuario.status === 'Pendente' ? 'bg-[#F2D022]/20 text-[#b8960a]' : 
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {usuario.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 font-medium">
                    <span className="font-bold text-[#103173]">{usuario.tipo}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 mx-1"></span>
                    <span>ID: {usuario.id}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 mx-1"></span>
                    <span>Matrícula: {usuario.matricula}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Viagens</span>
                  <span className="text-[#103173] font-extrabold">{usuario.viagens}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#103173] group-hover:text-white transition-colors ml-auto md:ml-0">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}