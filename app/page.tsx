"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BusFront, Lock, User, ShieldCheck } from "lucide-react";

export default function TelaLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Função simples para simular o login e redirecionar
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulando um delay de rede
    setTimeout(() => {
      // Por padrão, vamos mandar para a tela de passageiro
      router.push("/passageiro");
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#E4F2F1] p-4 relative overflow-hidden">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-[#103173] opacity-5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[#F2D022] opacity-10 rounded-full blur-3xl" />

      <Card className="w-full max-w-md border-none shadow-2xl bg-white/80 backdrop-blur-md z-10">
        <CardHeader className="space-y-4 pb-8 text-center">
          <div className="mx-auto bg-[#103173] p-4 rounded-2xl w-fit shadow-lg shadow-[#103173]/20">
            <BusFront className="h-10 w-10 text-[#F2D022]" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black text-[#103173] tracking-tight">
              Rota UEFS
            </CardTitle>
            <CardDescription className="text-[#73AABF] font-bold">
              Entre com sua matrícula para acessar o transporte
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="matricula" className="text-[#103173] font-bold ml-1">Matrícula</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-[#73AABF]" />
                <Input
                  id="matricula"
                  placeholder="000000000"
                  className="pl-10 h-12 border-[#73AABF]/20 focus:border-[#103173] focus:ring-[#103173] rounded-xl font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label htmlFor="pass" className="text-[#103173] font-bold">Senha</Label>
                <button 
                  type="button" 
                  onClick={() => router.push("/recuperar-senha")}
                  className="text-xs font-bold text-[#73AABF] hover:text-[#103173]"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-[#73AABF]" />
                <Input
                  id="pass"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 border-[#73AABF]/20 focus:border-[#103173] focus:ring-[#103173] rounded-xl font-medium"
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#103173] hover:bg-[#103B73] text-white font-black text-lg rounded-xl shadow-lg transition-all active:scale-95"
            >
              {isLoading ? "CARREGANDO..." : "ENTRAR NO SISTEMA"}
            </Button>

            <div className="flex flex-col sm:flex-row w-full gap-3 mt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/cadastro/aluno")}
                className="flex-1 border-2 border-[#103173]/10 hover:border-[#103173]/40 hover:bg-[#103173]/5 text-[#103173] font-bold text-xs md:text-sm h-12 rounded-xl transition-all"
              >
                Primeiro Acesso: Aluno
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/cadastro/professor")}
                className="flex-1 border-2 border-[#103173]/10 hover:border-[#103173]/40 hover:bg-[#103173]/5 text-[#103173] font-bold text-xs md:text-sm h-12 rounded-xl transition-all"
              >
                Primeiro Acesso: Prof.
              </Button>
            </div>

            <div className="flex items-center gap-2 text-[#73AABF] text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-2">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Acesso Restrito à Comunidade Acadêmica</span>
            </div>
          </CardFooter>
        </form>
      </Card>

      {/* Atalhos rápidos para você testar as páginas novas enquanto desenvolve */}
      <div className="absolute bottom-4 flex gap-4 opacity-40 hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" onClick={() => router.push("/passageiro")} className="text-[#103173] font-bold">Ir para Passageiro</Button>
        <Button variant="ghost" size="sm" onClick={() => router.push("/motorista")} className="text-[#103173] font-bold">Ir para Motorista</Button>
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin")} className="text-[#103173] font-bold">Ir para Admin</Button>
      </div>
    </div>
  );
}