import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, UserCheck, Clock, UserX, Trash2 } from "lucide-react";

interface PassengerCardProps {
  reservation_id: string;
  user_id: string;
  trip_id: string;
  nome: string;
  tipo: string;
  status: "pendente" | "embarcou" | "espera";
  isAvulso?: boolean;
  isWaitlist?: boolean;
  onEmbarcar: (user_id: string, reservation_id: string, trip_id: string) => void;
  onCancelarEmbarque: (id: string) => void;
  onMarcarFalta: (id: string) => void;
  onRemoverAvulso: (reservation_id: string) => void;
}

export function PassengerCard({
  user_id,
  trip_id,
  reservation_id,
  nome,
  tipo,
  status,
  isAvulso = false,
  isWaitlist = false,
  onEmbarcar,
  onCancelarEmbarque,
  onMarcarFalta,
  onRemoverAvulso,
}: PassengerCardProps) {
  return (
    <Card
      className={`border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden ${
        isWaitlist ? "bg-slate-50 opacity-75" : "bg-white"
      }`}
    >
      <CardContent className="p-0 flex items-center">
        <div
          className={`w-3 h-full min-h-[80px] shrink-0 ${
            status === "embarcou"
              ? "bg-[#23B99A]"
              : isWaitlist
                ? "bg-orange-400"
                : "bg-[#F2D022]"
          }`}
        />

        <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 ${isWaitlist ? "bg-slate-200" : "bg-slate-100"} rounded-full flex items-center justify-center shrink-0`}>
              <User className={`h-6 w-6 ${isWaitlist ? "text-slate-400" : "text-[#103173]/50"}`} />
            </div>
            <div>
              <h3 className="font-black text-[#103173] text-base md:text-lg leading-tight">
                {nome}
              </h3>
              <p className="text-xs font-bold text-[#73AABF]">{tipo}</p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 ml-16 sm:ml-0 flex-wrap">
            <Badge
              variant="outline"
              className={`font-black uppercase tracking-wider text-[10px] py-1 border-2 ${
                status === "embarcou"
                  ? "border-[#23B99A] text-[#23B99A]"
                  : isWaitlist
                    ? "border-orange-400 text-orange-500"
                    : "border-[#F2D022] text-[#b39912]"
              }`}
            >
              {status === "embarcou" && <UserCheck className="w-3 h-3 mr-1" />}
              {status === "pendente" && <Clock className="w-3 h-3 mr-1" />}
              {isWaitlist && <Clock className="w-3 h-3 mr-1" />}
              {status === "embarcou" ? "embarcou" : isWaitlist ? "espera" : "pendente"}
            </Badge>

            {/* BOTÕES - LISTA DE ESPERA (SEM BOTÕES) */}
            {isWaitlist ? null : (
              <>
                {/* BOTÕES - SERVIDOR AVULSO */}
                {isAvulso ? (
                  <Button
                    onClick={() => onRemoverAvulso(reservation_id)}
                    variant="ghost"
                    className="h-10 px-4 rounded-xl font-bold text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remover
                  </Button>
                ) : (
                  <>
                    {/* BOTÕES - PASSAGEIRO NORMAL */}
                    {status === "embarcou" ? (
                      <Button
                        onClick={() => onCancelarEmbarque(reservation_id)}
                        variant="ghost"
                        className="h-10 px-4 rounded-xl font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        Cancelar Embarque
                      </Button>
                    ) : (
                      <>
                        {/* FALTA À ESQUERDA */}
                        <Button
                          onClick={() => onMarcarFalta(reservation_id)}
                          variant="ghost"
                          className="h-10 px-4 rounded-xl font-bold text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Falta
                        </Button>
                        {/* EMBARCAR À DIREITA */}
                        <Button
                          onClick={() => onEmbarcar(user_id, reservation_id, trip_id)}
                          className="h-10 px-4 rounded-xl font-bold bg-[#103173] text-white hover:bg-[#103B73] shadow-md transition-all"
                        >
                          Embarcar
                        </Button>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}