.PHONY: up-db
up-db:
	export ENV_FILE="./dev.env/" && \
	docker compose up db