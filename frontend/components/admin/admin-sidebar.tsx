"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bus, UserCircle, Route, UserRound, BarChart3, Users, Signpost, UserRoundCheck, X } from "lucide-react";
import { Logo } from "../landing/logo";

export function AdminSidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    document.addEventListener("toggle-sidebar", handleToggle);
    return () => document.removeEventListener("toggle-sidebar", handleToggle);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-gray-300 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950 shrink-0">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-wider">
            <Logo />
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

      {/* Navigation */}
      <div className="px-6 py-6 text-xs font-semibold text-cyan-500 tracking-widest mb-2">MENU</div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <div onClick={() => { router.push("/admin/onibus"); setIsOpen(false); }} className="flex items-center px-2 py-3 border-b border-slate-800 hover:text-white cursor-pointer transition-colors gap-3">
           <Bus className="h-4 w-4 text-cyan-500" />
           <span className="text-sm font-medium">Frotas</span>
        </div>
        <div onClick={() => { router.push("/admin/motoristas"); setIsOpen(false); }} className="flex items-center px-2 py-3 border-b border-slate-800 hover:text-white cursor-pointer transition-colors gap-3">
           <UserCircle className="h-4 w-4 text-cyan-500" />
           <span className="text-sm font-medium">Motoristas</span>
        </div>
        <div onClick={() => { router.push("/admin"); setIsOpen(false); }} className="flex items-center px-2 py-3 border-b border-slate-800 hover:text-white cursor-pointer transition-colors gap-3">
           <Route className="h-4 w-4 text-cyan-500" />
           <span className="text-sm font-medium">Viagens</span>
        </div>
         <div onClick={() => { router.push("/admin/rotas"); setIsOpen(false); }} className="flex items-center px-2 py-3 border-b border-slate-800 hover:text-white cursor-pointer transition-colors gap-3">
           <Signpost className="h-4 w-4 text-cyan-500" />
           <span className="text-sm font-medium">Rotas</span>
        </div>
        <div onClick={() => { router.push("/admin/usuarios"); setIsOpen(false); }} className="flex items-center px-2 py-3 border-b border-slate-800 hover:text-white cursor-pointer transition-colors gap-3">
           <UserRound className="h-4 w-4 text-cyan-500" />
           <span className="text-sm font-medium">Administradores</span>
        </div>
        <div onClick={() => { router.push("/admin/relatorios"); setIsOpen(false); }} className="flex items-center px-2 py-3 border-b border-slate-800 hover:text-white cursor-pointer transition-colors gap-3">
           <BarChart3 className="h-4 w-4 text-cyan-500" />
           <span className="text-sm font-medium">Relatórios</span>
        </div>
        <div onClick={() => { router.push("/admin/validar-professor"); setIsOpen(false); }} className="flex items-center px-2 py-3 border-b border-slate-800 hover:text-white cursor-pointer transition-colors gap-3">
           <Users className="h-4 w-4 text-cyan-500" />
           <span className="text-sm font-medium">Validar Servidor</span>
        </div>
        <div onClick={() => { router.push("/perfil"); setIsOpen(false); }} className="flex items-center px-2 py-3 border-b border-slate-800 hover:text-white cursor-pointer transition-colors gap-3">
           <UserRoundCheck className="h-4 w-4 text-cyan-500" />
           <span className="text-sm font-medium">Meu Perfil</span>
        </div>
      </nav>
    </aside>
    </>
  );
}