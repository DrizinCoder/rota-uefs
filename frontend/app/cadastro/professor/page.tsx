"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Lock, Mail, Phone, User, ArrowLeft, BadgeCheck, ShieldAlert, BriefcaseBusiness } from "lucide-react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LabeledIconInput } from "@/components/auth/labeled-icon-input";

// Bloco de código referente à integração com o backend (authService)
import { authService, RegisterServidorDTO } from '@/services/authService';



export default function CadastroProfessorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSucesso, setIsSucesso] = useState(false); // Ver isso
  const [erro, setErro] = useState("");
  
  const [formData, setFormData] = useState<RegisterServidorDTO>({
    full_name: '',
    registration_id: '',
    employment: '',
    department: '',
    phone: '',
    email: '',
    password: '',
  });

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  let { name, value } = e.target;

  // Máscara para matrícula (apenas números, máximo 8 caracteres) ATIVAR CASO QUEIRA LIMITAR O TAMANHO DA MATRÍCULA
  // if (name === "registration_id") {
  //   value = value.replace(/\D/g, "").slice(0, 8);
  // }

  setFormData(estadoAnterior => ({
    ...estadoAnterior,
    [name]: value      
  }));
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // MUITO IMPORTANTE: Evita que a página recarregue do nada
    setIsLoading(true);
    setErro("");

    try {
      
      const resposta = await authService.cadastroServidor(formData);
      
      setIsSucesso(true);

    } catch (error) {

      alert("Erro ao cadastrar. Olhe o terminal/console.");
    } finally {
      setIsLoading(false);
    }
  };

  // const validarFormulario = () => {
  //   const nome = formData.nome.trim();
  //   const matricula = formData.matricula.trim();
  //   const departamento = formData.departamento.trim();
  //   const telefoneNumeros = formData.telefone.replace(/\D/g, "");
  //   const email = formData.email.trim().toLowerCase();
  //   const senha = formData.senha;

  //   if (nome.length < 3) {
  //     return "Nome completo deve ter pelo menos 3 caracteres.";
  //   }

  //   if (!/^[A-Za-z0-9-]{4,20}$/.test(matricula)) {
  //     return "Matrícula inválida. Use de 4 a 20 caracteres (letras, números e hífen).";
  //   }

  //   if (!formData.vinculo) {
  //     return "Selecione um tipo de vínculo válido.";
  //   }

  //   if (departamento.length < 2) {
  //     return "Departamento inválido.";
  //   }

  //   if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
  //     return "Telefone inválido. Informe DDD + número com 10 ou 11 dígitos.";
  //   }

  //   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  //     return "Formato de e-mail inválido.";
  //   }

  //   if (!email.endsWith("@uefs.br")) {
  //     return "Use um e-mail institucional terminado em @uefs.br.";
  //   }

  //   if (senha.length < 8) {
  //     return "A senha deve ter pelo menos 8 caracteres.";
  //   }

  //   return null;
  // };

  // const handleCadastrar = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setErro("");

  //   const erroValidacao = validarFormulario();
  //   if (erroValidacao) {
  //     setErro(erroValidacao);
  //     return;
  //   }

  //   setIsLoading(true);
    
  //   // Simula validação e envio para backend
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     setIsSucesso(true); // Exibe a tela de pendente de validação
  //   }, 1500);
  // };

  if (isSucesso) {
    return (
      <AuthPageShell>
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
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell className="py-10">
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

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <LabeledIconInput
              id="nome"
              name="full_name"
              label="Nome Completo"
              icon={User}
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Seu nome completo"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <LabeledIconInput
                  id="matricula"
                  name="registration_id"
                  label="Matrícula"
                  icon={BadgeCheck}
                  value={formData.registration_id}
                  onChange={handleChange}
                  placeholder="2024101"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vinculo" className="text-[#103173] font-bold ml-1">Vínculo</Label>
                <select
                  id="vinculo"
                  name="employment"
                  value={formData.employment}
                  onChange={handleChange}
                  className="w-full h-12 px-3 border border-[#73AABF]/20 rounded-xl bg-transparent font-medium text-sm text-[#103173] focus:outline-none focus:ring-2 focus:ring-[#103173]"
                  required
                >
                  <option value="" disabled>Selecione...</option>
                  <option value="Staff">Servidor Técnico</option>
                  <option value="Faculty">Docente</option>
                </select>
              </div>
              
            </div>

            <LabeledIconInput
              id="departamento"
              name="department"
              label="Departamento"
              icon={BriefcaseBusiness}
              value={formData.department}
              onChange={handleChange}
              placeholder="Ex: DTEC"
              required
            />

            <LabeledIconInput
              id="telefone"
              name="phone"
              label="Telefone"
              icon={Phone}
              value={formData.phone}
              onChange={handleChange}
              placeholder="(75) 90000-0000"
              required
            />

            <LabeledIconInput
              id="email"
              name="email"
              label="E-mail"
              icon={Mail}
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ex: email@uefs.br"
              required
            />
            
            <LabeledIconInput
              id="senha"
              name="password"
              label="Senha"
              icon={Lock}
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
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
    </AuthPageShell>
  );
}