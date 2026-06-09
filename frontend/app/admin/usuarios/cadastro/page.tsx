"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminUsuariosForm } from "@/features/gerenciar-usuarios/ui/admin-usuarios-form";
import { ArrowLeft } from "lucide-react";
import { adminService } from "@/services/adminService";

type AccessLevel = "Operator" | "Master";

interface FormData {
  nome: string;
  matricula: string;
  email: string;
  telefone: string;
  senha: string;
  access_level: AccessLevel;
}

interface Erros {
  nome: string;
  matricula: string;
  email: string;
  telefone: string;
  senha: string;
  geral: string;
}

export default function CadastroAdminPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    matricula: "",
    email: "",
    telefone: "",
    senha: "",
    access_level: "Operator",
  });

  const [erros, setErros] = useState<Erros>({
    nome: "", matricula: "", email: "", telefone: "", senha: "", geral: "",
  });
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    let valorSanitizado = value;
    if (name === "matricula") {
      valorSanitizado = value.toUpperCase().replace(/\s/g, "").replace(/[^A-Z0-9-]/g, "");
    } else if (name === "nome") {
      valorSanitizado = value.replace(/\s{2,}/g, " ");
    } else if (name === "telefone") {
      valorSanitizado = value.replace(/[^\d()\ \-+]/g, "");
    }

    setFormData((prev) => ({ ...prev, [name]: valorSanitizado }));
    if (erros[name as keyof Erros]) {
      setErros((prev) => ({ ...prev, [name]: "", geral: "" }));
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSucesso(false);
    setLoading(true);

    const novosErros: Erros = { nome: "", matricula: "", email: "", telefone: "", senha: "", geral: "" };
    let temErro = false;

    const nome = formData.nome.trim();
    const matricula = formData.matricula.trim();
    const email = formData.email.trim().toLowerCase();
    const telefoneNumeros = formData.telefone.replace(/\D/g, "");
    const senha = formData.senha;

    if (nome.length < 3) {
      novosErros.nome = "O nome deve ter pelo menos 3 caracteres.";
      temErro = true;
    }
    if (!/^[A-Z0-9-]{4,20}$/.test(matricula)) {
      novosErros.matricula = "Matrícula inválida. Use de 4 a 20 caracteres (letras, números e hífen).";
      temErro = true;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      novosErros.email = "E-mail inválido.";
      temErro = true;
    }
    if (formData.telefone && (telefoneNumeros.length < 10 || telefoneNumeros.length > 11)) {
      novosErros.telefone = "Telefone inválido. Informe DDD + número (10 ou 11 dígitos).";
      temErro = true;
    }
    if (senha.length < 8) {
      novosErros.senha = "A senha deve ter pelo menos 8 caracteres.";
      temErro = true;
    }

    if (temErro) {
      novosErros.geral = "Corrija os campos destacados para continuar.";
      setErros(novosErros);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await adminService.cadastrarAdmin({
        full_name: nome,
        registration_id: matricula,
        password: senha,
        email: email || undefined,
        phone: telefoneNumeros || undefined,
        access_level: formData.access_level,
      });

      setSucesso(true);
      setFormData({ nome: "", matricula: "", email: "", telefone: "", senha: "", access_level: "Operator" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      const status = error?.response?.status;
      const msg =
        status === 409
          ? "Já existe um administrador com essa matrícula."
          : error?.response?.data?.message || "Erro ao cadastrar administrador. Tente novamente.";
      setErros((prev) => ({ ...prev, geral: msg }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 selection:bg-cyan-100 selection:text-cyan-900">
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar 
          title="Novo Administrador" 
          subtitle="Cadastre um novo usuário com permissões administrativas." 
          buttonText="Voltar"
          buttonIcon={ArrowLeft}
          buttonVariant="outline"
          onAction={() => router.back()}
        />

        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
          <div className="max-w-3xl mx-auto pb-10">
            <AdminUsuariosForm
              formData={formData as any}
              erros={erros as any}
              loading={loading}
              sucesso={sucesso}
              handleChange={handleChange}
              handleSalvar={handleSalvar}
              onCancel={() => router.back()}
            />
          </div>
        </div>
      </main>
    </div>
  );
}