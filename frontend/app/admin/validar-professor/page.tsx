"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminValidarProfessorList } from "@/features/validar-professor/ui/admin-validar-professor-list";
import { ArrowLeft } from "lucide-react";
import { api } from "@/services/api";

interface Servidor {
  user_id: string;
  full_name: string;
  registration_id: string;
  email: string | null;
  phone: string;
  department: string;
  employment_type: string;
  registration_status: string;
}

export default function AdminValidarProfessorPage() {
  const router = useRouter();

  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [processando, setProcessando] = useState<string | null>(null);

  useEffect(() => {
    carregarServidores();
  }, []);

  async function carregarServidores() {
    setLoading(true);
    setErro("");
    try {
      const response = await api.get("/users/staff/");
      setServidores(response.data.data ?? []);
    } catch {
      setErro("Não foi possível carregar as solicitações. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAprovar(servidor: Servidor) {
    if (!confirm(`Aprovar o cadastro de "${servidor.full_name}"?`)) return;
    setProcessando(servidor.user_id);
    try {
      await api.patch(`/users/staff/accept/${servidor.user_id}`);
      setServidores((prev) => prev.filter((s) => s.user_id !== servidor.user_id));
    } catch {
      alert("Erro ao aprovar. Tente novamente.");
    } finally {
      setProcessando(null);
    }
  }

  async function handleRejeitar(servidor: Servidor) {
    if (!confirm(`Rejeitar e remover o cadastro de "${servidor.full_name}"?`)) return;
    setProcessando(servidor.user_id);
    try {
      await api.patch(`/users/staff/reject/${servidor.user_id}`);
      setServidores((prev) => prev.filter((s) => s.user_id !== servidor.user_id));
    } catch {
      alert("Erro ao rejeitar. Tente novamente.");
    } finally {
      setProcessando(null);
    }
  }

  const sanitizarBusca = (valor: string) =>
    valor.normalize("NFKC").replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s{2,}/g, " ");

  const filtrados = servidores.filter(
    (s) =>
      s.full_name.toLowerCase().includes(busca.trim().toLowerCase()) ||
      s.registration_id.toLowerCase().includes(busca.trim().toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 selection:bg-cyan-100 selection:text-cyan-900">
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar 
          title="Validar Acesso de Servidor" 
          subtitle="Aprove ou rejeite solicitações de cadastro enviadas por novos servidores/professores."
          buttonText="Voltar"
          buttonIcon={ArrowLeft}
          buttonVariant="outline"
          onAction={() => router.push('/admin')}
        />

        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
          <div className="max-w-4xl mx-auto pb-10">
            <AdminValidarProfessorList
              busca={busca}
              onBuscaChange={(v) => setBusca(sanitizarBusca(v))}
              erro={erro}
              loading={loading}
              filtrados={filtrados}
              processando={processando}
              handleAprovar={handleAprovar}
              handleRejeitar={handleRejeitar}
              carregarServidores={carregarServidores}
            />
          </div>
        </div>
      </main>
    </div>
  );
}