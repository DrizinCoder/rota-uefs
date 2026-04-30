import { Search, Bus, PencilLine, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BusHomeAdmin } from "@/services/adminService";

export type FiltroStatus = "todos" | "Active" | "Inactive" | "Maintenance";

interface AdminFleetListProps {
  frota: BusHomeAdmin[];
  busca: string;
  setBusca: (valor: string) => void;
  filtroStatus: FiltroStatus;
  setFiltroStatus: (valor: FiltroStatus) => void;
  onEditar: (onibus: BusHomeAdmin) => void;
  onRemover: (onibus: BusHomeAdmin) => void;
}

export function AdminFleetList({
  frota,
  busca,
  setBusca,
  filtroStatus,
  setFiltroStatus,
  onEditar,
  onRemover,
}: AdminFleetListProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-800">Gestão de Frota</h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por placa..."
              className="pl-9 h-9 bg-white border-slate-200 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 text-sm"
            />
          </div>

          <Tabs value={filtroStatus} onValueChange={(value) => setFiltroStatus(value as FiltroStatus)} className="w-full sm:w-auto">
            <TabsList className="h-9 bg-slate-100 p-1 w-full grid grid-cols-3">
              <TabsTrigger value="todos" className="text-xs font-semibold">Todos</TabsTrigger>
              <TabsTrigger value="Active" className="text-xs font-semibold">Ativos</TabsTrigger>
              <TabsTrigger value="Inactive" className="text-xs font-semibold">Inativos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {frota.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="bg-slate-100 p-3 rounded-full mb-3">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-base font-bold text-slate-700">Nenhum ônibus encontrado</p>
            <p className="text-sm text-slate-500 mt-1">Ajuste os filtros ou tente uma nova busca.</p>
          </div>
        ) : (
          frota.map((onibus) => {
            const statusInfo = getStatusInfo(onibus.status);

            return (
              <div key={onibus.plate} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-slate-50/80 transition-colors gap-4">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${onibus.status === 'Active' ? 'bg-cyan-50 border-cyan-200/50' : 'bg-slate-100 border-slate-200'}`}>
                    <Bus className={`h-5 w-5 ${onibus.status === 'Active' ? 'text-cyan-600' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-base leading-none mb-1.5">{onibus.plate}</p>
                    <p className="text-xs font-medium text-slate-500">
                      {onibus.trips_today} {onibus.trips_today === 1 ? 'viagem registrada' : 'viagens registradas'} hoje
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <Badge variant="secondary" className={`${statusInfo.className} shadow-none border-0`}>
                    {statusInfo.label}
                  </Badge>

                  <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50"
                      onClick={() => onEditar(onibus)}
                      title="Editar"
                    >
                      <PencilLine className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => onRemover(onibus)}
                      title="Remover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function getStatusInfo(status: string) {
  if (status === "Active") {
    return {
      label: "ATIVO",
      className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    };
  }

  if (status === "Maintenance") {
    return {
      label: "MANUTENÇÃO",
      className: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    };
  }

  return {
    label: "INATIVO",
    className: "bg-slate-100 text-slate-600 hover:bg-slate-100",
  };
}
