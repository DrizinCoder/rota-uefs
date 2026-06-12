"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Hash,
  Save,
  UserCircle,
  Bus,
  BadgeCheck,
  CreditCard,
  ArrowLeft,
  LogOut,
  GraduationCap,
  Briefcase,
  Lock,
  KeyRound,
  AlertTriangle,
  Trash2,
  ShieldAlert,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { userService } from "@/services/userService";

// --- Tipos ---

type TipoUsuario = "Driver" | "Student" | "Staff" | "Admin";

interface UserProfile {
  user_id: string;
  full_name: string;
  registration_id: string;
  email: string | null;
  phone: string;
  profile: TipoUsuario;
  cpf?: string;
}

interface PasswordUpdateDTO {
  password: string;
  confirm_password: string;
}



// --- Componente principal ---

function PerfilContent() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<UserProfile | null>(null);
  const [carregando, setCarregando] = useState(true);

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [alerta, setAlerta] = useState<{ tipo: "erro" | "warning" | "sucesso"; mensagem: string } | null>(null);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Carrega os dados do usuário autenticado
  useEffect(() => {
    userService
      .getMe()
      .then((data) => {
        setUsuario(data);
        setTelefone(data.phone || "");
      })
      .catch(() => router.push("/login"))
      .finally(() => setCarregando(false));
  }, []);

  // Limpa a mensagem de erro/alerta automaticamente após 5 segundos
  useEffect(() => {
    if (alerta) {
      const timer = setTimeout(() => {
        setAlerta(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alerta]);

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center font-bold text-[#103173]">
        A carregar perfil...
      </div>
    );
  }

  if (!usuario) return null;

  const tipoUsuario = usuario.profile;

  const isMotorista = tipoUsuario === "Driver";
  const isAluno = tipoUsuario === "Student";
  const isServidor = tipoUsuario === "Staff";
  const isAdmin = tipoUsuario === "Admin";

  // --- Handlers ---

  const handleSalvarSenha = async () => {
    setAlerta(null);

    if (!novaSenha && !confirmarSenha) return;

    if (!novaSenha || !confirmarSenha) {
      setAlerta({ tipo: "erro", mensagem: "Preencha a nova senha e a confirmação dela." });
      return;
    }

    if (novaSenha.length < 8) {
      setAlerta({ tipo: "erro", mensagem: "A nova senha deve ter pelo menos 8 caracteres." });
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setAlerta({ tipo: "erro", mensagem: "As senhas não coincidem." });
      return;
    }

    setSalvando(true);
    try {
      await userService.updatePassword(usuario.user_id, {
        password: novaSenha,
        confirm_password: confirmarSenha,
      });
      setNovaSenha("");
      setConfirmarSenha("");
      setAlerta({ tipo: "sucesso", mensagem: "Senha alterada com sucesso!" });
    } catch (err: any) {
      if (err?.response?.status === 422) {
        setAlerta({ tipo: "warning", mensagem: "A nova senha não pode ser igual à senha atual." });
      } else {
        setAlerta({
          tipo: "erro",
          mensagem: err?.response?.data?.message ?? "Erro ao salvar. Tente novamente.",
        });
      }
    } finally {
      setSalvando(false);
    }
  };

  const handleSalvarTelefone = async () => {
    setAlerta(null);

    if (!telefone) {
      setAlerta({ tipo: "erro", mensagem: "O campo de telefone não pode estar vazio." });
      return;
    }

    if (telefone === usuario.phone) {
      setAlerta({ tipo: "warning", mensagem: "O novo telefone não pode ser igual ao telefone atual." });
      return;
    }

    setSalvando(true);
    try {
      await userService.updatePhone(usuario.user_id, {
        phone: telefone,
      });

      setUsuario((prev) => prev ? { ...prev, phone: telefone } : null);
      setAlerta({ tipo: "sucesso", mensagem: "Telefone atualizado com sucesso!" });
    } catch (err: any) {
      if (err?.response?.status === 422) {
        setAlerta({ tipo: "warning", mensagem: "O novo telefone não pode ser igual ao telefone atual." });
      } else {
        setAlerta({
          tipo: "erro",
          mensagem: err?.response?.data?.message ?? "Não foi possível alterar o telefone.",
        });
      }
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluirConta = async () => {
    setIsDeleting(true);
    try {
      await userService.deleteAccount();
      localStorage.removeItem("token");
      //alert("Conta excluída com sucesso.");
      router.push("/");
    } catch {
      //alert("Erro ao excluir conta. Tente novamente.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // --- Badge por perfil ---

  const getBadgeConfig = () => {
    if (isAdmin) return { color: "bg-red-500 text-white", icon: ShieldAlert, label: "Admin" };
    if (isMotorista) return { color: "bg-[#F2D022] text-[#103173]", icon: BadgeCheck, label: "Motorista" };
    if (isServidor) return { color: "bg-[#103173] text-white", icon: Briefcase, label: "Servidor" };
    return { color: "bg-[#23B99A] text-white", icon: GraduationCap, label: "Aluno" };
  };

  const badgeConfig = getBadgeConfig();
  const IconePerfil = badgeConfig.icon;

  // --- Render ---

  const cardContent = (
    <Card className="border-none shadow-xl bg-white overflow-hidden rounded-3xl">
      {/* Cabeçalho do card */}
      <CardHeader className="bg-slate-50 border-b border-slate-100 pb-8 pt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-24 w-24 bg-[#103B73]/10 rounded-full flex items-center justify-center border-4 border-white shadow-md">
              <User className="h-10 w-10 text-[#103173]" />
            </div>
            <div className="text-center sm:text-left space-y-2">
              <CardTitle className="text-3xl font-black text-[#103173]">
                {usuario.full_name}
              </CardTitle>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <Badge
                  className={`${badgeConfig.color} px-3 py-1 text-xs font-black uppercase tracking-widest`}
                >
                  <IconePerfil className="h-4 w-4 mr-1.5" />
                  {badgeConfig.label}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-2 border-[#103173] text-[#103173] font-black"
                >
                  <Hash className="h-3 w-3 mr-1" />
                  MATRÍCULA: {usuario.registration_id}
                </Badge>
              </div>
            </div>
          </div>

          <Button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/");
            }}
            variant="outline"
            className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-black rounded-xl h-12 px-6"
          >
            <LogOut className="h-4 w-4 mr-2" /> SAIR
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-10">
        {/* Informações gerais */}
        <section>
          <h3 className="text-lg font-black text-[#103173] mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
            <User className="h-5 w-5 text-[#73AABF]" /> Informações gerais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="space-y-2">
              <Label className="text-xs font-black text-[#73AABF] uppercase tracking-widest">
                Nome Completo
              </Label>
              <Input
                value={usuario.full_name}
                disabled
                className="h-14 bg-slate-50 border-slate-200 text-[#103173] font-bold disabled:opacity-70"
              />
            </div>

            {/* CPF — só motorista */}
            {isMotorista && usuario.cpf && (
              <div className="space-y-2">
                <Label className="text-xs font-black text-[#73AABF] uppercase tracking-widest flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> CPF
                </Label>
                <Input
                  value={usuario.cpf}
                  disabled
                  className="h-14 bg-slate-50 border-slate-200 text-[#103173] font-bold disabled:opacity-70"
                />
              </div>
            )}

            {/* Telefone — editável apenas para motorista */}
            {!isAdmin && (
              <div className="space-y-2">
                <Label className="text-xs font-black text-[#73AABF] uppercase tracking-widest flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Telefone / WhatsApp
                </Label>
                <Input
                  value={isMotorista ? telefone : usuario.phone}
                  onChange={isMotorista ? (e) => setTelefone(e.target.value) : undefined}
                  disabled={!isMotorista}
                  className={`h-14 font-bold text-[#103173] ${
                    isMotorista
                      ? "bg-white border-[#73AABF]/30 focus-visible:ring-[#103173]"
                      : "bg-slate-50 border-slate-200 disabled:opacity-70"
                  }`}
                />
                {isMotorista && (
                  <p className="text-[10px] text-[#73AABF] font-bold">
                    Você pode editar seu telefone de contato.
                  </p>
                )}
              </div>
            )}

            {/* E-mail */}
            {!isAdmin && (
              <div className="space-y-2">
                <Label className="text-xs font-black text-[#73AABF] uppercase tracking-widest flex items-center gap-2">
                  <Mail className="h-4 w-4" /> E-mail{" "}
                  {isAluno && "Institucional"}
                </Label>
                <Input
                  value={usuario.email ?? ""}
                  disabled
                  className="h-14 bg-slate-50 border-slate-200 text-[#103173] font-bold disabled:opacity-70"
                />
                <p className="text-[10px] text-slate-400 font-bold">
                  Dado bloqueado. Contate a secretaria para alterar.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Segurança */}
        {!isMotorista && (
          <section>
            <h3 className="text-lg font-black text-[#103173] mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Lock className="h-5 w-5 text-[#73AABF]" /> Segurança
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="space-y-2">
                <Label className="text-xs font-black text-[#103173] uppercase tracking-widest flex items-center gap-2">
                  <KeyRound className="h-4 w-4" /> Nova Senha
                </Label>
                <div className="relative">
                  <Input
                    type={showNovaSenha ? "text" : "password"}
                    placeholder="••••••••"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="h-12 bg-white border-[#73AABF]/30 focus-visible:ring-[#103173] font-medium pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNovaSenha(!showNovaSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#103173] transition-colors"
                  >
                    {showNovaSenha ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-[#73AABF] font-bold">
                  Mínimo de 8 caracteres.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black text-[#103173] uppercase tracking-widest flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Confirmar Nova Senha
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmarSenha ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="h-12 bg-white border-[#73AABF]/30 focus-visible:ring-[#103173] font-medium pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#103173] transition-colors"
                  >
                    {showConfirmarSenha ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Zona de perigo */}
        {!isAdmin && (
          <section className="pt-6 border-t border-red-100">
            <h3 className="text-lg font-black text-red-600 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Zona de Perigo
            </h3>
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="font-bold text-red-900 text-base">
                  Excluir Conta
                </p>
                <p className="text-sm text-red-700 font-medium mt-1">
                  Esta ação é irreversível. Todos os seus dados, histórico
                  de viagens e preferências serão apagados permanentemente.
                </p>
              </div>
              <Button
                onClick={() => setShowDeleteModal(true)}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 font-black whitespace-nowrap h-12 px-6 rounded-xl shadow-md shadow-red-600/20 w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                EXCLUIR MINHA CONTA
              </Button>
            </div>
          </section>
        )}
      </CardContent>

      {/* Rodapé do card */}
      <CardFooter className="bg-slate-50 border-t border-slate-100 p-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 w-full sm:max-w-md">
          {alerta && (
            <div className={`text-sm font-bold p-3 rounded-xl border flex items-center gap-2 w-full ${
              alerta.tipo === "sucesso"
                ? "bg-[#23B99A]/10 border-[#23B99A]/20 text-[#23B99A]"
                : alerta.tipo === "warning"
                ? "bg-[#F2D022]/10 border-[#F2D022]/20 text-[#b8960a]"
                : "bg-red-50 border-red-100 text-red-600"
            }`}>
              {alerta.tipo === "erro" && <AlertTriangle className="h-5 w-5 shrink-0" />}
              {alerta.tipo === "warning" && <AlertTriangle className="h-5 w-5 shrink-0 text-[#b8960a]" />}
              {alerta.tipo === "sucesso" && <CheckCircle2 className="h-5 w-5 shrink-0 text-[#23B99A]" />}
              <span>{alerta.mensagem}</span>
            </div>
          )}
        </div>
        <Button
          onClick={isMotorista ? handleSalvarTelefone : handleSalvarSenha}
          disabled={
            salvando ||
            (isMotorista
              ? !telefone || telefone === usuario.phone
              : !novaSenha || !confirmarSenha)
          }
          className="h-14 w-full sm:w-auto px-8 bg-[#103173] hover:bg-[#103B73] text-white font-black rounded-2xl shadow-lg shadow-[#103173]/20 transition-all active:scale-95 disabled:opacity-50 shrink-0"
        >
          {salvando ? (
            "Processando..."
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-5 w-5" /> SALVAR ALTERAÇÕES
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  if (isAdmin) {
    return (
      <div className="flex h-screen bg-slate-50 font-sans text-slate-800 selection:bg-cyan-100 selection:text-cyan-900">
        <AdminSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <AdminTopbar 
            title="MEU PERFIL" 
            subtitle="Gerencie as suas informações pessoais, contato e segurança." 
          />
          <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
            <div className="max-w-5xl mx-auto py-10 px-4">
              {cardContent}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] relative">
      <Navigation tipoUsuario={tipoUsuario} />

      <main className="flex-1 w-full max-w-3xl mx-auto py-10 px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-white py-2 px-4 rounded-full shadow-md text-[#103173] font-black uppercase text-sm hover:opacity-70 transition-all mb-8 w-fit"
        >
          <ArrowLeft className="h-5 w-5" /> Voltar
        </button>

        <header className="mb-10 flex flex-col items-center sm:items-start space-y-3 text-center sm:text-left">
          <h1 className="text-4xl font-black text-[#103173] flex items-center gap-3 tracking-tight">
            <div className="bg-[#103173]/10 p-2 rounded-xl shadow-sm">
              <UserCircle className="h-10 w-10 text-[#103173]" />
            </div>
            Meu Perfil
          </h1>
          <p className="text-[#73AABF] font-bold text-lg">
            Gerencie as suas informações pessoais, contato e segurança.
          </p>
        </header>

        {cardContent}
      </main>
      {/* Modal de exclusão de conta */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#103173]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mx-auto bg-red-100 p-4 rounded-full w-fit mb-4">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>

            <h2 className="text-2xl font-black text-center text-[#103173] mb-2 tracking-tight">
              Você tem certeza?
            </h2>

            <p className="text-center text-slate-500 font-medium mb-8">
              A exclusão da sua conta é{" "}
              <strong className="text-red-600">permanente e irreversível</strong>
              . Todo o seu histórico e dados associados a essa matrícula serão
              deletados.
            </p>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleExcluirConta}
                disabled={isDeleting}
                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-lg shadow-red-600/20 transition-all"
              >
                {isDeleting ? "EXCLUINDO DADOS..." : "SIM, QUERO EXCLUIR"}
              </Button>
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
                disabled={isDeleting}
                className="w-full h-14 border-2 border-slate-200 text-slate-600 font-black rounded-xl hover:bg-slate-50 hover:text-[#103173] transition-colors"
              >
                CANCELAR
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaginaPerfil() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center font-bold text-[#103173]">
          A carregar perfil...
        </div>
      }
    >
      <PerfilContent />
    </Suspense>
  );
}