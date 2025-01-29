PROJECT_NAME=back-app

DOCKER_COMPOSE_FILE_BASE=./.docker/docker-compose.base.yml
DOCKER_COMPOSE_FILE_DEV=./.docker/docker-compose.dev.yml
DOCKER_COMPOSE_FILE_PROD=./.docker/docker-compose.prod.yml

COMMAND=docker compose -f $(DOCKER_COMPOSE_FILE_BASE) -p $(PROJECT_NAME)

create-network:
	docker network inspect devops-network >/dev/null 2>&1 || docker network create devops-network

start-dev: create-network
	$(COMMAND) -f $(DOCKER_COMPOSE_FILE_DEV) up -d --build

start-prod: create-network
	$(COMMAND) -f $(DOCKER_COMPOSE_FILE_PROD) up -d --build 

restart: create-network
	$(COMMAND) restart

stop:
	$(COMMAND) stop

down:
	$(COMMAND) down

logs-dev: create-network
	docker logs -f back-app-dev

logs-prod: create-network
	docker logs -f back-app-prod

start-dev-logs: create-network
	$(MAKE) start-dev && $(MAKE) logs-dev

start-prod-logs: create-network
	$(MAKE) start-prod && $(MAKE) logs-prod
