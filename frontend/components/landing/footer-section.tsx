"use client";

import { Bus } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="bg-[#103B73] text-[#E4F2F1] py-10 mt-12">
      <div className="container max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Bus className="h-6 w-6 text-[#F2D022]" />
          <span className="text-xl font-bold tracking-tight text-white">Rota</span>
        </div>

        <p className="text-sm opacity-80 font-medium">
          © 2024 Rota UEFS- Sistema de Gestão de Viagens Universitárias
        </p>

        <div className="flex gap-4">
          <div className="h-2 w-2 rounded-full bg-[#F2D022]" />
          <div className="h-2 w-2 rounded-full bg-[#73AABF]" />
          <div className="h-2 w-2 rounded-full bg-[#E4F2F1]" />
        </div>
      </div>
    </footer>
  );
}