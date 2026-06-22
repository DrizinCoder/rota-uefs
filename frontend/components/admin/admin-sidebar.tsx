"use client";

import { useRouter } from "next/navigation";
import { Bus, UserCircle, Route, UserRound, BarChart3, Users, Signpost, UserRoundCheck } from "lucide-react";
import { Logo } from "../landing/logo";

export function AdminSidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 bg-slate-900 text-gray-300 flex-col hidden lg:flex shrink-0">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2 text-white font-bold text-xl tracking-wider">
          <Logo />
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 py-6 text-xs font-semibold text-cyan-500 tracking-widest mb-2">MENU</div>
      <nav className="flex-1 px-4 space-y-2">
        <div onClick={() => router.push("/admin/onibus")} className="flex items-center px-2 py-3 border-b border-slate-800 hover:text-white cursor-pointer transition-colors gap-3">
           <Bus className="h-4 w-4 text-cyan-500" />
           <span className="text-sm font-medium">Frotas</span>
        </div>
        <div onClick={() => router.push("/admin/motoristas")} className="flex items-center px-2 py-3 border-b border-slate-800 hover:text-white cursor-pointer transition-colors gap-3">
           <UserCircle className="h-4 w-4 text-cyan-500" />
           <span className="text-sm font-medium">Motoristas</span>
        </div>
        <div onClick={() => router.push("/admin")} className="flex items-center px-2 py-3 border-b border-slate-800 hover:text-white cursor-pointer transition-colors gap-3">
           <Route className="h-4 w-4 text-cyan-500" />
           <span className="text-sm font-medium">Viagens</span>
        </div>
         <div onClick={() => router.push("/admin/rotas")} className="flex items-center px-2 py-3 border-b border-slate-800 hover:text-white cursor-pointer transition-colors gap-3">
           <Signpost className="h-4 w-4 text-cyan-500" />
           <span className="text-sm font-medium">Rotas</span>
        </div>
        <div onClick={() => router.push("/admin/usuarios")} className="flex items-center px-2 py-3 border-b border-slate-800 hover:text-white cursor-pointer transition-colors gap-3">
           <UserRound className="h-4 w-4 text-cyan-500" />
           <span className="text-sm font-medium">Administradores</span>
        </div>
        <div onClick={() => router.push("/admin/relatorios")} className="flex items-center px-2 py-3 border-b border-slate-800 hover:text-white cursor-pointer transition-colors gap-3">
           <BarChart3 className="h-4 w-4 text-cyan-500" />
           <span className="text-sm font-medium">Relatórios</span>
        </div>
        <div onClick={() => router.push("/admin/validar-professor")} className="flex items-center px-2 py-3 border-b border-slate-800 hover:text-white cursor-pointer transition-colors gap-3">
           <Users className="h-4 w-4 text-cyan-500" />
           <span className="text-sm font-medium">Validar Servidor</span>
        </div>
        <div onClick={() => router.push("/perfil")} className="flex items-center px-2 py-3 border-b border-slate-800 hover:text-white cursor-pointer transition-colors gap-3">
           <UserRoundCheck className="h-4 w-4 text-cyan-500" />
           <span className="text-sm font-medium">Meu Perfil</span>
        </div>
      </nav>
    </aside>
  );
}