.DEFAULT_GOAL := help

# padrão moderno
DOCKER_COMPOSE_MODERN := docker compose
DOCKER_COMPOSE_LEGACY := docker-compose

# escolha via flag
ifeq ($(LGY),1)
DOCKER_COMPOSE := $(DOCKER_COMPOSE_LEGACY)
else
DOCKER_COMPOSE := $(DOCKER_COMPOSE_MODERN)
endif

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

init-db: ## 💾 Inicializa o banco de dados manualmente
	$(DOCKER_COMPOSE) exec backend python -m scripts.init_db

reset-db: ## 💣 Destrói o banco e recria tudo (cuidado!)
	make down
	docker volume rm postgres_data || true
	make dev-build

# =========================
# 🧹 Migration
# =========================

migrate: ## Atualiza Head do alembic (Aplica migrations)
	$(DOCKER_COMPOSE) run --rm backend alembic upgrade head

revision: ## Cria migration - Coloque mensagem personalizada com msg="<Exemplo>"
	$(DOCKER_COMPOSE) run --rm backend alembic revision --autogenerate -m "$(msg)"

# =========================
# 🧪 TESTES (LOCAL VENV)
# =========================

test: ## 🧪 Roda os testes usando o .venv local
	python3 -m pytest

test-v: ## 🧪 Testes com verbose e prints (-s)
	python3 -m pytest -v -s

test-cov: ## 📊 Testes com relatório de cobertura
	python3 -m pytest --cov=app --cov-report=term-missing

test-failed: ## ⚡ Roda apenas os que falharam por último
	python3 -m pytest --lf

# =========================
# 📜 SCRIPTS
# =========================

seed: ## 📝 Popula o banco de dados dentro do container
	docker cp backend/scripts/populate.py rota_uefs-backend-1:/app/scripts/populate.py
	docker exec -it rota_uefs-backend-1 env PYTHONPATH=. python scripts/populate.py