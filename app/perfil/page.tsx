"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  Trash2
} from "lucide-react";

type TipoUsuario = "motorista" | "aluno" | "professor";

function PerfilContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Define o perfil inicial com base no parâmetro 'tipo' da URL ou 'aluno' por padrão
  const tipoDaUrl = (searchParams.get("tipo") as TipoUsuario) || "aluno";
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>(tipoDaUrl); 
  
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Estados para o Modal de Excluir Conta
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isMotorista = tipoUsuario === "motorista";
  const isAluno = tipoUsuario === "aluno";
  const isProfessor = tipoUsuario === "professor";
  
  const dadosIniciais = {
    motorista: {
      nome: "João Silva",
      matricula: "MOT-8472",
      cpf: "111.***.***-44",
      emailOriginal: "joao.silva@transporte.com",
      telefoneOriginal: "(71) 99999-9999",
    },
    aluno: {
      nome: "Maria Oliveira",
      matricula: "ALU-202493",
      emailOriginal: "maria.oliveira@aluno.uefs.br",
      telefoneOriginal: "(75) 98888-8888",
    },
    professor: {
      nome: "Carlos Eduardo",
      matricula: "PROF-10293",
      emailOriginal: "carlos.eduardo@uefs.br",
      telefoneOriginal: "(75) 97777-7777",
    }
  };

  const dadosAtuais = dadosIniciais[tipoUsuario];

  useEffect(() => {
    setTelefone(dadosAtuais.telefoneOriginal);
    setEmail(dadosAtuais.emailOriginal);
    setSenhaAtual("");
    setNovaSenha("");
  }, [tipoUsuario, dadosAtuais]);

  const handleSalvar = () => {
    setSalvando(true);
    setTimeout(() => {
      setSalvando(false);
      setSenhaAtual("");
      setNovaSenha("");
      alert("Dados atualizados com sucesso!"); 
    }, 1000);
  };

  const handleExcluirConta = () => {
    setIsDeleting(true);
    // Simula o tempo de exclusão no banco de dados
    setTimeout(() => {
      setIsDeleting(false);
      setShowDeleteModal(false);
      alert("Conta excluída com sucesso.");
      router.push("/"); // Redireciona para o login
    }, 2000);
  };

  const getBadgeConfig = () => {
    if (isMotorista) return { color: "bg-[#F2D022] text-[#103173]", icon: BadgeCheck };
    if (isProfessor) return { color: "bg-[#103173] text-white", icon: Briefcase };
    return { color: "bg-[#23B99A] text-white", icon: GraduationCap };
  };

  const badgeConfig = getBadgeConfig();
  const IconePerfil = badgeConfig.icon;

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] pb-24 relative">
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

        <Card className="border-none shadow-xl bg-white overflow-hidden rounded-3xl">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-8 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="h-24 w-24 bg-[#103B73]/10 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                  <User className="h-10 w-10 text-[#103173]" />
                </div>
                <div className="text-center sm:text-left space-y-2">
                  <CardTitle className="text-3xl font-black text-[#103173]">
                    {dadosAtuais.nome}
                  </CardTitle>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <Badge className={`${badgeConfig.color} px-3 py-1 text-xs font-black uppercase tracking-widest`}>
                      <IconePerfil className="h-4 w-4 mr-1.5" />
                      {tipoUsuario}
                    </Badge>
                    <Badge variant="outline" className="border-2 border-[#103173] text-[#103173] font-black">
                      <Hash className="h-3 w-3 mr-1" />
                      MATRÍCULA: {dadosAtuais.matricula}
                    </Badge>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => router.push("/")}
                variant="outline" 
                className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-black rounded-xl h-12 px-6"
              >
                <LogOut className="h-4 w-4 mr-2" /> SAIR
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-10">
            {/* INFORMAÇÕES GERAIS */}
            <section>
              <h3 className="text-lg font-black text-[#103173] mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
                <User className="h-5 w-5 text-[#73AABF]" /> Informações Gerais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black text-[#73AABF] uppercase tracking-widest flex items-center gap-2">
                    Nome Completo
                  </Label>
                  <Input 
                    value={dadosAtuais.nome} 
                    disabled 
                    className="h-14 bg-slate-50 border-slate-200 text-[#103173] font-bold disabled:opacity-70"
                  />
                </div>

                {isMotorista && (
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-[#73AABF] uppercase tracking-widest flex items-center gap-2">
                      <CreditCard className="h-4 w-4" /> CPF
                    </Label>
                    <Input 
                      value={dadosAtuais.cpf} 
                      disabled 
                      className="h-14 bg-slate-50 border-slate-200 text-[#103173] font-bold disabled:opacity-70"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-xs font-black text-[#73AABF] uppercase tracking-widest flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Telefone / WhatsApp
                  </Label>
                  <Input 
                    value={telefone} 
                    onChange={(e) => setTelefone(e.target.value)}
                    className="h-14 font-bold border-2 border-[#103173]/20 focus-visible:ring-[#103173] text-[#103173]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black text-[#73AABF] uppercase tracking-widest flex items-center gap-2">
                    <Mail className="h-4 w-4" /> E-mail {isAluno && "Institucional"}
                  </Label>
                  <Input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isMotorista || isAluno}
                    className={`h-14 font-bold ${
                      isProfessor 
                      ? "border-2 border-[#103173]/20 focus-visible:ring-[#103173] text-[#103173]" 
                      : "bg-slate-50 border-slate-200 text-[#103173] disabled:opacity-70"
                    }`}
                  />
                  {(isMotorista || isAluno) && (
                    <p className="text-[10px] text-slate-400 font-bold">
                      Dado bloqueado. Contate a secretaria para alterar.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* SEGURANÇA */}
            {!isMotorista && (
              <section>
                <h3 className="text-lg font-black text-[#103173] mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Lock className="h-5 w-5 text-[#73AABF]" /> Segurança
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-[#103173] uppercase tracking-widest flex items-center gap-2">
                      <KeyRound className="h-4 w-4" /> Senha Atual
                    </Label>
                    <Input 
                      type="password"
                      placeholder="••••••••"
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
                      placeholder="••••••••"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      className="h-12 bg-white border-[#73AABF]/30 focus-visible:ring-[#103173] font-medium"
                    />
                    <p className="text-[10px] text-[#73AABF] font-bold">
                      Mínimo de 8 caracteres.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* ZONA DE PERIGO */}
            <section className="pt-6 border-t border-red-100">
              <h3 className="text-lg font-black text-red-600 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Zona de Perigo
              </h3>
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="font-bold text-red-900 text-base">Excluir Conta</p>
                  <p className="text-sm text-red-700 font-medium mt-1">
                    Esta ação é irreversível. Todos os seus dados, histórico de viagens e preferências serão apagados permanentemente.
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
          </CardContent>

          <CardFooter className="bg-slate-50 border-t border-slate-100 p-6 flex justify-end">
            <Button 
              onClick={handleSalvar}
              disabled={salvando}
              className="h-14 w-full sm:w-auto px-8 bg-[#103173] hover:bg-[#103B73] text-white font-black rounded-2xl shadow-lg shadow-[#103173]/20 transition-all active:scale-95"
            >
              {salvando ? "Processando..." : (
                <span className="flex items-center gap-2"><Save className="h-5 w-5" /> SALVAR ALTERAÇÕES</span>
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
      
      <FooterSection />

      {/* POP-UP / MODAL DE EXCLUSÃO DE CONTA */}
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
              A exclusão da sua conta é <strong className="text-red-600">permanente e irreversível</strong>. Todo o seu histórico e dados associados a essa matrícula serão deletados.
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
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center font-bold text-[#103173]">A carregar perfil...</div>}>
      <PerfilContent />
    </Suspense>
  );
}