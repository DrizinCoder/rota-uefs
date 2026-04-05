export type StatusOnibus = "ativo" | "manutencao" | "inativo";

export interface OnibusFrota {
  id: string;
  placa: string;
  modelo: string;
  ano: number;
  capacidade: number;
  motorista: string;
  rotaPrincipal: string;
  rotasVinculadas: string[];
  viagensHoje: number;
  ocupacaoMedia: number;
  ultimaManutencao: string;
  status: StatusOnibus;
  codigoEmbarqueAtivo?: string;
}

export const FROTA_MOCK: OnibusFrota[] = [
  {
    id: "BUS-001",
    placa: "JLS-1020",
    modelo: "Marcopolo Torino",
    ano: 2022,
    capacidade: 44,
    motorista: "João Silva",
    rotaPrincipal: "Salvador → Feira de Santana",
    rotasVinculadas: ["ROT-001", "ROT-002", "ROT-9901"],
    viagensHoje: 4,
    ocupacaoMedia: 86,
    ultimaManutencao: "12/03/2026",
    status: "ativo",
    codigoEmbarqueAtivo: "UEFS-7729-X",
  },
  {
    id: "BUS-002",
    placa: "QTX-4B31",
    modelo: "Caio Apache Vip V",
    ano: 2021,
    capacidade: 44,
    motorista: "Carla Nascimento",
    rotaPrincipal: "Feira de Santana → Salvador",
    rotasVinculadas: ["ROT-003", "ROT-004"],
    viagensHoje: 3,
    ocupacaoMedia: 74,
    ultimaManutencao: "10/03/2026",
    status: "ativo",
  },
  {
    id: "BUS-003",
    placa: "PKJ-8D09",
    modelo: "Volare Fly 10",
    ano: 2020,
    capacidade: 32,
    motorista: "Rafael Lima",
    rotaPrincipal: "Módulo 3 (UEFS) →  Burger King/Ao lado do Sam's Club",
    rotasVinculadas: ["ROT-UEFS-002"],
    viagensHoje: 5,
    ocupacaoMedia: 81,
    ultimaManutencao: "05/03/2026",
    status: "ativo",
  },
  {
    id: "BUS-004",
    placa: "JLS-2033",
    modelo: "Mercedes OF-1721",
    ano: 2019,
    capacidade: 44,
    motorista: "A definir",
    rotaPrincipal: "Reserva Operacional",
    rotasVinculadas: ["Sem rota ativa"],
    viagensHoje: 0,
    ocupacaoMedia: 0,
    ultimaManutencao: "16/03/2026",
    status: "manutencao",
  },
  {
    id: "BUS-005",
    placa: "OZU-1188",
    modelo: "Neobus Mega Plus",
    ano: 2017,
    capacidade: 46,
    motorista: "Sérgio Matos",
    rotaPrincipal: "Feira de Santana → Salvador",
    rotasVinculadas: ["Histórico 2025"],
    viagensHoje: 0,
    ocupacaoMedia: 0,
    ultimaManutencao: "22/02/2026",
    status: "inativo",
  },
];

export const MOTORISTAS_MOCK = [
  "João Silva",
  "Carla Nascimento",
  "Rafael Lima",
  "Sérgio Matos",
  "Patrícia Gomes",
  "A definir",
];

export const ROTAS_MOCK = [
  "ROT-001",
  "ROT-002",
  "ROT-003",
  "ROT-004",
  "ROT-9901",
  "ROT-UEFS-002",
];

export function gerarProximoIdOnibus() {
  const maior = FROTA_MOCK.reduce((maximo, onibus) => {
    const numero = Number(onibus.id.replace(/\D/g, ""));
    return Number.isNaN(numero) ? maximo : Math.max(maximo, numero);
  }, 0);

  return `BUS-${String(maior + 1).padStart(3, "0")}`;
}
