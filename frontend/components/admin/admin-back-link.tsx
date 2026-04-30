"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type AdminBackLinkProps = {
  className?: string;
};

export function AdminBackLink({
  className = "flex items-center gap-2 text-sm font-bold text-[#103173] hover:text-[#23B99A] transition-colors mb-6",
}: AdminBackLinkProps) {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.push("/admin")} className={className}>
      <ArrowLeft className="h-4 w-4" />
      VOLTAR PARA ADMIN
    </button>
  );
}
