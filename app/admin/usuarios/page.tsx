"use client";

import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { 
  Plus, 
  UserCircle, 
  ShieldCheck, 
  Search, 
  Pencil, 
  Trash2,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

// Dados simulados contendo apenas administradores
const ADMINISTRADORES = [
  { id: "ADM-001", nome: "Carlos Coordenação", matricula: "999999999"},
  { id: "ADM-002", nome: "Ricardo Santos", matricula: "888888888"},
  { id: "ADM-003", nome: "Juliana Lima", matricula: "777777777"},
];

export default function AdminUsuariosPage() {
  const router = useRouter();

  const handleExcluir = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este administrador?")) {
      console.log(`Excluindo usuário: ${id}`);
      // Lógica de exclusão aqui
    }
  };

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

        {/* Cabeçalho */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#103173] tracking-tight">
              Gestão de Administradores
            </h1>
            <p className="text-[#73AABF] text-sm mt-1 font-medium">
              Gerencie permissões e visualize quem possui acesso administrativo ao sistema.
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

        {/* Barra de Pesquisa */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center mb-6">
            <Search className="h-5 w-5 text-slate-400 ml-3 mr-2" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou matrícula..." 
              className="flex-1 bg-transparent border-none focus:outline-none text-[#103173] placeholder:text-slate-400 text-sm py-2"
            />
        </div>

        {/* Lista de Administradores */}
        <div className="grid gap-4">
          {ADMINISTRADORES.length > 0 ? (
            ADMINISTRADORES.map((admin) => (
              <div 
                key={admin.id} 
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#103173]/5 flex items-center justify-center shrink-0">
                    <UserCircle className="h-6 w-6 text-[#103173]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-lg font-bold text-[#103173]">{admin.nome}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 font-medium">
                      <span className="font-bold text-[#103173]">Administrador</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 mx-1"></span>
                      <span>ID: {admin.id}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 mx-1"></span>
                      <span>Matrícula: {admin.matricula}</span>
                    </div>
                  </div>
                </div>

                {/* Ações: Editar e Excluir */}
                <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                  <button 
                    onClick={() => router.push(`/admin/usuarios/editar/${admin.id}`)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-[#103173] hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </button>
                  <button 
                    onClick={() => handleExcluir(admin.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500 font-medium">
              Nenhum administrador encontrado.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}