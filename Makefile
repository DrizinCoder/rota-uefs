.DEFAULT_GOAL := help

DOCKER_COMPOSE := docker compose

.PHONY: help
help: ## 📖 Mostra esta ajuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'

# =========================
# 🚀 UP / DOWN
# =========================

up: ## 🚀 Sobe o sistema
	$(DOCKER_COMPOSE) up

up-build: ## 🧱 Sobe com build
	$(DOCKER_COMPOSE) up --build

up-detach: ## 🧩 Sobe em background
	$(DOCKER_COMPOSE) up -d

down: ## 🛑 Para tudo
	$(DOCKER_COMPOSE) down

restart: ## 🔄 Reinicia tudo
	$(DOCKER_COMPOSE) down && $(DOCKER_COMPOSE) up

# =========================
# 📜 LOGS
# =========================

logs: ## 📜 Logs geral
	$(DOCKER_COMPOSE) logs -f

logs-backend: ## 📜 Logs backend
	$(DOCKER_COMPOSE) logs -f backend

logs-frontend: ## 📜 Logs frontend
	$(DOCKER_COMPOSE) logs -f frontend

logs-db: ## 📜 Logs banco
	$(DOCKER_COMPOSE) logs -f db

# =========================
# 🧱 BUILD
# =========================

build: ## 🧱 Build geral
	$(DOCKER_COMPOSE) build

rebuild: ## 🧱 Rebuild sem cache
	$(DOCKER_COMPOSE) build --no-cache

# =========================
# 🧹 LIMPEZA
# =========================

clean: ## 🧹 Remove containers e volumes do projeto
	$(DOCKER_COMPOSE) down -v --remove-orphans

prune: ## ⚠️ Limpeza pesada global (CUIDADO)
	docker system prune -af --volumes