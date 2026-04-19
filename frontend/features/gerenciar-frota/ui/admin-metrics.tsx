import { Bus, Route, Settings2 } from "lucide-react";
import { MetricCard } from "@/components/admin/metric-card";

interface AdminMetricsProps {
  totalFrota: number;
  onibusAtivos: number;
  viagensHoje: number;
}

export function AdminMetrics({ totalFrota, onibusAtivos, viagensHoje }: AdminMetricsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Total da Frota"
        valor={totalFrota.toString()}
        destaque="Veículos registrados"
        icon={Bus}
      />
      <MetricCard
        label="Ônibus Ativos"
        valor={onibusAtivos.toString()}
        destaque="Em operação hoje"
        icon={Settings2}
      />
      <MetricCard
        label="Viagens Hoje"
        valor={viagensHoje.toString()}
        destaque="Escalas em andamento"
        icon={Route}
      />
    </section>
  );
}
