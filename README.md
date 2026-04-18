## 🔐 Configuração de Ambiente

O projeto utiliza variáveis de ambiente distintas para o frontend e o backend. Certifique-se de criar os arquivos abaixo antes de rodar os containers:

- **Backend:** Crie o arquivo `.env` dentro da pasta `/backend`.
- **Frontend:** Crie o arquivo `.env.local` dentro da pasta `/frontend`.

> **Regra de Ouro:** Sempre que uma nova chave for adicionada aos arquivos `.env` ou `.env.local`, ela **deve** ser replicada no respectivo arquivo `.env.example`. Isso garante que todos saibam quais variáveis são obrigatórias para o funcionamento do sistema.

---

## 🛠️ Uso do Makefile

Certifique-se de ter o **Docker** e o **Docker Compose** instalados em sua máquina.

### Comandos do Makefile

Para facilitar o dia a dia, utilizamos um `Makefile`. Abaixo estão os comandos disponíveis:

| Comando | Descrição |
| :--- | :--- |
| `make up` | Sobe o sistema em modo interativo |
| `make up-detach` | Sobe o sistema em segundo plano |
| `make down` | Para e remove os containers |
| `make logs` | Exibe os logs de todos os serviços |
| `make init-db` | Executa o script de inicialização do banco |
| `make rebuild` | Reconstrói as imagens ignorando o cache |
| `make clean` | Remove containers e volumes (limpeza total) |

> **Nota:** Se você utiliza uma versão legada do docker-compose, use a flag `LGY=1` (ex: `make up LGY=1`).

> **Nota 2** Para visualizar os outros comando do Makefile com descrição use **`make help`**.
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

## 👷🏻 Em Construção...

Este README será atualizado futuramente para servir como a documentação oficial do projeto, especificando os padrões de arquitetura, padrões de projeto (Design Patterns) e guias de contribuição.

