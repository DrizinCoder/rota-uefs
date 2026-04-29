"use client";

import { use, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { authService } from "@/services/authService";
import { toast } from "sonner";

const REDIRECT_MAP: Record<string, string> = {
  Student: "/passageiro",
  Staff: "/professor",
  Faculty: "/professor",
  Driver: "/motorista",
  Admin: "/admin",
};

export default function ActivateAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const activated = useRef(false);

  useEffect(() => {
    if (!token || activated.current) return;

    const activate = async () => {
      activated.current = true;
      try {
        const resposta = await authService.activateAccount(token);

        const { access_token, user } = resposta.data;
        const profile = user.profile;
        const destino = REDIRECT_MAP[profile] || "/";

        localStorage.setItem("token", access_token);
        document.cookie = `user_profile=${profile}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        toast.success("Conta ativada com sucesso!");

        router.push(destino);
      } catch (error: any) {
        toast.error("Erro ao ativar conta ou token expirado.");
        router.push("/login");
      }
    };

    activate();
  }, [token, router]);

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] items-center justify-center p-4">
      <Spinner className="h-16 w-16 text-[#103173]" />
      <p className="mt-6 text-[#103173] font-black text-sm uppercase tracking-widest animate-pulse">
        Ativando sua conta...
      </p>
    </div>
  );
}
