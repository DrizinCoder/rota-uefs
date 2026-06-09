import { cn } from "@/lib/utils";

interface TripCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TripCard({ children, className }: TripCardProps) {
  return (
    <div className={cn("bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100", className)}>
      <div className="h-1 bg-gradient-to-r from-[#F2D022] via-[#F2D022]/60 to-transparent" />
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}