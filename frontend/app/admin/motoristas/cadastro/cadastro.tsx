"use client";

import { useState, type FormEvent, useEffect } from "react";
import { adminService } from "@/services/adminService";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminMotoristasForm, type MotoristaFormState } from "@/features/gerenciar-motoristas/ui/admin-motoristas-form";
import { ArrowLeft } from "lucide-react";

export default function CadastroEdicaoMotoristaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const driverId = searchParams.get("id");
  const isEditMode = !!driverId;

  const [erros, setErros] = useState({
    nome: "",
    matricula: "",
    telefone: "",
    email: "",
    senha: "",
    geral: "",
  });

  const [formData, setFormData] = useState<MotoristaFormState>({
    nome: "",
    matricula: "",
    telefone: "",
    email: "",
    senha: "",
  });

  useEffect(() => {
    if (driverId) {
      adminService.listarMotoristas()
        .then(motoristas => {
          const m = motoristas.find(x => x.user_id === driverId);
          if (m) {
            setFormData({
              nome: m.full_name,
              matricula: m.registration_id,
              telefone: m.phone,
              email: m.email || "",
              senha: "",
            });
          }
        })
        .catch(console.error);
    }
  }, [driverId]);

  const atualizarCampo = <K extends keyof MotoristaFormState>(
    campo: K,
    valor: MotoristaFormState[K],
  ) => {
    setFormData((atual) => ({
      ...atual,
      [campo]: valor,
    }));
    if (erros[campo as keyof typeof erros]) {
      setErros((atual) => ({ ...atual, [campo]: "", geral: "" }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErros({ nome: "", matricula: "", telefone: "", email: "", senha: "", geral: "" });

    const nome = formData.nome.trim();
    const matricula = formData.matricula.trim();
    const telefoneNumeros = formData.telefone.replace(/\D/g, "");
    const email = formData.email.trim().toLowerCase();
    const senha = formData.senha || "";
    const novosErros = { nome: "", matricula: "", telefone: "", email: "", senha: "", geral: "" };
    let temErro = false;

    if (nome.length < 3) {
      novosErros.nome = "Nome completo deve ter pelo menos 3 caracteres.";
      temErro = true;
    }
    if (!/^[A-Za-z0-9-]{4,20}$/.test(matricula)) {
      novosErros.matricula = "Guia de matrícula inválido (4 a 20 caracteres alfanuméricos).";
      temErro = true;
    }
    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
      novosErros.telefone = "Telefone inválido. Informe DDD + número com 10 ou 11 dígitos.";
      temErro = true;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      novosErros.email = "E-mail inválido.";
      temErro = true;
    }
    if (!isEditMode && senha.length < 8) {
      novosErros.senha = "A senha deve ter pelo menos 8 caracteres.";
      temErro = true;
    } else if (isEditMode && senha && senha.length < 8) {
      novosErros.senha = "A nova senha deve ter pelo menos 8 caracteres.";
      temErro = true;
    }

    if (temErro) {
      novosErros.geral = "Corrija os campos destacados para continuar.";
      setErros(novosErros);
      return;
    }

    try {
      const payload: any = {
        full_name: nome,
        registration_id: matricula,
        phone: telefoneNumeros,
        email: email,
      };
      
      if (senha) {
        payload.password = senha;
      }

      if (isEditMode && driverId) {
        await adminService.atualizarMotorista(driverId, payload);
      } else {
        await adminService.cadastrarMotorista(payload);
      }
      router.push("/admin/motoristas");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Erro ao salvar motorista. Tente novamente.";
      setErros((atual) => ({ ...atual, geral: msg }));
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 selection:bg-cyan-100 selection:text-cyan-900">
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar 
          title={isEditMode ? "Editar Motorista" : "Cadastro de Motorista"} 
          subtitle={isEditMode ? "Atualize os dados do condutor." : "Preencha os dados abaixo para cadastrar um novo condutor."} 
          buttonText="Voltar"
          buttonIcon={ArrowLeft}
          buttonVariant="outline"
          onAction={() => router.back()}
        />

        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
          <div className="max-w-4xl mx-auto pb-10">
            <AdminMotoristasForm
              formData={formData}
              erros={erros}
              atualizarCampo={atualizarCampo}
              onSubmit={handleSubmit}
              isEditMode={isEditMode}
            />
          </div>
        </div>
      </main>
    </div>
  );
}