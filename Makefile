.PHONY: up-db
up-db:
	export ENV_FILE="./src/db/db.dev.env/"
	docker compose up db