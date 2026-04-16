"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, ArrowLeft, KeyRound, Send, CheckCircle2 } from "lucide-react";

export default function RecuperarSenha() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEnviado, setIsEnviado] = useState(false);
  const [erro, setErro] = useState("");

  const handleRecuperar = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    // Validação simples de e-mail
    if (!email || !email.includes("@")) {
      setErro("Por favor, insira um e-mail válido.");
      return;
    }

    setIsLoading(true);

    // Simulando a requisição para o backend
    setTimeout(() => {
      setIsLoading(false);
      setIsEnviado(true); // Muda para a tela de sucesso
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#E4F2F1] p-4 relative overflow-hidden">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-[#103173] opacity-5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[#F2D022] opacity-10 rounded-full blur-3xl" />

      <Card className="w-full max-w-md border-none shadow-2xl bg-white/80 backdrop-blur-md z-10 relative">
        {/* Botão de Voltar absoluto no canto do Card */}
        {!isEnviado && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 text-[#73AABF] hover:text-[#103173] hover:bg-[#103173]/10 z-20"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        {/* ETAPA 2: MENSAGEM DE SUCESSO */}
        {isEnviado ? (
          <div className="py-8 text-center animate-in fade-in zoom-in-95 duration-300">
            <CardHeader className="space-y-4">
              <div className="mx-auto bg-[#23B99A]/10 p-4 rounded-full w-fit mb-2">
                <CheckCircle2 className="h-12 w-12 text-[#23B99A]" />
              </div>
              <CardTitle className="text-2xl font-black text-[#103173] tracking-tight">
                E-mail Enviado!
              </CardTitle>
              <CardDescription className="text-[#73AABF] font-bold text-base px-4">
                Enviamos as instruções de recuperação para <br />
                <span className="text-[#103173] font-black">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm font-medium text-slate-500 pb-2">
              Verifique sua caixa de entrada e a pasta de spam. O link de
              recuperação expira em 30 minutos.
            </CardContent>
            <CardFooter className="pt-6">
              <Button
                onClick={() => router.push("/")}
                className="w-full h-14 bg-[#103173] hover:bg-[#103B73] text-white font-black text-lg rounded-xl shadow-lg transition-all active:scale-95"
              >
                VOLTAR PARA O LOGIN
              </Button>
            </CardFooter>
          </div>
        ) : (
          /* ETAPA 1: FORMULÁRIO DE SOLICITAÇÃO */
          <div className="animate-in fade-in duration-300">
            <CardHeader className="space-y-4 pb-8 text-center pt-10">
              <div className="mx-auto bg-[#103173] p-4 rounded-2xl w-fit shadow-lg shadow-[#103173]/20">
                <KeyRound className="h-10 w-10 text-[#F2D022]" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-3xl font-black text-[#103173] tracking-tight">
                  Recuperar Senha
                </CardTitle>
                <CardDescription className="text-[#73AABF] font-bold px-2">
                  Informe o e-mail associado à sua conta para receber o link de
                  redefinição.
                </CardDescription>
              </div>

              {erro && (
                <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl border border-red-100 mt-4 mx-2">
                  {erro}
                </div>
              )}
            </CardHeader>

            <form onSubmit={handleRecuperar}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[#103173] font-bold ml-1"
                  >
                    E-mail Cadastrado
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-[#73AABF]" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="pl-10 h-12 border-[#73AABF]/20 focus:border-[#103173] focus:ring-[#103173] rounded-xl font-medium"
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4 pt-4 pb-8">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-[#103173] hover:bg-[#103B73] text-white font-black text-lg rounded-xl shadow-lg transition-all active:scale-95"
                >
                  {isLoading ? (
                    "ENVIANDO..."
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" /> ENVIAR LINK
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
}
