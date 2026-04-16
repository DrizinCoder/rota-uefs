## 🔐 Configuração de Ambiente

O projeto utiliza variáveis de ambiente distintas para o frontend e o backend. Certifique-se de criar os arquivos abaixo antes de rodar os containers:

- **Backend:** Crie o arquivo `.env` dentro da pasta `/backend`.
- **Frontend:** Crie o arquivo `.env.local` dentro da pasta `/frontend`.

> **Regra de Ouro:** Sempre que uma nova chave for adicionada aos arquivos `.env` ou `.env.local`, ela **deve** ser replicada no respectivo arquivo `.env.example`. Isso garante que todos saibam quais variáveis são obrigatórias para o funcionamento do sistema.

---

## 🛠️ Uso do Makefile

Para simplificar o fluxo de desenvolvimento e execução do projeto, utilizamos um `Makefile` com comandos prontos para **ambiente de desenvolvimento** e **produção**.

---

### 🔥 Desenvolvimento (Hot Reload)

```bash
make dev
```

- Inicia todos os serviços com suporte a **hot reload**
- Frontend roda com `npm run dev`
- Backend roda com `uvicorn --reload`
- Alterações no código são refletidas automaticamente

#### 🔁 Rebuild no desenvolvimento

```bash
make dev-build
```

- Recria as imagens Docker antes de subir os containers
- Útil quando há mudanças em dependências ou Dockerfiles

---

### 🚀 Produção (Build Otimizado)

```bash
make prod
```

- Executa o build completo das aplicações
- Frontend roda com `npm run build` + `npm start`
- Sem uso de volumes (ambiente mais estável)
- Ideal para deploy

---

### 🧰 Comandos auxiliares

#### 🛑 Parar containers

```bash
make down
```

---

#### 📜 Ver logs em tempo real

```bash
make logs
```

---

#### 🧹 Limpeza completa

```bash
make clean
```

- Remove containers e volumes
- Limpa recursos não utilizados do Docker

---

#### 🔄 Reiniciar ambiente de desenvolvimento

```bash
make restart
```

- Executa `make down` seguido de `make dev`
- Útil para reiniciar rapidamente todo o ambiente

---

#### 🧱 Rebuild completo (sem cache)

```bash
make rebuild
```

- Reconstrói todas as imagens do zero
- Ignora cache do Docker
- Útil para resolver problemas persistentes de build

---

## 👷🏻 Em Construção...

Este README será atualizado futuramente para servir como a documentação oficial do projeto, especificando os padrões de arquitetura, padrões de projeto (Design Patterns) e guias de contribuição.
