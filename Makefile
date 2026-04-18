UID := $(shell id -u)
GID := $(shell id -g)

.DEFAULT_GOAL := help

.PHONY: help
help: ## Mostra esta ajuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

dev: ## 🔥 Desenvolvimento (hot reload)
	UID=$(UID) GID=$(GID) docker-compose up

dev-build: ## 🔁 Desenvolvimento com rebuild
	UID=$(UID) GID=$(GID) docker-compose up --build

prod: ## 🚀 Produção (build otimizado)
	docker-compose -f docker-compose.yml up --build

down: ## 🛑 Parar containers
	docker-compose down

logs: ## 📜 Ver logs em tempo real
	docker-compose logs -f

clean: ## 🧹 Limpeza completa (containers + volumes + cache leve)
	docker-compose down -v
	docker system prune -f

restart: ## 🔄 Reiniciar ambiente dev
	make down
	make dev

rebuild: ## 🧱 Rebuild completo do zero (sem cache)
	docker-compose build --no-cache

init-db: ## 💾 Inicializa o banco de dados manualmente
	docker-compose exec backend python -m scripts.init_db

reset-db: ## 💣 Destrói o banco e recria tudo (cuidado!)
	make down
	docker volume rm postgres_data || true
	make dev-build