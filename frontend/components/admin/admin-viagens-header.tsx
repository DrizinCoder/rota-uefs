"use client";

import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminViagensHeader() {
  const router = useRouter();

  return (
    <>
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
    </>
  );
}
