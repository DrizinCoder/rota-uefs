import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export interface MetricCardProps {
  label: string;
  valor: string;
  destaque: string;
  icon: LucideIcon;
}

export function MetricCard({ label, valor, destaque, icon: Icon }: MetricCardProps) {
  return (
    <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden group">
      <CardContent className="p-5 flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-slate-800 leading-none">{valor}</p>
          <p className="text-xs font-medium text-slate-400">{destaque}</p>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-400 group-hover:text-cyan-600 group-hover:bg-cyan-50 group-hover:border-cyan-100 transition-colors">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
