"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { adminService, Rota } from "@/services/adminService";
import { Search, MapPin, MapPinned, PencilLine, Trash2, Route } from "lucide-react";

export default function AdminRotasPage() {
  const router = useRouter();

  const [rotas, setRotas] = useState<Rota[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarRotas();
  }, []);

  const handleEditar = (id: string) => {
    router.push(`/admin/rotas/cadastro?id=${id}`);
  };

  const handleExcluir = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta rota?")) return;
    try {
      await adminService.excluirRota(id);
      setRotas((atual) => atual.filter((r) => r.route_id !== id));
      window.alert("Rota excluída com sucesso.");
    } catch (e: any) {
      window.alert("Erro ao remover a rota. Tente novamente.");
    }
  };

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
            ) : (erro || rotasFiltradas.length === 0) ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                <Route className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                <p className="text-[#103173] font-bold text-lg">Nenhuma rota cadastrada</p>
                <p className="text-slate-500 text-sm mt-1">Não há registros de rotas para exibir no momento.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-1">
                {rotasFiltradas.map((rota) => (
                  <div key={rota.route_id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="p-5">
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
                    <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex justify-end gap-3">
                      <button 
                        onClick={() => handleEditar(rota.route_id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#103173] bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <PencilLine className="h-4 w-4" />
                        Editar
                      </button>
                      <button 
                        onClick={() => handleExcluir(rota.route_id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </button>
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
