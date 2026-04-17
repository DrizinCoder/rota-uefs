"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, QrCode } from "lucide-react";

export default function TelaEmbarque() {
  const router = useRouter();
  const codigoViagem = "UEFS-7729-X";

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] items-center justify-center p-4">
      {/* Botão de Voltar - Agora com fundo branco para destaque no celular */}
      <button
        onClick={() => router.back()}
        className="absolute top-8 left-6 flex items-center gap-2 bg-white py-2 px-4 rounded-full shadow-md text-[#103173] font-black uppercase text-sm hover:opacity-70 transition-all z-10"
      >
        <ArrowLeft className="h-5 w-5" /> Voltar
      </button>

      <Card className="w-full max-w-md border-none shadow-2xl bg-white overflow-hidden rounded-[40px]">
        <CardHeader className="bg-[#103173] text-white text-center py-10">
          <CardTitle className="text-3xl font-black uppercase tracking-tighter">
            Embarque
          </CardTitle>
          <div className="mt-2 space-y-1">
            <p className="text-[#F2D022] text-sm font-black tracking-widest uppercase">
              Rota ROT-9901
            </p>
            <p className="text-[#73AABF] text-xs font-bold uppercase tracking-wider">
              VEÍCULO: JLS-1020 | Salvador → Feira de Santana
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center p-10">
          {/* QR Code Simulado */}
          <div className="bg-white p-6 border-[6px] border-[#F2D022] rounded-[40px] mb-10 shadow-xl">
            <div className="bg-slate-50 w-56 h-56 flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200">
              <QrCode className="h-40 w-40 text-[#103173]" />
            </div>
          </div>

          <div className="w-full text-center space-y-2">
            <p className="text-[10px] font-black text-[#73AABF] uppercase tracking-[0.2em]">
              Código de Acesso Manual
            </p>
            <div className="bg-[#103173] py-5 px-8 rounded-3xl shadow-lg shadow-[#103173]/20">
              <span className="text-3xl font-black text-white tracking-[0.3em]">
                {codigoViagem}
              </span>
            </div>

            <p className="pt-6 text-base text-[#73AABF] font-bold leading-relaxed max-w-[350px] mx-auto">
              Apresente esta tela ao motorista para realizar a validação do
              embarque.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex items-center gap-2 opacity-40">
        <div className="h-1 w-1 bg-[#103173] rounded-full" />
        <p className="text-[#103173] font-black text-[10px] uppercase tracking-widest">
          SIT - Sistema Interno de Transporte
        </p>
        <div className="h-1 w-1 bg-[#103173] rounded-full" />
      </div>
    </div>
  );
}