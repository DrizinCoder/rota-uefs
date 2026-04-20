import { ReactNode } from "react";

interface RoleHeaderProps {
  icon: ReactNode;
  portalName: string;
  title: string;
  subtitle: string;
  dateRange?: string;
  rightContent?: ReactNode;
}

export function RoleHeader({
  icon,
  portalName,
  title,
  subtitle,
  dateRange = "(06/04 - 10/04)",
  rightContent,
}: RoleHeaderProps) {
  return (
    <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <span className="text-[11px] font-bold text-[#103173] uppercase tracking-widest">
            {portalName}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#103173] tracking-tight">
          {title}
        </h1>
        <p className="text-[#73AABF] text-sm mt-1 mb-1 font-medium">
          {subtitle}
        </p>
        {dateRange && (
          <span className="text-[15px] font-bold text-[#103173] uppercase tracking-widest">
            {dateRange}
          </span>
        )}
      </div>
      {rightContent && <div>{rightContent}</div>}
    </header>
  );
}
