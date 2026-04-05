"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bus, User } from "lucide-react";

// Aceitamos os tipos de usuários possíveis
interface NavigationProps {
  tipoUsuario?: "aluno" | "professor" | "motorista" | "admin";
}

export function Navigation({ tipoUsuario = "aluno" }: NavigationProps) {

  return (
    <nav className="w-full bg-[#103173] text-[#E4F2F1] shadow-md border-b-2 border-[#73AABF]">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-[#F2D022] p-1.5 rounded-md">
            <Bus className="h-5 w-5 text-[#103173]" />
          </div>
          <span className="text-xl font-bold tracking-tight">Rota UEFS</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">

          {/* Minhas Viagens: redireciona para a nova tela dedicada */}
          {tipoUsuario !== "admin" && tipoUsuario !== "motorista" && (
            <Link 
              href={`/minhas-viagens?tipo=${tipoUsuario}`} 
              className="hover:text-[#F2D022] transition-colors"
            >
              Minhas Viagens
            </Link>
          )}

          {/* O link agora envia o tipo de usuário na URL via Query Parameter */}
          <Button asChild className="bg-[#F2D022] hover:bg-[#d9ba1f] text-[#103173] font-bold rounded-md px-4 h-9 cursor-pointer">
            <Link href={`/perfil?tipo=${tipoUsuario}`}>
              <User className="w-4 h-4 mr-2" /> PERFIL
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}