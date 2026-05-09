"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { adminService, Rota } from "@/services/adminService";
import { Search, MapPin, MapPinned } from "lucide-react";

export default function AdminRotasPage() {
  const router = useRouter();

  const [rotas, setRotas] = useState<Rota[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarRotas();
  }, []);

  async function carregarRotas() {
    setLoading(true);
    setErro("");
    try {
      const data = await adminService.listarRotas();
      setRotas(data);
    } catch (e: any) {
      setErro("Não foi possível carregar as rotas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const rotasFiltradas = rotas.filter(
    (r) =>
      r.name.toLowerCase().includes(busca.toLowerCase()) ||
      r.boarding_point.toLowerCase().includes(busca.toLowerCase()) ||
      r.drop_off_point.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 selection:bg-cyan-100 selection:text-cyan-900">
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar 
          title="Gestão de Rotas" 
          subtitle="Gerencie as rotas disponíveis para as viagens." 
          buttonText="Nova Rota" 
          onAction={() => router.push('/admin/rotas/cadastro')} 
        />

        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
          <div className="max-w-4xl mx-auto pb-10 space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou pontos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>

            {loading ? (
              <div className="text-center text-slate-500 py-10 font-medium">Carregando rotas...</div>
            ) : erro ? (
              <div className="text-center text-red-500 py-10 font-medium">{erro}</div>
            ) : rotasFiltradas.length === 0 ? (
              <div className="text-center text-slate-500 py-10 font-medium">Nenhuma rota encontrada.</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-1">
                {rotasFiltradas.map((rota) => (
                  <div key={rota.route_id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-lg text-slate-800 mb-3">{rota.name}</h3>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-cyan-600" />
                        <span className="font-medium text-slate-700">Origem:</span> {rota.boarding_point}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinned className="h-4 w-4 text-cyan-600" />
                        <span className="font-medium text-slate-700">Destino:</span> {rota.drop_off_point}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
