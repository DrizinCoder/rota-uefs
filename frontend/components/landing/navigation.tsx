"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Logo } from "./logo";

// Aceitamos os tipos de usuários possíveis
interface NavigationProps {
  tipoUsuario?: "Student" | "Staff" | "Driver" | "Admin";
}

export function Navigation({ tipoUsuario = "Student" }: NavigationProps) {

  return (
    <nav className="w-full bg-slate-950 shadow-xl border-b border-white/10">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />


        <div className="flex items-center gap-6 text-sm font-medium">

          {/* Minhas Viagens: redireciona para a nova tela dedicada */}
          {tipoUsuario !== "Admin" && tipoUsuario !== "Driver" && (
            <Link 
              href={`/minhas-viagens?tipo=${tipoUsuario}`} 
              className="text-white/80 hover:text-cyan-500 font-bold transition-colors"
            >
              Minhas Viagens
            </Link>
          )}
          

          {/* O link agora envia o tipo de usuário na URL via Query Parameter */}
          <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-extrabold rounded-lg px-5 h-10 transition-all hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95 cursor-pointer">
            <Link href={`/perfil?tipo=${tipoUsuario}`}>
              <User className="w-4 h-4 mr-2" /> PERFIL
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}