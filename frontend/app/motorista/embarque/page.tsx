"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Scan, ClipboardList } from "lucide-react";

export default function TelaEmbarque() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] items-center justify-center p-4">
      {/* Botão de Voltar - Com fundo branco para destaque no celular */}
      <button 
        onClick={() => router.back()}
        className="absolute top-8 left-6 flex items-center gap-2 bg-white py-2 px-4 rounded-full shadow-md text-[#103173] font-black uppercase text-sm hover:opacity-70 transition-all z-10"
      >
        <ArrowLeft className="h-5 w-5" /> Voltar
      </button>

      <Card className="w-full max-w-md border-none shadow-2xl bg-white overflow-hidden rounded-[40px] mt-12 sm:mt-0">
        <CardHeader className="bg-[#103173] text-white text-center py-10">
          <CardTitle className="text-3xl font-black uppercase tracking-tighter">
            Embarque
          </CardTitle>
          <div className="mt-2 flex flex-col items-center space-y-2">
            <p className="text-[#F2D022] text-sm font-black tracking-widest uppercase">
              Rota ROT-0042
            </p>
            {/* TEXTO DE INSTRUÇÃO */}
            <p className="text-[#73AABF] text-sm sm:text-base font-bold uppercase tracking-wider px-4">
              Aponte a câmera para o QR Code do passageiro
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center p-8">
          
          {/* MOLDURA DE SCAN (Simulando Câmera) */}
          <div className="relative mb-8 group">
            {/* Cantos da Moldura */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-[#F2D022] rounded-tl-lg" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-[#F2D022] rounded-tr-lg" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-[#F2D022] rounded-bl-lg" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-[#F2D022] rounded-br-lg" />
            
            <div className="bg-slate-900 w-64 h-64 flex flex-col items-center justify-center rounded-3xl overflow-hidden relative shadow-inner">
               {/* Linha de Scanner Animada (Simulada) */}
               <div className="absolute top-0 w-full h-1 bg-[#F2D022]/50 shadow-[0_0_15px_#F2D022] animate-[bounce_2s_infinite] mt-10" />
               
               <Scan className="h-20 w-20 text-white/20" />
               <p className="text-white/40 text-[10px] font-bold mt-4 uppercase tracking-widest">
                 Câmera do Motorista Ativa
               </p>
            </div>
          </div>

          {/* DIVISOR E ACESSO À LISTA */}
          <div className="w-full space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-[10px] font-black text-[#73AABF] uppercase tracking-widest">
                Ou faça o check-in manual
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <Button 
              onClick={() => router.push("/motorista/passageiros")}
              className="w-full h-14 rounded-2xl font-black transition-all shadow-lg bg-[#23B99A] hover:bg-[#1d9e83] text-white active:scale-95"
            >
              <ClipboardList className="mr-2 h-5 w-5" /> ACESSAR LISTA DE PASSAGEIROS
            </Button>
          </div>

          {/* TEXTO DE PROBLEMA DE LEITURA SIMPLIFICADO */}
          <p className="pt-8 text-xs text-[#73AABF] font-bold leading-relaxed text-center max-w-[280px] mx-auto">
            Problemas na leitura da câmera? Utilize o botão acima para validar pela lista.
          </p>
        </CardContent>
      </Card>
      
      <div className="mt-8 flex items-center gap-2 opacity-40">
        <div className="h-1 w-1 bg-[#103173] rounded-full" />
        <p className="text-[#103173] font-black text-[10px] uppercase tracking-widest text-center">
          SIT - Sistema Interno de Transporte
        </p>
        <div className="h-1 w-1 bg-[#103173] rounded-full" />
      </div>
    </div>
  );
}