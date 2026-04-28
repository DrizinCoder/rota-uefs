"use client";


import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Lock, Mail, Phone, User, ArrowLeft, KeyRound, BadgeCheck } from "lucide-react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LabeledIconInput } from "@/components/auth/labeled-icon-input";

// Bloco de código referente à integração com o backend (authService)

import { useState } from "react";
import { authService, RegisterAlunoDTO } from '@/services/authService';

export default function CadastroAlunoPage() {
  // Hooks
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [etapa, setEtapa] = useState<1 | 2>(1);

  // Criando o state com os campos vazios
  const [formData, setFormData] = useState<RegisterAlunoDTO>({
    full_name: '',
    password: '',
    registration_id: '',
    phone: '',
    email: ''
  });

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let { name, value } = e.target;
  
  // Máscara para matrícula (apenas números, máximo 8 caracteres)
  if (name === "registration_id") {
    value = value.replace(/\D/g, "").slice(0, 8);
  }

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
      
      const resposta = await authService.cadastroAluno(formData);
      
      setEtapa(2);

    } catch (error) {

      alert("Erro ao cadastrar. Olhe o terminal/console.");
    } finally {
      setIsLoading(false);
    }
  };

  // ADICIONAR INTEGRAÇÃO DA VALIDAÇÃO DO CÓDIGO
  

// Fim do bloco integração




  // const validarFormulario = () => {
  //   const nome = formData.nome.trim();
  //   const matricula = formData.matricula.trim();
  //   const telefoneNumeros = formData.telefone.replace(/\D/g, "");
  //   const email = formData.email.trim().toLowerCase();
  //   const senha = formData.senha;

  //   if (nome.length < 3) {
  //     return "Nome completo deve ter pelo menos 3 caracteres.";
  //   }

  //   if (!/^\d{8}$/.test(matricula)) {
  //     return "Matrícula inválida. Informe 8 dígitos numéricos.";
  //   }

  //   const anoMatricula = Number.parseInt(matricula.slice(0, 2), 10);
  //   const semestreMatricula = matricula.slice(2, 3);
  //   const anoAtualDoCurso = new Date().getFullYear() - 2000;

  //   if (anoMatricula > anoAtualDoCurso || !["1", "2"].includes(semestreMatricula)) {
  //     return "Matrícula inválida. Verifique ano e semestre.";
  //   }

  //   if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
  //     return "Telefone inválido. Informe DDD + número com 10 ou 11 dígitos.";
  //   }

  //   const emailEsperado = `${matricula}@discente.uefs.br`;
  //   if (email !== emailEsperado) {
  //     return `E-mail institucional inválido. Use ${emailEsperado}.`;
  //   }

  //   if (senha.length < 8) {
  //     return "A senha deve ter pelo menos 8 caracteres.";
  //   }

  //   return null;
  // };




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
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <LabeledIconInput
                id="nome"
                name="full_name"
                label="Nome Completo"
                icon={User}
                value={formData.full_name}
                onChange={handleChange}
                placeholder="João da Silva"
                required
              />

              <LabeledIconInput
                id="telefone"
                label="Telefone"
                name="phone"
                icon={Phone}
                value={formData.phone}
                onChange={handleChange}
                placeholder="(75) 90000-0000"
                required
              />

              <LabeledIconInput
                id="matricula"
                name="registration_id"
                label="Matrícula"
                icon={BadgeCheck}
                value={formData.registration_id}
                onChange={handleChange}
                placeholder="23121111"
                maxLength={8}
                required
              />

              <LabeledIconInput
                id="email"
                name="email"
                label="E-mail Institucional"
                icon={Mail}
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="23121111@discente.uefs.br"
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