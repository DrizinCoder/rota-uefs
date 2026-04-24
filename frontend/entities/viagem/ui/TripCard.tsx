import { cn } from "@/lib/utils";

interface TripCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TripCard({ children, className }: TripCardProps) {
  return (
    <div className={cn("bg-white rounded-2xl overflow-hidden shadow-sm p-4", className)}>
      {children}
    </div>
  );
}