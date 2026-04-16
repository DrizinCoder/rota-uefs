UID := $(shell id -u)
GID := $(shell id -g)

# 🔥 Desenvolvimento (hot reload)
dev:
	UID=$(UID) GID=$(GID) docker compose up

# 🔁 Desenvolvimento com rebuild
dev-build:
	UID=$(UID) GID=$(GID) docker compose up --build

# 🚀 Produção (build otimizado)
prod:
	docker compose -f docker-compose.yml up --build

# 🛑 Parar containers
down:
	docker compose down

# 📜 Ver logs em tempo real
logs:
	docker compose logs -f

# 🧹 Limpeza completa (containers + volumes + cache leve)
clean:
	docker compose down -v
	docker system prune -f

# 🔄 Reiniciar ambiente dev
restart:
	make down
	make dev

# 🧱 Rebuild completo do zero (sem cache)
rebuild:
	docker compose build --no-cache