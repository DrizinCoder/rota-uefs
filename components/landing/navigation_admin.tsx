"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserCircle, Route, UserRound, BarChart3, Users } from "lucide-react";

export function NavigationAdmin() {
  const router = useRouter();

  return (
    <section className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-2 items-center mb-6 w-full max-w-fit">
      <Button variant="ghost" size="sm" className="text-slate-600 font-semibold" onClick={() => router.push("/admin/motoristas")}>
        <UserCircle className="h-4 w-4 mr-2 text-[#73AABF]" /> Motoristas
      </Button>
      <div className="w-px h-4 bg-slate-200 hidden sm:block" />
      <Button variant="ghost" size="sm" className="text-slate-600 font-semibold" onClick={() => router.push("/admin/viagens")}>
        <Route className="h-4 w-4 mr-2 text-[#73AABF]" /> Viagens
      </Button>
      <div className="w-px h-4 bg-slate-200 hidden sm:block" />
      <Button variant="ghost" size="sm" className="text-slate-600 font-semibold" onClick={() => router.push("/admin/usuarios")}>
        <UserRound className="h-4 w-4 mr-2 text-[#73AABF]" /> Usuários
      </Button>
      <div className="w-px h-4 bg-slate-200 hidden sm:block" />
      <Button variant="ghost" size="sm" className="text-slate-600 font-semibold" onClick={() => router.push("/admin/relatorios")}>
        <BarChart3 className="h-4 w-4 mr-2 text-[#73AABF]" /> Relatórios
      </Button>
      <div className="w-px h-4 bg-slate-200 hidden sm:block" />
      <Button variant="ghost" size="sm" className="text-slate-600 font-semibold" onClick={() => router.push("/admin/validar-professor")}>
        <Users className="h-4 w-4 mr-2 text-[#73AABF]" /> Validar Acesso de professor
      </Button>
    </section>
  );
}
