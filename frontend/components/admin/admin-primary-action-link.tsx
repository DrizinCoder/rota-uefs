import Link from "next/link";
import type { ReactNode } from "react";

type AdminPrimaryActionLinkProps = {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
};

export function AdminPrimaryActionLink({ href, children, icon }: AdminPrimaryActionLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 bg-[#F2D022] hover:bg-[#d9ba1f] text-[#103173] font-bold py-2.5 px-5 rounded-xl shadow-sm transition-colors active:scale-95 shrink-0"
    >
      {icon}
      {children}
    </Link>
  );
}
