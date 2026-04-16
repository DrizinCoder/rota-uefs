<h1 align="center">ROTA UEFS - BackEnd</h1>

<div align="center">

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)

> API RESTful desenvolvida para o sistema de gerenciamento de transporte institucional intermunicipal da Universidade Estadual de Feira de Santana (UEFS).

</div>

---
## 📑 Sumário

- [1. Sobre a Disciplina](#-sobre-a-disciplina)
- [2. O Projeto](#-o-projeto)
- [3. Tecnologias e Arquitetura](#️-tecnologias-e-arquitetura)
- [4. Principais Funcionalidades da API](#-principais-funcionalidades-da-api)
- [5. Organização do Fluxo de Trabalho](#-organização-do-fluxo-de-trabalho)
  - [5.1. Arquitetura de Branches](#-arquitetura-de-branches-ramificações)
  - [5.2. Padrão de Commits](#-padrão-de-commits-conventional-commits)
  - [5.3. Fluxo de Trabalho e Pull Requests](#-fluxo-de-trabalho-e-pull-requests-prs)
- [6. Guia Rápido de Git para a Equipe](#-guia-rápido-de-git-para-a-equipe)
  - [6.1. Fluxo de Trabalho](#-fluxo-de-trabalho-o-passo-a-passo)
  - [6.2 Dicionário de Comandos Git](#️-dicionário-de-comandos-git)
- [7. Primeiros Passos e Rodar Servidor Localmente](#-primeiros-passos-e-rodar-servidor-localmente)
- [8. Arquitetura do Projeto](#-arquitetura-do-projeto)
---

## 📚 Sobre a Disciplina

Este projeto é desenvolvido como requisito prático sob a metodologia **PBL (Problem-Based Learning - Aprendizagem Baseada em Problemas)**. A disciplina visa aplicar conceitos essenciais de Engenharia de Computação e de Software na concepção, modelagem e implementação de uma solução tecnológica para um problema real da comunidade acadêmica, abrangendo desde o levantamento de requisitos até o deploy e o gerenciamento ágil (Scrum/Kanban) da equipe de desenvolvimento.

---

## 🎯 O Projeto

O sistema **ROTA UEFS** surge da necessidade de otimizar a logística de deslocamento entre Feira de Santana e Salvador, atendendo Docentes, Servidores e Discentes.

A solução proposta substitui processos logísticos manuais por uma plataforma digital centralizada e automatizada. O sistema garante a prioridade de acesso aos servidores (assegurando assentos), gerencia filas de espera estruturadas para alunos, monitora a ocupação da frota em tempo real e agiliza a validação de check-in no momento do embarque por meio da leitura de QR Code.

---

## 🛠️ Tecnologias e Arquitetura

O backend foi estruturado seguindo rigorosos princípios de separação de responsabilidades (Frontend/Backend), com foco em alta performance, segurança, consistência de dados e qualidade de software:

- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) - Adotado pela sua alta velocidade de execução, geração automática de documentação interativa (Swagger UI) e validação nativa de dados estruturados via Pydantic.
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) - Utilizado para assegurar a consistência transacional (ACID) no sistema crítico de reservas e garantir a integridade nas listagens de auditoria.
- **Segurança:** Autenticação baseada na emissão de tokens JWT (armazenados via `HttpOnly Cookies`) e proteção de senhas com algoritmos de hashing modernos (BCrypt/Argon2).
- **Testes Automatizados:** [Cypress](https://www.cypress.io/) - Adotado para a execução de testes de ponta a ponta (E2E) e de integração, garantindo a confiabilidade dos fluxos críticos de negócio e a estabilidade da comunicação com a API.

---

## 📦 Principais Funcionalidades da API

A API expõe endpoints projetados para atender às regras de negócio de três perfis distintos (Passageiro, Motorista e Administrador), englobando:

1. **Gestão de Identidade (IAM):** Autenticação segura via JWT, fluxos de cadastro, recuperação de senhas e adequação estrita à LGPD (com rotinas de exclusão e anonimização de contas).
2. **Operações Administrativas:** CRUD completo para gerenciamento da frota de ônibus, motoristas parceiros e equipe administrativa.
3. **Logística e Escalas:** Criação de viagens, definição de quórum mínimo de viabilidade e acompanhamento operacional dos trajetos.
4. **Reserva e Fila de Espera:** Algoritmo transacional focado na alocação de vagas, garantindo a prioridade institucional e a realocação automática inteligente em filas de espera.
5. **Controle de Embarque:** Geração dinâmica e validação de código único/QR Code para efetivação do check-in no momento da viagem.
6. **Notificações & Cron Jobs:** Verificação automatizada de quórum (acionada em T-5 minutos) e disparo de alertas push de cancelamento ou confirmação de rota.
7. **Auditoria e Relatórios:** Geração consolidada de estatísticas de ociosidade e emissão automatizada do manifesto de embarque em formato PDF, exigido para a cobertura legal do seguro.
8. **Validação de Fluxos:** Garantia de qualidade das funcionalidades acima através de suítes de testes programadas no Cypress.

# 💈 Organização do Fluxo de Trabalho

O repositório será estruturado para proteger o código funcional e isolar o desenvolvimento de novas tarefas. **É terminantemente proibido realizar commits diretos nas branches principais.**

---

### 🌿 Arquitetura de Branches (Ramificações)
Para que o histórico do projeto seja legível e auditável pelo docente, a equipe utilizará a seguinte estrutura de ramificações:

1. **`main` (Produção):** Contém o código espelhado em produção (MVP final). Recebe atualizações apenas ao fim das Sprints.
2. **`develop` (Integração):** Branch central de trabalho. Todo código funcional e testado deve ser integrado aqui antes de ir para a produção.
3. **`feature/<nome-da-tarefa>`:** Branches temporárias para o desenvolvimento de novas funcionalidades.
    * *Exemplo:* `feature/tela-de-login`
4. **`bugfix/<nome-do-bug>`:** Branches temporárias para correção de erros identificados.
    * *Exemplo:* `bugfix/erro-banco-offline`



---

### 📝 Padrão de Commits (Conventional Commits)
As mensagens de commit devem seguir o padrão semântico (prefixo em inglês e descrição em português no imperativo) para garantir a rastreabilidade das alterações:

* **`feat:`** Quando adiciona uma nova funcionalidade.
    * *Exemplo:* `feat: cria endpoint de check-in de passageiros`
* **`fix:`** Quando corrige um bug.
    * *Exemplo:* `fix: corrige cálculo de limite de vagas para servidores`
* **`docs:`** Alterações apenas na documentação ou README.
    * *Exemplo:* `docs: adiciona modelo lógico ao readme`
* **`refactor:`** Quando o código é melhorado/reorganizado, sem alterar funcionalidade.
    * *Exemplo:* `refactor: otimiza query de listagem de viagens`
* **`chore:`** Atualizações de tarefas de build, configuração ou dependências.
    * *Exemplo:* `chore: atualiza versão do Next.js`

---

### 🔄 Fluxo de Trabalho e Pull Requests (PRs)
Para garantir a revisão de código (*Code Review*) e a integridade do sistema, a equipe seguirá o fluxo abaixo:

1. **Sincronização:** O desenvolvedor puxa a versão mais recente da branch `develop`.
2. **Criação:** Cria uma branch de trabalho específica (ex: `feature/rotina-cron-job`).
3. **Desenvolvimento:** Realiza as alterações e efetua os commits seguindo o padrão estabelecido.
4. **Integração:** Ao finalizar, abre um *Pull Request* (PR) apontando para a branch `develop`.
5. **Revisão:** O **Representante (Tech Lead)** do grupo (Front, Back ou Dados) revisa o código e, se aprovado, realiza o *merge* para a `develop`.

---

# 🚀 Guia Rápido de Git para a Equipe

Este guia contém os comandos essenciais e o fluxo de trabalho obrigatório para o desenvolvimento da Fase 2.

---

## 💡 Fluxo de Trabalho (O Passo a Passo)

### **Vai começar uma tarefa?**
1. `git checkout develop` — Garante que você está na branch de integração.
2. `git pull origin develop` — Baixa as últimas atualizações dos colegas.
3. `git checkout -b feature/minha-tarefa` — Cria sua branch de trabalho e entra nela.

### **Terminou a tarefa?**
1. `git add .` — Prepara todas as suas alterações.
2. `git commit -m "tipo: descrição"` — Salva localmente seguindo o **Padrão de Commits**.
3. `git push origin feature/minha-tarefa` — Sobe sua branch para o GitHub.
4. **No GitHub:** Clique no botão verde **"Compare & pull request"** para abrir a revisão.

---

## 🛠️ Dicionário de Comandos Git

### 1. Configuração e Início
| Comando | Descrição | Exemplo |
| :--- | :--- | :--- |
| **`git init`** | Inicializa um repositório local. | `git init` |
| **`git clone`** | Copia um repositório remoto para sua máquina. | `git clone https://link-do-repo.git` |

### 2. Ciclo de Alterações
| Comando | Descrição | Exemplo |
| :--- | :--- | :--- |
| **`git status`** | Mostra arquivos modificados ou não rastreados. | `git status` |
| **`git add`** | Adiciona arquivos à área de preparação (*staging*). | `git add .` |
| **`git commit`** | Registra as alterações no histórico. | `git commit -m "feat: login"` |
| **`git log`** | Exibe o histórico de commits realizados. | `git log --oneline` |

### 3. Ramificações (Branches)
| Comando | Descrição | Exemplo |
| :--- | :--- | :--- |
| **`git branch`** | Lista, cria ou exclui branches. | `git branch -a` |
| **`git checkout`** | Alterna entre branches existentes. | `git checkout develop` |
| **`git checkout -b`**| Cria uma nova branch e já entra nela. | `git checkout -b feature/xyz` |
| **`git merge`** | Une o histórico de uma branch à atual. | `git merge feature/login` |

### 4. Sincronização Remota
| Comando | Descrição | Exemplo |
| :--- | :--- | :--- |
| **`git remote add`**| Conecta seu PC ao servidor remoto (GitHub). | `git remote add origin URL` |
| **`git pull`** | Baixa e mescla atualizações (Download). | `git pull origin develop` |
| **`git push`** | Envia seus commits para o servidor (Upload). | `git push origin branch-x` |

### 5. Utilidades e Emergências
* **`git reset HEAD <arquivo>`**: Remove um arquivo da área de preparação sem perder as mudanças.
* **`git stash`**: "Esconde" suas mudanças atuais em uma gaveta temporária para limpar o diretório sem fazer commit.
* **`git stash pop`**: Recupera as mudanças que você guardou na gaveta.

---
> **Lembre-se:** Nunca faça commit diretamente na `main` ou `develop`. Use sempre branches de `feature`!

---
## 📋 Primeiros passos e Rodar Servidor localmente

### 1. Clonar repositório
```bash
git clone <link-do-repositorio> && cd rota-uefs-backend
```

### 2. Criar virtual environment
```bash
python3 -m venv .venv (ou python -m venv .venv)
```
Depois ativar ambiente com:
```bash
source .venv/bin/activate (Linux/Mac) ou .venv\Scripts\activate (Windows)

```
### 3. Instalar dependencias
Com o ambiente ativado você verá `(venv)` no terminal:
```bash
pip install -r requirements.txt
```

### 4. Rodar servidor
```bash
fastapi dev app/main.py --reload
```

### 5. Acessar documentação
```
http://localhost:8000/docs
```

---

## 🏛️ Arquitetura do Projeto

O backend segue uma arquitetura híbrida **MVC (sem View) + Repository Pattern**, garantindo separação clara de responsabilidades, testabilidade e manutenibilidade do código.

```
app/
├── core/              # Configurações (config.py, security.py)
├── database/          # Conexão e sessão (session.py, base_class.py)
├── models/            # Modelos do Banco (SQLAlchemy/Tortoise)
├── schemas/           # Validação Pydantic (UserCreate, UserRead)
├── repositories/      # Consultas ao banco (CRUD puro)
├── services/          # Regras de negócio (Validações, cálculos, chamadas externas)
├── routers/           # Endpoints → Controllers
├── utils/             # Helpers genéricos
└── main.py            # Ponto de entrada da aplicação
```

### Como as camadas se comunicam

| Camada | Padrão | Responsabilidade |
| :--- | :--- | :--- |
| `routers/` | **Controller (MVC)** | Recebe as requisições HTTP, delega para os Services e devolve a resposta. Não contém regra de negócio. |
| `services/` | **Service** | Orquestra as regras de negócio, validações e chamadas externas. É o coração da aplicação. |
| `repositories/` | **Repository Pattern** | Responsável exclusivamente pelas consultas ao banco de dados (CRUD puro). Abstrai o acesso aos dados dos demais. |
| `models/` | **Model (MVC)** | Define a estrutura das tabelas no banco via ORM (SQLAlchemy/Tortoise). |
| `schemas/` | — | Contratos de entrada e saída de dados via Pydantic. Garante validação automática nas requisições. |
| `core/` | — | Configurações globais da aplicação (variáveis de ambiente, segurança, JWT). |
| `database/` | — | Gerencia a conexão e o ciclo de vida das sessões com o banco de dados. |
| `utils/` | — | Funções auxiliares reutilizáveis sem acoplamento a nenhuma camada específica. |

> **Regra de ouro:** `routers` → `services` → `repositories` → `database`. Nenhuma camada deve pular uma etapa ou ter dependência invertida.

---