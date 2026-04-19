"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

// Aceitamos os tipos de usuários possíveis
interface NavigationProps {
  tipoUsuario?: "aluno" | "professor" | "motorista" | "admin";
}

export function Navigation({ tipoUsuario = "aluno" }: NavigationProps) {

  return (
    <nav className="w-full bg-slate-950/95 backdrop-blur-md shadow-xl border-b border-white/10">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/images/logo_rota_white.svg"
            alt="Rota UEFS"
            width={40}
            height={40}
            className="h-20 w-20 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]"
            priority
          />
          <div className="flex flex-col leading-none">
            <span className="text-white font-extrabold text-lg tracking-wide group-hover:text-cyan-500 transition-colors duration-300">
              Rota <span className="text-cyan-500">UEFS</span>
            </span>
          </div>
        </Link>


        <div className="flex items-center gap-6 text-sm font-medium">

          {/* Minhas Viagens: redireciona para a nova tela dedicada */}
          {tipoUsuario !== "admin" && tipoUsuario !== "motorista" && (
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