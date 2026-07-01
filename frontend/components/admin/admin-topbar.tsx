"use client";

import { Menu, Plus, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminTopbarProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonIcon?: LucideIcon;
  buttonVariant?: "primary" | "secondary" | "outline";
  onAction?: () => void;
  /** @deprecated use onAction instead */
  onNovoOnibus?: () => void;
}

export function AdminTopbar({ 
  title = "GESTÃO DE FROTA", 
  subtitle = "Visão geral e controle operacional.", 
  buttonText = "Novo Ônibus",
  buttonIcon: Icon = Plus,
  buttonVariant = "primary",
  onAction,
  onNovoOnibus 
}: AdminTopbarProps) {
  const handleClick = onAction || onNovoOnibus;

  const variantClasses = {
    primary: "bg-[#23B99A] hover:bg-[#1d957c] text-white border-transparent",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 border-transparent",
    outline: "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 border"
  };
  return (
    <header className="h-20 bg-white flex items-center justify-between px-6 shadow-sm z-10 shrink-0 border-b border-slate-200">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => document.dispatchEvent(new CustomEvent('toggle-sidebar'))}
          className="text-gray-500 hover:text-cyan-600 lg:hidden"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="font-bold text-slate-800 tracking-wide text-lg flex items-center gap-2">
           {title.toUpperCase()}
          </h1>
          <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-bold ml-2 text-slate-600">ADMINISTRADOR</span>
        </div>
        {handleClick && (
          <Button
            className={`h-10 font-semibold shadow-sm transition-all rounded-lg ${variantClasses[buttonVariant]}`}
            onClick={handleClick}
          >
            <Icon className="h-4 w-4 mr-2" /> {buttonText}
          </Button>
        )}
      </div>
    </header>
  );
}