"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
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
} from "lucide-react";
import { api } from "@/services/api";

// â”€â”€â”€ Tipos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€â”€ ServiÃ§o â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const userService = {
  getMe: async (): Promise<UserProfile> => {
    const response = await api.get("/users/me");
    return response.data.data;
  },


  updatePassword: async (userId: string, data: PasswordUpdateDTO) => {
    const response = await api.patch(`/users/update/password/${userId}`, data);
    return response.data;
  },

  deleteAccount: async () => {
    await api.delete("/users/delete/account/me");
  },
};

// â”€â”€â”€ Componente principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function PerfilContent() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<UserProfile | null>(null);
  const [carregando, setCarregando] = useState(true);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Carrega os dados do usuÃ¡rio autenticado
  useEffect(() => {
    userService
      .getMe()
      .then((data) => setUsuario(data))
      .catch(() => router.push("/login"))
      .finally(() => setCarregando(false));
  }, []);

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
  const isProfessor = tipoUsuario === "Staff";
  const isAdmin = tipoUsuario === "Admin";

  // â”€â”€â”€ Handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const handleSalvar = async () => {
    setErro("");

    if (!novaSenha) return;

    if (!senhaAtual) {
      setErro("Informe sua senha atual para definir uma nova senha.");
      return;
    }

    if (novaSenha.length < 8) {
      setErro("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }
    
    // if (novaSenha === senhaAtual) {
    //   setErro("A nova senha deve ser diferente da senha atual.");
    //   return;
    // }

    setSalvando(true);
    try {
      await userService.updatePassword(usuario.user_id, {
        password: novaSenha,
        confirm_password: novaSenha,
      });
      setSenhaAtual("");
      setNovaSenha("");
      alert("Senha atualizada com sucesso!");
    } catch (err: any) {
      setErro(
        err?.response?.data?.message ?? "Erro ao salvar. Tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluirConta = async () => {
    setIsDeleting(true);
    try {
      await userService.deleteAccount();
      localStorage.removeItem("token");
      alert("Conta excluÃ­da com sucesso.");
      router.push("/");
    } catch {
      alert("Erro ao excluir conta. Tente novamente.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // â”€â”€â”€ Badge por perfil â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const getBadgeConfig = () => {
    if (isAdmin) return { color: "bg-red-500 text-white", icon: ShieldAlert, label: "Admin" };
    if (isMotorista) return { color: "bg-[#F2D022] text-[#103173]", icon: BadgeCheck, label: "Motorista" };
    if (isProfessor) return { color: "bg-[#103173] text-white", icon: Briefcase, label: "Professor" };
    return { color: "bg-[#23B99A] text-white", icon: GraduationCap, label: "Aluno" };
  };

  const badgeConfig = getBadgeConfig();
  const IconePerfil = badgeConfig.icon;

  // â”€â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
            Gerencie as suas informaÃ§Ãµes pessoais, contato e seguranÃ§a.
          </p>
        </header>

        <Card className="border-none shadow-xl bg-white overflow-hidden rounded-3xl">
          {erro && (
            <div className="mx-8 mt-8 bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl border border-red-100">
              {erro}
            </div>
          )}

          {/* â”€â”€ CabeÃ§alho do card â”€â”€ */}
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
                      MATRÃCULA: {usuario.registration_id}
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
            {/* â”€â”€ InformaÃ§Ãµes Gerais â”€â”€ */}
            <section>
              <h3 className="text-lg font-black text-[#103173] mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
                <User className="h-5 w-5 text-[#73AABF]" /> InformaÃ§Ãµes Gerais
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

                {/* CPF â€” sÃ³ motorista */}
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

                {/* Telefone â€” somente leitura */}
                {!isAdmin && (
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-[#73AABF] uppercase tracking-widest flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Telefone / WhatsApp
                    </Label>
                    <Input
                      value={usuario.phone}
                      disabled
                      className="h-14 bg-slate-50 border-slate-200 text-[#103173] font-bold disabled:opacity-70"
                    />
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

            {/* â”€â”€ SeguranÃ§a â”€â”€ */}
            {!isMotorista && (
              <section>
                <h3 className="text-lg font-black text-[#103173] mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Lock className="h-5 w-5 text-[#73AABF]" /> SeguranÃ§a
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-[#103173] uppercase tracking-widest flex items-center gap-2">
                      <KeyRound className="h-4 w-4" /> Senha Atual
                    </Label>
                    <Input
                      type="password"
                      placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      className="h-12 bg-white border-[#73AABF]/30 focus-visible:ring-[#103173] font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black text-[#103173] uppercase tracking-widest flex items-center gap-2">
                      <Lock className="h-4 w-4" /> Nova Senha
                    </Label>
                    <Input
                      type="password"
                      placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      className="h-12 bg-white border-[#73AABF]/30 focus-visible:ring-[#103173] font-medium"
                    />
                    <p className="text-[10px] text-[#73AABF] font-bold">
                      MÃ­nimo de 8 caracteres.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* â”€â”€ Zona de Perigo â”€â”€ */}
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
                      Esta aÃ§Ã£o Ã© irreversÃ­vel. Todos os seus dados, histÃ³rico
                      de viagens e preferÃªncias serÃ£o apagados permanentemente.
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

          {/* â”€â”€ RodapÃ© do card â”€â”€ */}
          {!isMotorista && (
            <CardFooter className="bg-slate-50 border-t border-slate-100 p-6 flex justify-end">
              <Button
                onClick={handleSalvar}
                disabled={salvando || !novaSenha}
                className="h-14 w-full sm:w-auto px-8 bg-[#103173] hover:bg-[#103B73] text-white font-black rounded-2xl shadow-lg shadow-[#103173]/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {salvando ? (
                  "Processando..."
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-5 w-5" /> SALVAR ALTERAÃ‡Ã•ES
                  </span>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      </main>
      {/* â”€â”€ Modal de exclusÃ£o de conta â”€â”€ */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#103173]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mx-auto bg-red-100 p-4 rounded-full w-fit mb-4">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>

            <h2 className="text-2xl font-black text-center text-[#103173] mb-2 tracking-tight">
              VocÃª tem certeza?
            </h2>

            <p className="text-center text-slate-500 font-medium mb-8">
              A exclusÃ£o da sua conta Ã©{" "}
              <strong className="text-red-600">permanente e irreversÃ­vel</strong>
              . Todo o seu histÃ³rico e dados associados a essa matrÃ­cula serÃ£o
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
