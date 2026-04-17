export type StatusViagem = "programada" | "em_andamento" | "concluida" | "cancelada";

export interface ViagemMock {
  id: string;
  rotaCodigo: string;
  data: string;
  diaSemana: string;
  origem: string;
  destino: string;
  horarioSaida: string;
  horarioChegada: string;
  onibusId: string;
  onibusPlaca: string;
  motoristaId: string;
  motoristaNome: string;
  inscritos: number;
  capacidade: number;
  quorumMinimo: number;
  status: StatusViagem;
  codigoCheckin?: string;
  observacoes: string;
  ultimaAtualizacao: string;
}

export const PONTOS_ROTA_MOCK = [
  "Salvador",
  "Feira de Santana",
  "Módulo 5 (UEFS)",
  " Burger King/Ao lado do Sam's Club",
  "UEFS",
];

export const VIAGENS_GESTAO_MOCK: ViagemMock[] = [
  {
    id: "VIA-001",
    rotaCodigo: "ROT-001",
    data: "18/03/2026",
    diaSemana: "Quarta",
    origem: "Feira de Santana",
    destino: "Salvador",
    horarioSaida: "10:00",
    horarioChegada: "11:40",
    onibusId: "BUS-001",
    onibusPlaca: "JLS-1020",
    motoristaId: "MOT-001",
    motoristaNome: "João Silva",
    inscritos: 35,
    capacidade: 44,
    quorumMinimo: 20,
    status: "programada",
    codigoCheckin: "UEFS-7729-X",
    observacoes: "Rota principal intermunicipal com alta demanda no período da manhã.",
    ultimaAtualizacao: "Hoje, 08:05",
  },
  {
    id: "VIA-002",
    rotaCodigo: "ROT-002",
    data: "18/03/2026",
    diaSemana: "Quarta",
    origem: "Salvador",
    destino: "Feira de Santana",
    horarioSaida: "06:00",
    horarioChegada: "07:40",
    onibusId: "BUS-001",
    onibusPlaca: "JLS-1020",
    motoristaId: "MOT-001",
    motoristaNome: "João Silva",
    inscritos: 44,
    capacidade: 44,
    quorumMinimo: 20,
    status: "em_andamento",
    codigoCheckin: "UEFS-7729-X",
    observacoes: "Viagem de retorno da madrugada com lotação máxima.",
    ultimaAtualizacao: "Hoje, 06:12",
  },
  {
    id: "VIA-003",
    rotaCodigo: "ROT-003",
    data: "18/03/2026",
    diaSemana: "Quarta",
    origem: "Feira de Santana",
    destino: "Salvador",
    horarioSaida: "14:00",
    horarioChegada: "15:40",
    onibusId: "BUS-002",
    onibusPlaca: "QTX-4B31",
    motoristaId: "MOT-002",
    motoristaNome: "Carla Nascimento",
    inscritos: 0,
    capacidade: 44,
    quorumMinimo: 20,
    status: "cancelada",
    observacoes: "Cancelada por não atingir quórum mínimo até o prazo limite.",
    ultimaAtualizacao: "Hoje, 12:30",
  },
  {
    id: "VIA-004",
    rotaCodigo: "ROT-004",
    data: "18/03/2026",
    diaSemana: "Quarta",
    origem: "Salvador",
    destino: "Feira de Santana",
    horarioSaida: "18:00",
    horarioChegada: "19:40",
    onibusId: "BUS-002",
    onibusPlaca: "QTX-4B31",
    motoristaId: "MOT-002",
    motoristaNome: "Carla Nascimento",
    inscritos: 24,
    capacidade: 44,
    quorumMinimo: 20,
    status: "programada",
    observacoes: "Viagem vespertina regular para retorno de alunos.",
    ultimaAtualizacao: "Hoje, 09:10",
  },
  {
    id: "VIA-005",
    rotaCodigo: "ROT-UEFS-002",
    data: "18/03/2026",
    diaSemana: "Quarta",
    origem: "Módulo 5 (UEFS)",
    destino: " Burger King/Ao lado do Sam's Club",
    horarioSaida: "12:10",
    horarioChegada: "12:50",
    onibusId: "BUS-003",
    onibusPlaca: "PKJ-8D09",
    motoristaId: "MOT-003",
    motoristaNome: "Rafael Lima",
    inscritos: 29,
    capacidade: 32,
    quorumMinimo: 10,
    status: "concluida",
    codigoCheckin: "UEFS-5531-Q",
    observacoes: "Circuito interno concluído sem ocorrências operacionais.",
    ultimaAtualizacao: "Hoje, 13:01",
  },
  {
    id: "VIA-006",
    rotaCodigo: "ROT-9901",
    data: "18/03/2026",
    diaSemana: "Quarta",
    origem: " Burger King/Ao lado do Sam's Club",
    destino: "UEFS",
    horarioSaida: "06:40",
    horarioChegada: "07:20",
    onibusId: "BUS-001",
    onibusPlaca: "JLS-1020",
    motoristaId: "MOT-001",
    motoristaNome: "João Silva",
    inscritos: 30,
    capacidade: 44,
    quorumMinimo: 20,
    status: "concluida",
    observacoes: "Rota alinhada ao fluxo de confirmação de vagas dos passageiros.",
    ultimaAtualizacao: "Hoje, 07:25",
  },
];

export function gerarProximoIdViagem() {
  const maior = VIAGENS_GESTAO_MOCK.reduce((maximo, viagem) => {
    const numero = Number(viagem.id.replace(/\D/g, ""));
    return Number.isNaN(numero) ? maximo : Math.max(maximo, numero);
  }, 0);

  return `VIA-${String(maior + 1).padStart(3, "0")}`;
}
