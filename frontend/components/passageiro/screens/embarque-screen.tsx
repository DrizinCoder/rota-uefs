"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, QrCode } from "lucide-react";
import { driverService } from "@/services/driverService";

interface PassengerQRCode {
  name: string;
  qr_code: string;
}

export function EmbarqueScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trip_id = searchParams.get("trip_id");
  
  const [qrCodes, setQrCodes] = useState<PassengerQRCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (trip_id) {
      driverService.obterCodigoEmbarque(trip_id)
        .then(data => {
          console.log(data)
          setQrCodes(Array.isArray(data) ? data : []);
        })
        .catch(err => console.error("Erro ao carregar qr code", err))
        .finally(() => setIsLoading(false));
    } else {
        setIsLoading(false);
    }
  }, [trip_id]);

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] items-center justify-center p-4">
      <button
        onClick={() => router.back()}
        className="absolute top-8 left-6 flex items-center gap-2 bg-white py-2 px-4 rounded-full shadow-md text-[#103173] font-black uppercase text-sm hover:opacity-70 transition-all z-10"
      >
        <ArrowLeft className="h-5 w-5" /> Voltar
      </button>

      <Card className="w-full max-w-md border-none shadow-2xl bg-white overflow-hidden rounded-[40px] flex flex-col max-h-[85vh]">
        <CardHeader className="bg-[#103173] text-white text-center py-8 shrink-0">
          <CardTitle className="text-3xl font-black uppercase tracking-tighter">
            Embarque
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center p-6 w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-[#103173] animate-spin mb-4" />
              <p className="text-[#73AABF] text-sm font-bold uppercase tracking-widest">Carregando...</p>
            </div>
          ) : qrCodes.length > 0 ? (
            <div className="w-full max-w-full flex flex-col items-center overflow-hidden">              
              {qrCodes.length > 1 && (
                <div className="mb-2 text-[#73AABF] animate-pulse">
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Deslize para ver mais →
                  </span>
                </div>
              )}
              <div className="flex w-full overflow-x-auto snap-x snap-mandatory pb-6 pt-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {qrCodes.map((item, index) => (
                  <div key={index} className="flex flex-col items-center w-full shrink-0 snap-center px-2">
                    <p className="text-[#103173] font-black uppercase text-xl mb-4 text-center line-clamp-1 break-all px-4">
                      {item.name}
                    </p>
                    <div className="bg-white p-4 border-[6px] border-[#F2D022] rounded-[40px] shadow-lg shrink-0">
                      <div className="bg-slate-50 w-56 h-56 flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden">
                        <img src={`data:image/png;base64,${item.qr_code}`} alt={`QR Code de ${item.name}`} className="w-full h-full object-contain p-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
             <div className="bg-white p-6 border-[6px] border-[#F2D022] rounded-[40px] my-10 shadow-xl flex items-center justify-center">
                <QrCode className="h-40 w-40 text-[#103173]/20" />
             </div>
          )}

          <div className="w-full text-center space-y-2 mt-2 shrink-0">
            <p className="pt-6 text-base text-[#73AABF] font-bold leading-relaxed max-w-[350px] mx-auto border-t border-slate-100">
              Apresente este código ao motorista para realizar a validação do embarque.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex items-center gap-2 opacity-40 shrink-0">
        <div className="h-1 w-1 bg-[#103173] rounded-full" />
        <p className="text-[#103173] font-black text-[10px] uppercase tracking-widest">
          SIT - Sistema Interno de Transporte
        </p>
        <div className="h-1 w-1 bg-[#103173] rounded-full" />
      </div>
    </div>
  );
}
