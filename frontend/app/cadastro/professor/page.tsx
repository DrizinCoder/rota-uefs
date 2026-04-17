"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Lock, Mail, Phone, User, ArrowLeft, BadgeCheck, ShieldAlert, CheckCircle2, BriefcaseBusiness } from "lucide-react";

export default function CadastroProfessor() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSucesso, setIsSucesso] = useState(false);
  const [erro, setErro] = useState("");
  
  const [formData, setFormData] = useState({
    nome: "",
    matricula: "",
    vinculo: "",
    departamento: "",
    telefone: "",
    email: "",
    senha: ""
  });

  const handleCadastrar = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!formData.vinculo) {
      setErro("Selecione um tipo de vínculo válido.");
      return;
    }

    if (!formData.email.includes("@")) {
      setErro("Formato de e-mail inválido.");
      return;
    }

    setIsLoading(true);
    
    // Simula validação e envio para backend
    setTimeout(() => {
      setIsLoading(false);
      setIsSucesso(true); // Exibe a tela de pendente de validação
    }, 1500);
  };

  if (isSucesso) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#E4F2F1] p-4 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-[#103173] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[#F2D022] opacity-10 rounded-full blur-3xl" />
        
        <Card className="w-full max-w-md border-none shadow-2xl bg-white/80 backdrop-blur-md z-10 text-center py-8">
          <CardHeader>
            <div className="mx-auto bg-amber-100 p-4 rounded-full w-fit mb-4">
              <ShieldAlert className="h-12 w-12 text-amber-600" />
            </div>
            <CardTitle className="text-2xl font-black text-[#103173]">Cadastro em Análise</CardTitle>
            <CardDescription className="text-[#73AABF] font-bold text-base mt-2">
              Status: <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-md uppercase text-xs">Pendente de Validação</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-[#103173] font-medium text-sm leading-relaxed">
            Seu cadastro foi recebido com sucesso. Como medida de segurança, o acesso de servidores/docentes 
            passa por uma conferência de dados institucionais.<br/><br/>
            Enviaremos um email quando o cadastro for validado.
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => router.push("/")}
              className="w-full h-12 bg-[#103173] hover:bg-[#103B73] text-white font-black rounded-xl"
            >
              VOLTAR PARA LOGIN
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#E4F2F1] p-4 relative overflow-hidden py-10">
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-[#103173] opacity-5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[#F2D022] opacity-10 rounded-full blur-3xl" />

      <Card className="w-full max-w-md border-none shadow-2xl bg-white/80 backdrop-blur-md z-10">
        <CardHeader className="space-y-4 pb-6 text-center relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-4 top-4 text-[#73AABF] hover:text-[#103173] hover:bg-[#103173]/10"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="mx-auto bg-[#103173] p-4 rounded-2xl w-fit shadow-lg shadow-[#103173]/20">
            <Briefcase className="h-10 w-10 text-[#F2D022]" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black text-[#103173] tracking-tight">
              Cadastro Servidor
            </CardTitle>
            <CardDescription className="text-[#73AABF] font-bold">
              Cadastro para docentes e servidores
            </CardDescription>
          </div>

          {erro && (
            <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl border border-red-100">
              {erro}
            </div>
          )}
        </CardHeader>

        <form onSubmit={handleCadastrar}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-[#103173] font-bold ml-1">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-[#73AABF]" />
                <Input 
                  id="nome" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Seu nome completo" 
                  className="pl-10 h-12 border-[#73AABF]/20 focus:border-[#103173] focus:ring-[#103173] rounded-xl font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="matricula" className="text-[#103173] font-bold ml-1">Matrícula</Label>
                <div className="relative">
                  <BadgeCheck className="absolute left-3 top-3 h-5 w-5 text-[#73AABF]" />
                  <Input 
                    id="matricula" value={formData.matricula} onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                    placeholder="0000000" 
                    className="pl-10 h-12 border-[#73AABF]/20 focus:border-[#103173] focus:ring-[#103173] rounded-xl font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vinculo" className="text-[#103173] font-bold ml-1">Vínculo</Label>
                <select
                  id="vinculo"
                  value={formData.vinculo}
                  onChange={(e) => setFormData({...formData, vinculo: e.target.value})}
                  className="w-full h-12 px-3 border border-[#73AABF]/20 rounded-xl bg-transparent font-medium text-sm text-[#103173] focus:outline-none focus:ring-2 focus:ring-[#103173]"
                  required
                >
                  <option value="" disabled>Selecione...</option>
                  <option value="Servidor Técnico">Servidor Técnico</option>
                  <option value="Docente">Docente</option>
                </select>
              </div>
              
            </div>

            <div className="space-y-2">
              <Label htmlFor="departamento" className="text-[#103173] font-bold ml-1">Departamento</Label>
              <div className="relative">
                <BriefcaseBusiness className="absolute left-3 top-3 h-5 w-5 text-[#73AABF]" />
                <Input 
                  id="telefone" value={formData.departamento} onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                  placeholder="Ex: DTEC" 
                  className="pl-10 h-12 border-[#73AABF]/20 focus:border-[#103173] focus:ring-[#103173] rounded-xl font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-[#103173] font-bold ml-1">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-[#73AABF]" />
                <Input 
                  id="telefone" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  placeholder="(75) 90000-0000" 
                  className="pl-10 h-12 border-[#73AABF]/20 focus:border-[#103173] focus:ring-[#103173] rounded-xl font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#103173] font-bold ml-1">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-[#73AABF]" />
                <Input 
                  id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Ex: email@uefs.br" 
                  className="pl-10 h-12 border-[#73AABF]/20 focus:border-[#103173] focus:ring-[#103173] rounded-xl font-medium"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="senha" className="text-[#103173] font-bold ml-1">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-[#73AABF]" />
                <Input 
                  id="senha" type="password" value={formData.senha} onChange={(e) => setFormData({...formData, senha: e.target.value})}
                  placeholder="••••••••" 
                  className="pl-10 h-12 border-[#73AABF]/20 focus:border-[#103173] focus:ring-[#103173] rounded-xl font-medium"
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button 
              type="submit" disabled={isLoading}
              className="w-full h-14 bg-[#103173] hover:bg-[#103B73] text-white font-black text-lg rounded-xl shadow-lg transition-all active:scale-95"
            >
              {isLoading ? "PROCESSANDO..." : "SOLICITAR CADASTRO"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}