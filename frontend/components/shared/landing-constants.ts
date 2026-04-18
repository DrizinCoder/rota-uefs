import { Bus, Clock, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ── Navbar ── */
export const NAV_LINKS = [
  { label: "INÍCIO", href: "#inicio" },
  { label: "TRAJETO", href: "#trajeto" },
  { label: "FALE CONOSCO", href: "#contato" },
] as const;

/* ── Hero stats ── */
export const HERO_STATS = [
  { num: "500+", label: "Alunos ativos" },
  { num: "12", label: "Rotas fixas" },
  { num: "100%", label: "Gratuito" },
] as const;

/* ── Quick features ── */
export interface QuickFeature {
  icon: LucideIcon;
  label: string;
  desc: string;
  color: string;
}

export const QUICK_FEATURES: QuickFeature[] = [
  { icon: Bus, label: "Transporte Gratuito", desc: "Sem custo para docentes e discentes da UEFS", color: "#103173" },
  { icon: Clock, label: "Horários Fixos", desc: "Viagens regulares entre Feira de Santana e Salvador", color: "#F2D022" },
  { icon: Shield, label: "Segurança", desc: "Motoristas credenciados e veículos inspecionados", color: "#73AABF" },
];

/* ── Route stops ── */
export interface RouteStop {
  name: string;
  sub: string;
  time?: string;
}

export const ROUTE_STOPS: RouteStop[] = [
  { name: "Salvador", sub: "Ponto de partida", time: "~06:00" },
  { name: "Feira de Santana", sub: "Campus UEFS", time: "~08:00" },
];

/* ── Route info items ── */
export interface RouteInfoItem {
  text: string;
  color: string;
}

export const ROUTE_INFO_ITEMS: RouteInfoItem[] = [
  { text: "Trajeto pela BR-324", color: "#F2D022" },
  { text: "Duração média: ~2 horas", color: "#F2D022" },
  { text: "Horários fixos de ida e volta", color: "#F2D022" },
  { text: "Faça login para consultar horários e rotas", color: "#73AABF" },
];
