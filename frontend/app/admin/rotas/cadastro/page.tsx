"use client";

import { useState, type FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, MapPin, MapPinned, Route as RouteIcon } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { adminService } from "@/services/adminService";

function CadastroRotaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeId = searchParams.get("id");
  const isEditMode = !!routeId;

  const [formData, setFormData] = useState({
    name: "",
    boarding_point: "",
    drop_off_point: "",
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (routeId) {
      setLoading(true);
      adminService.listarRotas()
        .then(rotas => {
          const rota = rotas.find(r => r.route_id === routeId);
          if (rota) {
            setFormData({
              name: rota.name,
              boarding_point: rota.boarding_point,
              drop_off_point: rota.drop_off_point,
            });
          } else {
            setErro("Rota não encontrada.");
          }
        })
        .catch(() => setErro("Erro ao carregar dados da rota."))
        .finally(() => setLoading(false));
    }
  }, [routeId]);

  const atualizarCampo = (campo: keyof typeof formData, valor: string) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
    setErro("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.boarding_point.trim() || !formData.drop_off_point.trim()) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        boarding_point: formData.boarding_point.trim(),
        drop_off_point: formData.drop_off_point.trim(),
      };
      
      if (isEditMode && routeId) {
        await adminService.atualizarRota(routeId, payload);
      } else {
        await adminService.cadastrarRota(payload);
      }
      router.push("/admin/rotas");
    } catch (err: any) {
      setErro(err.response?.data?.message || "Erro ao cadastrar rota. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 selection:bg-cyan-100 selection:text-cyan-900">
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar 
          title={isEditMode ? "Editar Rota" : "Cadastro de Rota"} 
          subtitle={isEditMode ? "Modifique os dados da rota abaixo." : "Preencha os dados abaixo para criar uma nova rota."} 
          buttonText="Voltar"
          buttonIcon={ArrowLeft}
          buttonVariant="outline"
          onAction={() => router.back()}
        />

        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
          <div className="max-w-2xl mx-auto pb-10">
            <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              
              {erro && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg font-medium border border-red-100">
                  {erro}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Nome da Rota
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <RouteIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Ex: Rota 1 - Manhã"
                      value={formData.name}
                      onChange={(e) => atualizarCampo("name", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Ponto de Embarque
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Ex: Terminal Central"
                      value={formData.boarding_point}
                      onChange={(e) => atualizarCampo("boarding_point", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Ponto de Desembarque
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPinned className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Ex: Campus Universitário"
                      value={formData.drop_off_point}
                      onChange={(e) => atualizarCampo("drop_off_point", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-[#103173] text-white font-bold rounded-xl text-sm hover:bg-[#0b245b] focus:ring-4 focus:ring-[#103173]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Salvando..." : (isEditMode ? "Salvar Alterações" : "Cadastrar Rota")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CadastroRotaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-[#103173]">Carregando...</div>}>
      <CadastroRotaContent />
    </Suspense>
  );
}
