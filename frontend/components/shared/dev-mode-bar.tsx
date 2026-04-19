"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserCircle, GraduationCap, Bus } from "lucide-react";

export function DevModeBar() {
  const router = useRouter();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 z-50 border border-slate-700 w-[90%] md:w-auto overflow-x-auto no-scrollbar">
      <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-widest pl-2">
        Dev Mode
      </span>
      <div className="w-px h-4 bg-slate-700 shrink-0" />
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" className="hover:bg-slate-800 text-white font-medium text-xs h-8 px-3 rounded-full shrink-0" onClick={() => router.push("/passageiro")}>
          <UserCircle className="h-3.5 w-3.5 mr-1.5" /> Passageiro
        </Button>
        <Button size="sm" variant="ghost" className="hover:bg-slate-800 text-white font-medium text-xs h-8 px-3 rounded-full shrink-0" onClick={() => router.push("/professor")}>
          <GraduationCap className="h-3.5 w-3.5 mr-1.5" /> Professor
        </Button>
        <Button size="sm" variant="ghost" className="hover:bg-slate-800 text-white font-medium text-xs h-8 px-3 rounded-full shrink-0" onClick={() => router.push("/motorista")}>
          <Bus className="h-3.5 w-3.5 mr-1.5" /> Motorista
        </Button>
        <Button size="sm" variant="ghost" className="bg-white text-slate-900 hover:bg-slate-200 font-bold text-xs h-8 px-4 rounded-full shrink-0 shadow-sm" onClick={() => router.push("/admin")}>
          Admin
        </Button>
      </div>
    </div>
  );
}
