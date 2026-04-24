"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Lock, Mail, Phone, User, ArrowLeft, KeyRound } from "lucide-react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LabeledIconInput } from "@/components/auth/labeled-icon-input";

export default function CadastroAluno() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [etapa, setEtapa] = useState<1 | 2>(1); // 1: Dados, 2: Validação de Código
  const [erro, setErro] = useState("");
  
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    senha: "",
    codigo: ""
  });

  const handleCadastrar = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    // Validação simples de email institucional (exemplo)
    if (!formData.email.includes("@")) {
      setErro("Formato de e-mail inválido.");
      return;
    }

    setIsLoading(true);
    
    // Simula envio de email e avanço de etapa
    setTimeout(() => {
      setIsLoading(false);
      setEtapa(2);
    }, 1500);
  };

  const handleValidarCodigo = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (formData.codigo.length < 6) {
      setErro("O código deve ter 6 dígitos.");
      return;
    }

    setIsLoading(true);

    // Simula verificação do código
    setTimeout(() => {
      setIsLoading(false);
      if (formData.codigo === "123456") { // Código mockado para sucesso
        window.alert("Cadastro realizado com sucesso! Bem-vindo ao sistema.");
        router.push("/");
      } else {
        setErro("Código incorreto ou expirado. Tente novamente.");
      }
    }, 1500);
  };

  return (
    <AuthPageShell className="py-10">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white/80 backdrop-blur-md z-10">
        <CardHeader className="space-y-4 pb-6 text-center relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-4 top-4 text-[#73AABF] hover:text-[#103173] hover:bg-[#103173]/10"
            onClick={() => etapa === 2 ? setEtapa(1) : router.push("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="mx-auto bg-[#103173] p-4 rounded-2xl w-fit shadow-lg shadow-[#103173]/20">
            <GraduationCap className="h-10 w-10 text-[#F2D022]" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black text-[#103173] tracking-tight">
              {etapa === 1 ? "Cadastro Aluno" : "Validar E-mail"}
            </CardTitle>
            <CardDescription className="text-[#73AABF] font-bold">
              {etapa === 1 
                ? "Crie sua conta para acessar os roteiros" 
                : `Enviamos um código para ${formData.email || 'seu e-mail'}`}
            </CardDescription>
          </div>
          
          {erro && (
            <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl border border-red-100">
              {erro}
            </div>
          )}
        </CardHeader>

        {etapa === 1 ? (
          <form onSubmit={handleCadastrar}>
            <CardContent className="space-y-4">
              <LabeledIconInput
                id="nome"
                label="Nome Completo"
                icon={User}
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="João da Silva"
                required
              />

              <LabeledIconInput
                id="telefone"
                label="Telefone"
                icon={Phone}
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(75) 90000-0000"
                required
              />

              <LabeledIconInput
                id="email"
                label="E-mail Institucional"
                icon={Mail}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="aluno@uefs.br"
                required
              />

              <LabeledIconInput
                id="senha"
                label="Senha"
                icon={Lock}
                type="password"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                placeholder="Crie uma senha forte"
                required
              />
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-4">
              <Button 
                type="submit" disabled={isLoading}
                className="w-full h-14 bg-[#103173] hover:bg-[#103B73] text-white font-black text-lg rounded-xl shadow-lg transition-all active:scale-95"
              >
                {isLoading ? "PROCESSANDO..." : "CADASTRAR"}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleValidarCodigo}>
            <CardContent className="space-y-4">
              <div>
                <LabeledIconInput
                  id="codigo"
                  label="Código de Validação"
                  icon={KeyRound}
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  placeholder="Ex: 123456"
                  maxLength={6}
                  inputClassName="font-black tracking-widest text-center text-lg"
                  required
                />
                <p className="text-xs font-bold text-[#73AABF] text-center mt-4">
                  Dica: Para o protótipo, digite &quot;123456&quot;.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-4">
              <Button 
                type="submit" disabled={isLoading}
                className="w-full h-14 bg-[#23B99A] hover:bg-[#1d957c] text-white font-black text-lg rounded-xl shadow-lg transition-all active:scale-95"
              >
                {isLoading ? "VALIDANDO..." : "CONFIRMAR CADASTRO"}
              </Button>
              <button type="button" className="text-xs font-bold text-[#73AABF] hover:text-[#103173] mt-2">
                Não recebeu o código? Reenviar.
              </button>
            </CardFooter>
          </form>
        )}
      </Card>
    </AuthPageShell>
  );
}