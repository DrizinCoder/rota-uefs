UID := $(shell id -u)
GID := $(shell id -g)

dev:
	UID=$(UID) GID=$(GID) docker compose up

dev-build:
	UID=$(UID) GID=$(GID) docker compose up --build

prod:
	docker compose -f docker-compose.yml up --build

down:
	docker compose down