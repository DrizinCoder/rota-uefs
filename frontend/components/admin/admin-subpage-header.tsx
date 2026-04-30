import type { ReactNode } from "react";

type AdminSubpageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function AdminSubpageHeader({ title, description, action }: AdminSubpageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-[#103173] tracking-tight">{title}</h1>
        <p className="text-[#73AABF] text-sm mt-1 font-medium">{description}</p>
      </div>
      {action ?? null}
    </header>
  );
}
