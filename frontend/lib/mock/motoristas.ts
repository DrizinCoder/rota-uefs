export type StatusMotorista = "em_rota" | "disponivel" | "afastado" | "ferias";

export interface MotoristaMock {
  id: string;
  nome: string;
  matricula: string;
  cnhCategoria: string;
  validadeCnh: string;
  telefone: string;
  email: string;
  onibusAtual: string;
  rotasVinculadas: string[];
  viagensHoje: number;
  checkinsMes: number;
  avaliacaoMedia: number;
  penalidadesAtivas: number;
  status: StatusMotorista;
  ultimaAtualizacao: string;
}

export const MOTORISTAS_GESTAO_MOCK: MotoristaMock[] = [
  {
    id: "MOT-001",
    nome: "João Silva",
    matricula: "2021001",
    cnhCategoria: "D",
    validadeCnh: "18/09/2027",
    telefone: "(75) 99111-2201",
    email: "joao.silva@uefs.br",
    onibusAtual: "JLS-1020",
    rotasVinculadas: ["ROT-001", "ROT-002", "ROT-9901"],
    viagensHoje: 2,
    checkinsMes: 48,
    avaliacaoMedia: 4.8,
    penalidadesAtivas: 0,
    status: "em_rota",
    ultimaAtualizacao: "Hoje, 06:12",
  },
  {
    id: "MOT-002",
    nome: "Carla Nascimento",
    matricula: "2019044",
    cnhCategoria: "D",
    validadeCnh: "30/01/2028",
    telefone: "(75) 99277-3409",
    email: "carla.nascimento@uefs.br",
    onibusAtual: "QTX-4B31",
    rotasVinculadas: ["ROT-003", "ROT-004"],
    viagensHoje: 1,
    checkinsMes: 39,
    avaliacaoMedia: 4.6,
    penalidadesAtivas: 0,
    status: "disponivel",
    ultimaAtualizacao: "Hoje, 07:05",
  },
  {
    id: "MOT-003",
    nome: "Rafael Lima",
    matricula: "2020027",
    cnhCategoria: "D",
    validadeCnh: "11/05/2027",
    telefone: "(75) 99880-1123",
    email: "rafael.lima@uefs.br",
    onibusAtual: "PKJ-8D09",
    rotasVinculadas: ["ROT-UEFS-002"],
    viagensHoje: 3,
    checkinsMes: 54,
    avaliacaoMedia: 4.7,
    penalidadesAtivas: 0,
    status: "em_rota",
    ultimaAtualizacao: "Hoje, 08:40",
  },
  {
    id: "MOT-004",
    nome: "Patrícia Gomes",
    matricula: "2018122",
    cnhCategoria: "D",
    validadeCnh: "14/12/2029",
    telefone: "(75) 99333-4455",
    email: "patricia.gomes@uefs.br",
    onibusAtual: "Reserva",
    rotasVinculadas: ["Backup Operacional"],
    viagensHoje: 0,
    checkinsMes: 22,
    avaliacaoMedia: 4.4,
    penalidadesAtivas: 0,
    status: "disponivel",
    ultimaAtualizacao: "Ontem, 18:10",
  },
  {
    id: "MOT-005",
    nome: "Sérgio Matos",
    matricula: "2016330",
    cnhCategoria: "D",
    validadeCnh: "02/03/2027",
    telefone: "(75) 99741-6670",
    email: "sergio.matos@uefs.br",
    onibusAtual: "Sem alocação",
    rotasVinculadas: ["Feira ↔ Salvador"],
    viagensHoje: 0,
    checkinsMes: 0,
    avaliacaoMedia: 4.2,
    penalidadesAtivas: 0,
    status: "ferias",
    ultimaAtualizacao: "15/03/2026",
  },
  {
    id: "MOT-006",
    nome: "Eduardo Costa",
    matricula: "2017455",
    cnhCategoria: "D",
    validadeCnh: "27/08/2026",
    telefone: "(75) 99481-9077",
    email: "eduardo.costa@uefs.br",
    onibusAtual: "Sem alocação",
    rotasVinculadas: ["Sem rota ativa"],
    viagensHoje: 0,
    checkinsMes: 5,
    avaliacaoMedia: 3.9,
    penalidadesAtivas: 1,
    status: "afastado",
    ultimaAtualizacao: "16/03/2026",
  },
];

export const CATEGORIAS_CNH_MOCK = ["D", "E"];

export function gerarProximoIdMotorista() {
  const maior = MOTORISTAS_GESTAO_MOCK.reduce((maximo, motorista) => {
    const numero = Number(motorista.id.replace(/\D/g, ""));
    return Number.isNaN(numero) ? maximo : Math.max(maximo, numero);
  }, 0);

  return `MOT-${String(maior + 1).padStart(3, "0")}`;
}
