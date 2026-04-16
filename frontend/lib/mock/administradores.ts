export type StatusAdministrador = "ativo" | "bloqueado" | "pendente";

export type PerfilAdministrador =
  | "super_admin"
  | "gestor_frota"
  | "gestor_viagens"
  | "operacao_embarque"
  | "compliance";

export type NivelPermissao = "nenhum" | "leitura" | "edicao" | "total";

export type ModuloSistema =
  | "Ônibus"
  | "Motoristas"
  | "Viagens"
  | "Rotas Disponíveis"
  | "Passageiros da Viagem"
  | "Código de Check-in"
  | "Usuários e Permissões"
  | "Penalidades"
  | "Histórico de Penalidades"
  | "Histórico Operacional";

export interface PermissaoAdministrador {
  modulo: ModuloSistema;
  nivel: NivelPermissao;
}

export interface UsuarioAdministradorMock {
  id: string;
  nome: string;
  matricula: string;
  email: string;
  telefone: string;
  perfil: PerfilAdministrador;
  status: StatusAdministrador;
  ultimoAcesso: string;
  acessosHoje: number;
  mfaAtivo: boolean;
  pendenciasAtivas: number;
  rotasEscopo: string[];
  onibusEscopo: string[];
  motoristasEscopo: string[];
  permissoes: PermissaoAdministrador[];
  observacoes: string;
}

export const PERFIS_ADMINISTRADOR_MOCK: PerfilAdministrador[] = [
  "super_admin",
  "gestor_frota",
  "gestor_viagens",
  "operacao_embarque",
  "compliance",
];

export const MODULOS_SISTEMA_MOCK: ModuloSistema[] = [
  "Ônibus",
  "Motoristas",
  "Viagens",
  "Rotas Disponíveis",
  "Passageiros da Viagem",
  "Código de Check-in",
  "Usuários e Permissões",
  "Penalidades",
  "Histórico de Penalidades",
  "Histórico Operacional",
];

const MODULOS_PADRAO: ModuloSistema[] = MODULOS_SISTEMA_MOCK;

function montarPermissoes(
  niveisPorModulo: Partial<Record<ModuloSistema, NivelPermissao>>,
): PermissaoAdministrador[] {
  return MODULOS_PADRAO.map((modulo) => ({
    modulo,
    nivel: niveisPorModulo[modulo] ?? "nenhum",
  }));
}

export const USUARIOS_ADMIN_MOCK: UsuarioAdministradorMock[] = [
  {
    id: "ADM-001",
    nome: "Marina Almeida",
    matricula: "2016001",
    email: "marina.almeida@uefs.br",
    telefone: "(75) 99100-8899",
    perfil: "super_admin",
    status: "ativo",
    ultimoAcesso: "Hoje, 08:17",
    acessosHoje: 14,
    mfaAtivo: true,
    pendenciasAtivas: 0,
    rotasEscopo: ["ROT-001", "ROT-002", "ROT-003", "ROT-004", "ROT-9901", "ROT-UEFS-002"],
    onibusEscopo: ["JLS-1020", "QTX-4B31", "PKJ-8D09", "JLS-2033"],
    motoristasEscopo: ["João Silva", "Carla Nascimento", "Rafael Lima", "Patrícia Gomes"],
    permissoes: montarPermissoes({
      "Ônibus": "total",
      Motoristas: "total",
      Viagens: "total",
      "Rotas Disponíveis": "total",
      "Passageiros da Viagem": "total",
      "Código de Check-in": "total",
      "Usuários e Permissões": "total",
      Penalidades: "total",
      "Histórico de Penalidades": "total",
      "Histórico Operacional": "total",
    }),
    observacoes: "Conta institucional da coordenação geral. Responsável por liberações críticas.",
  },
  {
    id: "ADM-002",
    nome: "Diego Rocha",
    matricula: "2019014",
    email: "diego.rocha@uefs.br",
    telefone: "(75) 99214-7610",
    perfil: "gestor_frota",
    status: "ativo",
    ultimoAcesso: "Hoje, 07:42",
    acessosHoje: 9,
    mfaAtivo: true,
    pendenciasAtivas: 0,
    rotasEscopo: ["ROT-001", "ROT-002", "ROT-004"],
    onibusEscopo: ["JLS-1020", "QTX-4B31", "JLS-2033"],
    motoristasEscopo: ["João Silva", "Carla Nascimento", "Patrícia Gomes"],
    permissoes: montarPermissoes({
      "Ônibus": "total",
      Motoristas: "edicao",
      Viagens: "leitura",
      "Rotas Disponíveis": "edicao",
      "Passageiros da Viagem": "leitura",
      "Código de Check-in": "leitura",
      Penalidades: "leitura",
      "Histórico Operacional": "total",
    }),
    observacoes: "Acompanha disponibilidade da frota e alocações de manutenção preventiva.",
  },
  {
    id: "ADM-003",
    nome: "Fernanda Pires",
    matricula: "2020031",
    email: "fernanda.pires@uefs.br",
    telefone: "(75) 99378-4412",
    perfil: "gestor_viagens",
    status: "ativo",
    ultimoAcesso: "Hoje, 08:03",
    acessosHoje: 11,
    mfaAtivo: true,
    pendenciasAtivas: 1,
    rotasEscopo: ["ROT-003", "ROT-004", "ROT-UEFS-002", "ROT-9901"],
    onibusEscopo: ["QTX-4B31", "PKJ-8D09"],
    motoristasEscopo: ["Carla Nascimento", "Rafael Lima"],
    permissoes: montarPermissoes({
      "Ônibus": "leitura",
      Motoristas: "leitura",
      Viagens: "total",
      "Rotas Disponíveis": "total",
      "Passageiros da Viagem": "edicao",
      "Código de Check-in": "edicao",
      Penalidades: "leitura",
      "Histórico Operacional": "edicao",
    }),
    observacoes: "Responsável por ajustes de calendário e monitoramento de quórum das viagens.",
  },
  {
    id: "ADM-004",
    nome: "Patrícia Gomes",
    matricula: "2018122",
    email: "patricia.gomes@uefs.br",
    telefone: "(75) 99333-4455",
    perfil: "operacao_embarque",
    status: "pendente",
    ultimoAcesso: "Nunca acessou",
    acessosHoje: 0,
    mfaAtivo: false,
    pendenciasAtivas: 2,
    rotasEscopo: ["ROT-001", "ROT-002", "ROT-9901"],
    onibusEscopo: ["JLS-1020"],
    motoristasEscopo: ["João Silva"],
    permissoes: montarPermissoes({
      Viagens: "leitura",
      "Rotas Disponíveis": "leitura",
      "Passageiros da Viagem": "edicao",
      "Código de Check-in": "total",
      "Histórico Operacional": "leitura",
    }),
    observacoes: "Convite enviado para apoiar operação de embarque e validação de presença.",
  },
  {
    id: "ADM-005",
    nome: "Eduardo Costa",
    matricula: "2017455",
    email: "eduardo.costa@uefs.br",
    telefone: "(75) 99481-9077",
    perfil: "compliance",
    status: "bloqueado",
    ultimoAcesso: "16/03/2026, 18:44",
    acessosHoje: 1,
    mfaAtivo: true,
    pendenciasAtivas: 3,
    rotasEscopo: ["Sem escopo ativo"],
    onibusEscopo: ["Sem alocação"],
    motoristasEscopo: ["Eduardo Costa"],
    permissoes: montarPermissoes({
      Motoristas: "leitura",
      Viagens: "leitura",
      Penalidades: "total",
      "Histórico de Penalidades": "total",
      "Histórico Operacional": "edicao",
    }),
    observacoes: "Conta bloqueada preventivamente até conclusão de revisão disciplinar interna.",
  },
];

export function gerarProximoIdAdministrador() {
  const maior = USUARIOS_ADMIN_MOCK.reduce((maximo, usuario) => {
    const numero = Number(usuario.id.replace(/\D/g, ""));
    return Number.isNaN(numero) ? maximo : Math.max(maximo, numero);
  }, 0);

  return `ADM-${String(maior + 1).padStart(3, "0")}`;
}
