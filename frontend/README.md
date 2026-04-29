<h1 align="center">ROTA UEFS - FrontEnd</h1>

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

> Interface web desenvolvida para o sistema de gerenciamento de transporte institucional intermunicipal da Universidade Estadual de Feira de Santana (UEFS).

</div>

---

## 📑 Sumário

- [1. Sobre a Disciplina](#-sobre-a-disciplina)
- [2. O Projeto](#-o-projeto)
- [3. Tecnologias e Arquitetura](#️-tecnologias-e-arquitetura)
- [4. Principais Funcionalidades da Interface](#-principais-funcionalidades-da-interface)
- [5. Primeiros Passos e Rodar Localmente](#-primeiros-passos-e-rodar-localmente)
- [6. Arquitetura do Projeto](#️-arquitetura-do-projeto)

---

## 📚 Sobre a Disciplina

Este projeto é desenvolvido como requisito prático sob a metodologia **PBL (Problem-Based Learning - Aprendizagem Baseada em Problemas)**. A disciplina visa aplicar conceitos essenciais de Engenharia de Computação e de Software na concepção, modelagem e implementação de uma solução tecnológica para um problema real da comunidade acadêmica, abrangendo desde o levantamento de requisitos até o deploy e o gerenciamento ágil (Scrum/Kanban) da equipe de desenvolvimento.

---

## 🎯 O Projeto

O sistema **ROTA UEFS** surge da necessidade de otimizar a logística de deslocamento entre Feira de Santana e Salvador, atendendo Docentes, Servidores e Discentes.

O frontend oferece uma plataforma digital centralizada com experiências distintas por perfil de usuário: **Passageiros** (Alunos, Servidores e Professores) gerenciam inscrições em rotas e realizam check-in via QR Code; **Motoristas** acompanham a lista de embarque e informações da viagem; e **Administradores** controlam toda a operação — frota, usuários, viagens e relatórios — por meio de um painel dedicado.

---

## 🛠️ Tecnologias e Arquitetura

O frontend foi estruturado seguindo princípios modernos de desenvolvimento web, com foco em performance, tipagem estática e separação clara de responsabilidades:

- **Framework:** [Next.js](https://nextjs.org/) (App Router) — Adotado pelo roteamento baseado em sistema de arquivos, suporte nativo a Server Components e facilidade de deploy.
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) — Garante segurança de tipos em toda a base de código, reduzindo bugs em tempo de desenvolvimento.
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) — Utilizado para construção ágil de interfaces responsivas com classes utilitárias.
- **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) com primitivos [Radix UI](https://www.radix-ui.com/) — Conjunto de componentes acessíveis e altamente personalizáveis.
- **Comunicação com API:** [Axios](https://axios-http.com/) — Realiza as chamadas HTTP ao backend FastAPI, com interceptors para gerenciamento automático de autenticação JWT.
- **Autenticação:** Proteção de rotas via `middleware.ts` do Next.js, com leitura do cookie `user_profile` para redirecionamento baseado em perfil.
- **Validação de Formulários:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — Validação declarativa e eficiente nos formulários de cadastro e autenticação.

---

## 📦 Principais Funcionalidades da Interface

A aplicação oferece fluxos distintos para três perfis de usuário (Passageiro, Motorista e Administrador), contemplando:

1. **Autenticação e Cadastro:** Telas de login, cadastro segmentado (Aluno / Professor/Servidor), recuperação de senha e ativação de conta por e-mail.
2. **Painel do Passageiro:** Visualização e inscrição em rotas disponíveis, acompanhamento de status da viagem e fluxo de confirmação de embarque via QR Code.
3. **Painel do Motorista:** Listagem de passageiros confirmados, informações da viagem em andamento e tela dedicada ao processo de embarque.
4. **Painel Administrativo:** Gestão completa de usuários, motoristas, frota de ônibus e viagens, além de acesso a relatórios e validação de cadastros de professores.
5. **Controle de Acesso por Perfil:** Middleware centralizado que protege todas as rotas privadas e redireciona o usuário conforme seu papel no sistema (`Admin`, `Driver`, `Student`, `Staff`, `Faculty`).
6. **Perfil do Usuário:** Tela dedicada à visualização e edição das informações pessoais do usuário autenticado.
7. **Minhas Viagens:** Histórico e acompanhamento das rotas em que o passageiro está inscrito.

---

## 📋 Primeiros Passos e Rodar Localmente

### 1. Clonar o repositório
```bash
git clone <link-do-repositorio> && cd rota-uefs/frontend
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Crie o arquivo `.env.local` dentro da pasta `/frontend` com base no exemplo:
```bash
cp .env.example .env.local
```
Em seguida, preencha as variáveis necessárias no arquivo `.env.local`.

> **Regra de Ouro:** Sempre que uma nova variável for adicionada ao `.env.local`, ela **deve** ser replicada no `.env.example`. Isso garante que todos os colaboradores saibam quais variáveis são obrigatórias.

### 4. Rodar o servidor de desenvolvimento
```bash
npm run dev
```

### 5. Acessar a aplicação
```
http://localhost:3000
```

> **Nota:** O backend (FastAPI) precisa estar rodando em `http://localhost:8000` para que as chamadas à API funcionem corretamente. Consulte o README do backend ou utilize `make up` na raiz do projeto para subir todos os serviços via Docker.

---

## 🏛️ Arquitetura do Projeto

O frontend segue uma arquitetura baseada em **Feature Slicing** adaptada, organizando o código por domínio funcional e separando claramente as responsabilidades de cada camada.

```
frontend/
├── app/                   # Roteamento (Next.js App Router)
│   ├── admin/             # Páginas do painel administrativo
│   ├── motorista/         # Páginas do painel do motorista
│   ├── passageiro/        # Páginas do painel do passageiro
│   ├── professor/         # Página do painel do professor/servidor
│   ├── cadastro/          # Fluxo de cadastro (aluno e professor)
│   ├── login/             # Autenticação
│   ├── perfil/            # Perfil do usuário
│   ├── minhas-viagens/    # Histórico de viagens
│   └── layout.tsx         # Layout global da aplicação
├── components/            # Componentes reutilizáveis por domínio
│   ├── admin/             # Componentes do painel admin
│   ├── auth/              # Componentes de autenticação
│   ├── landing/           # Componentes da página inicial
│   ├── motorista/         # Componentes do painel do motorista
│   ├── passageiro/        # Componentes do painel do passageiro
│   ├── shared/            # Componentes compartilhados entre perfis
│   └── ui/                # Componentes base (shadcn/ui)
├── features/              # Lógica de funcionalidades específicas
│   ├── fazer-checkin/
│   ├── gerenciar-frota/
│   ├── gerenciar-inscricao/
│   ├── iniciar-viagem/
│   ├── inscrever-convidado/
│   ├── inscrever-rota/
│   └── ajuda-emergencia/
├── entities/              # Entidades de domínio e seus componentes de UI
│   └── viagem/ui/         # Componentes visuais de viagem (TripCard, etc.)
├── services/              # Camada de comunicação com a API
│   ├── api.ts             # Instância global do Axios com interceptors
│   ├── authService.ts     # Chamadas de autenticação
│   └── adminService.ts    # Chamadas do painel administrativo
├── hooks/                 # Custom Hooks reutilizáveis
├── lib/                   # Utilitários e dados mock para desenvolvimento
├── public/                # Ativos estáticos (imagens, ícones)
└── middleware.ts           # Proteção e redirecionamento de rotas por perfil
```

### Como as camadas se comunicam

| Camada | Responsabilidade |
| :--- | :--- |
| `app/` | Define as rotas e páginas da aplicação. Compõe os componentes de cada domínio para montar as telas. |
| `components/` | Componentes de UI reutilizáveis, organizados por perfil de usuário ou domínio. Não contêm lógica de chamada à API. |
| `features/` | Encapsula a lógica de funcionalidades complexas (ex: fluxo de check-in), podendo combinar múltiplos componentes e serviços. |
| `entities/` | Representa entidades do domínio (ex: Viagem) e seus componentes de exibição. |
| `services/` | Responsável exclusivamente pelas chamadas HTTP ao backend. Abstrai o Axios dos demais módulos. |
| `hooks/` | Hooks customizados para lógica de estado e efeitos reutilizáveis entre componentes. |
| `middleware.ts` | Intercepta requisições de navegação e garante o controle de acesso baseado em perfil antes de renderizar qualquer página protegida. |

> **Regra de ouro:** `app/` → `features/` → `services/` → `API`. Componentes de UI não devem realizar chamadas diretas ao backend; essa responsabilidade pertence à camada de `services/`.

---

# 💈 Organização do Fluxo de Trabalho

O repositório segue a mesma estrutura de proteção de branches definida no projeto global. **É terminantemente proibido realizar commits diretos nas branches principais.**

Consulte o [README raiz do projeto](../README.md) para ver a arquitetura de branches, o padrão de commits (Conventional Commits) e o fluxo completo de Pull Requests.