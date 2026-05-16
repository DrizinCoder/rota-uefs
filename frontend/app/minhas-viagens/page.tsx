"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { Bus, MapPin, Calendar, Clock, Ticket, ArrowLeft, ClipboardList } from "lucide-react";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { passengerService, UserTrip } from "@/services/homeService";
import { userService } from "@/services/userService";

function ViagensContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tipo = searchParams.get("tipo") || "aluno";
  const isMotorista = tipo === "motorista";

  const [viagens, setViagens] = useState<UserTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrips() {
      try {
        const user = await userService.getMe();
        const trips = await passengerService.getUserTrips(user.user_id);
        setViagens(trips);
      } catch (error) {
        console.error("Erro ao buscar viagens", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-10 text-center font-bold text-[#103173]">
        Carregando viagens...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <Navigation tipoUsuario={tipo as any} />

      <main className="max-w-3xl mx-auto px-4 pt-6 pb-20">
        
        {/* Barra de ações rápidas: voltar e visualizar inscrição */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-[#103173] hover:text-[#103173]/70 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#103173] tracking-tight mb-2">
            Minhas Viagens
          </h1>
          <p className="text-[#73AABF] text-sm font-medium">
            {isMotorista
              ? "Confira as próximas viagens em que você está escalado para dirigir."
              : "Acompanhe o status das viagens que você cadastrou para embarcar."}
          </p>
        </header>

        <div className="grid gap-4">
          {viagens.map((viagem, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${isMotorista ? 'bg-[#F2D022]/20 text-[#b8960a]' : 'bg-[#103173]/10 text-[#103173]'}`}>
                  {isMotorista ? <Bus className="h-6 w-6" /> : <Ticket className="h-6 w-6" />}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase text-[#103173] bg-slate-100 px-2 py-0.5 rounded-full tracking-wider">
                      {viagem.trip_id.substring(0, 8)}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${viagem.status === 'Confirmed' || viagem.status === 'Escalado' ? 'bg-[#23B99A]/10 text-[#23B99A]' : 'bg-[#F2D022]/20 text-[#b8960a]'}`}>
                      {viagem.status === 'Confirmed' ? 'Confirmada' : viagem.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[#103173] font-bold text-lg mt-1">
                    {viagem.boarding_point} <MapPin className="h-4 w-4 text-[#F2D022]" /> {viagem.drop_off_point}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-slate-400" /> {viagem.trip_date.split('-').reverse().join('/')}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-slate-400" /> {viagem.departure_time.substring(0, 5)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão de visualizar inscrição da viagem para passageiros confirmados */}
              {!isMotorista && viagem.status === "Pending" && (
                <Link 
                  href={`/passageiro/status?viagemId=${viagem.trip_id}`}
                  className="flex items-center justify-center gap-2 text-sm font-bold bg-white text-[#103173] border border-[#103173]/20 px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-all active:scale-[0.98] whitespace-nowrap mt-2 md:mt-0"
                >
                  <ClipboardList className="h-4 w-4" />
                  Visualizar inscrição
                </Link>
              )}
            </div>
          ))}
          
          {viagens.length === 0 && (
            <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-500 font-medium">
              Nenhuma viagem encontrada.
            </div>
          )}
        </div>
      </main>    </div>
  );
}

export default function MinhasViagensPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f0f4f8] p-10 text-center font-bold text-[#103173]">Carregando viagens...</div>}>
      <ViagensContent />
    </Suspense>
  );
}
