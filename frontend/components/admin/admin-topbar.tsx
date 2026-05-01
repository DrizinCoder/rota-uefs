"use client";

import { Menu, MessageSquare, Plus, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminTopbarProps {
  onNovoOnibus: () => void;
}

export function AdminTopbar({ onNovoOnibus }: AdminTopbarProps) {
  return (
    <header className="h-20 bg-white flex items-center justify-between px-6 shadow-sm z-10 shrink-0 border-b border-slate-200">
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-cyan-600 lg:hidden">
          <Menu size={24} />
        </button>
        <div>
          <h1 className="font-bold text-slate-800 tracking-wide text-lg flex items-center gap-2">
           GESTÃO DE FROTA
          </h1>
          <p className="text-xs text-slate-500 font-medium">Visão geral e controle operacional.</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-bold ml-2 text-slate-600">ADMINISTRADOR</span>
        </div>
        <Button
          className="h-10 bg-[#23B99A] hover:bg-[#1d957c] text-white font-semibold shadow-sm transition-all rounded-lg"
          onClick={onNovoOnibus}
        >
          <Plus className="h-4 w-4 mr-2" /> Novo Ônibus
        </Button>
      </div>
    </header>
  );
}