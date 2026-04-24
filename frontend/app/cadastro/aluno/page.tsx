"use client";


import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Lock, Mail, Phone, User, ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";

// Bloco de código referente à integração com o backend (authService)

import { useState } from "react";
import { authService, RegisterAlunoDTO } from '@/services/authService';

export default function CadastroAlunoPage() {
  // Hooks
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState("");

  // Criando o state com os campos vazios
  const [formData, setFormData] = useState<RegisterAlunoDTO>({
    full_name: '',
    password: '',
    registration_id: '',
    phone: '',
    email: ''
  });

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(estadoAnterior => ({
      ...estadoAnterior, // Mantém o que já tinha digitado nos outros campos
      [name]: value      // Atualiza só o campo que o usuário tá mexendo agora
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // MUITO IMPORTANTE: Evita que a página recarregue do nada
    setIsLoading(true);
    setErro("");

    try {
      // console.log("Enviando dados do discente:", formData);
      
      // Aqui a mágica da integração acontece!
      const resposta = await authService.cadastroAluno(formData);
      
      //console.log("Deu bom! Aluno cadastrado:", resposta);
      alert("Cadastro realizado com sucesso!");
    } catch (error) {
      // console.error("Deu ruim na requisição:", error);
      alert("Erro ao cadastrar. Olhe o terminal/console.");
    } finally {
      setIsLoading(false);
    }
  };


// Fim do bloco integração


// export default function CadastroAluno() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [etapa, setEtapa] = useState<1 | 2>(1); // 1: Dados, 2: Validação de Código
//   const [erro, setErro] = useState("");
  
//   const [formData, setFormData] = useState({
//     nome: "",
//     matricula: "",
//     telefone: "",
//     email: "",
//     senha: "",
//     codigo: ""
//   });

  // const handleValidarCodigo = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setErro("");

  //   if (formData.codigo.length < 6) {
  //     setErro("O código deve ter 6 dígitos.");
  //     return;
  //   }

  //   setIsLoading(true);

  //   // Simula verificação do código
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     if (formData.codigo === "123456") { // Código mockado para sucesso
  //       window.alert("Cadastro realizado com sucesso! Bem-vindo ao sistema.");
  //       router.push("/");
  //     } else {
  //       setErro("Código incorreto ou expirado. Tente novamente.");
  //     }
  //   }, 1500);
  // };

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
            <GraduationCap className="h-10 w-10 text-[#F2D022]" />
          </div>
          
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black text-[#103173] tracking-tight">
              Cadastro Aluno
            </CardTitle>
            <CardDescription className="text-[#73AABF] font-bold">
              Crie sua conta para acessar os roteiros
            </CardDescription>
          </div>
          
          {erro && (
            <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl border border-red-100">
              {erro}
            </div>
          )}
        </CardHeader>

        {/* 👇 Aqui começa o Formulário Único */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-[#103173] font-bold ml-1">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-[#73AABF]" />
                <Input 
                  id="nome"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="João da Silva" 
                  className="pl-10 h-12 border-[#73AABF]/20 focus:border-[#103173] focus:ring-[#103173] rounded-xl font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="matricula" className="text-[#103173] font-bold ml-1">Matrícula</Label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 h-5 w-5 text-[#73AABF]" />
                <Input 
                  id="matricula" 
                  name="registration_id"
                  value={formData.registration_id} 
                  onChange={handleChange}
                  placeholder="Sua matrícula (8 dígitos)" 
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
                  id="telefone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(75) 90000-0000" 
                  className="pl-10 h-12 border-[#73AABF]/20 focus:border-[#103173] focus:ring-[#103173] rounded-xl font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#103173] font-bold ml-1">E-mail Institucional</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-[#73AABF]" />
                <Input 
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="aluno@uefs.br" 
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
                  id="senha"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Crie uma senha forte" 
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
              {isLoading ? "PROCESSANDO..." : "CADASTRAR"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}