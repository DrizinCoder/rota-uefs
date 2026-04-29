"use client";

import { authService, LoginUserDTO } from "@/services/authService";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BusFront, Lock, User, ShieldCheck } from "lucide-react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LabeledIconInput } from "@/components/auth/labeled-icon-input";
import { toast } from "react-toastify";

/**
 * Componente que escuta os parâmetros da URL para disparar Toasts de feedback
 */
function LoginLogic() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    const activated = searchParams.get("activated");
    const status = searchParams.get("status");
    const messageCode = searchParams.get("message");

    // 1. Prioridade para o novo formato (status + message)
    if (status && messageCode) {
      const messages: Record<string, string> = {
        token_invalido: "O link de ativação é inválido ou já foi utilizado.",
        usuario_nao_encontrado:
          "Usuário não encontrado em nossa base de dados.",
        conta_ja_ativada: "Esta conta já está ativa! Você já pode entrar.",
        ativacao_sucesso: "Conta ativada com sucesso! Bem-vindo ao Rota UEFS.",
        token_expirado:
          "Este link expirou. Por favor, solicite uma nova ativação.",
      };

      const texto = messages[messageCode] || "Ocorreu um erro inesperado.";

      if (status === "success") toast.success(texto);
      else if (status === "error") toast.error(texto);
      else if (status === "warning") toast.warning(texto);

      return;
    }

    // 2. Lógica legada para compatibilidade
    if (activated === "true") {
      toast.success("Conta ativada com sucesso! Faça seu login.");
    }

    if (error) {
      const errorMessages: Record<string, string> = {
        invalid_token:
          "Link de ativação inválido. Verifique se copiou o link completo.",
        user_not_found: "Usuário não encontrado.",
        expired_or_invalid:
          "O link expirou ou é inválido. Tente solicitar novamente.",
      };
      toast.error(errorMessages[error] || "Ocorreu um erro na ativação.");
    }
  }, [searchParams]);

  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [formData, setFormData] = useState<LoginUserDTO>({
    registration_id: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const REDIRECT_MAP: Record<string, string> = {
    Student: "/passageiro",
    Staff: "/professor",
    Faculty: "/professor",
    Driver: "/motorista",
    Admin: "/admin",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErro("");

    try {
      const resposta = await authService.login(formData);
      const profile = resposta.data.user.profile;
      const destino = REDIRECT_MAP[profile] || "/login";

      localStorage.setItem("token", resposta.data.access_token);
      router.push(destino);
    } catch (error: any) {
      setErro("Matrícula ou senha incorretos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageShell>
      {/* O Suspense é obrigatório ao usar useSearchParams no App Router */}
      <Suspense fallback={null}>
        <LoginLogic />
      </Suspense>

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
          {erro && (
            <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl border border-red-100 mt-2">
              {erro}
            </div>
          )}
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <LabeledIconInput
              id="registration_id"
              name="registration_id"
              label="Matrícula"
              icon={User}
              placeholder="Ex: 23121111"
              value={formData.registration_id}
              onChange={handleChange}
              maxLength={15}
              required
            />

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label htmlFor="password" className="text-[#103173] font-bold">
                  Senha
                </Label>
                <button
                  type="button"
                  onClick={() => router.push("/recuperar-senha")}
                  className="text-xs font-bold text-[#73AABF] hover:text-[#103173]"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <LabeledIconInput
                id="password"
                name="password"
                label="Senha"
                icon={Lock}
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                containerClassName="space-y-0"
                labelClassName="hidden"
                required
              />
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

      {/* Atalhos para desenvolvimento */}
      <div className="absolute bottom-4 flex gap-4 opacity-40 hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/passageiro")}
          className="text-[#103173] font-bold"
        >
          Ir para Passageiro
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/motorista")}
          className="text-[#103173] font-bold"
        >
          Ir para Motorista
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin")}
          className="text-[#103173] font-bold"
        >
          Ir para Admin
        </Button>
      </div>
    </AuthPageShell>
  );
}
