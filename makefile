.PHONY: build-frontend build-backend build-nginx deploy

build-frontend:
	cd frontend && ./build-and-copy.sh

build-backend:
	docker-compose build pfeapplication

build-nginx:
	docker-compose build nginx

deploy: build-frontend build-backend build-nginx
	docker-compose up -d --remove-orphans
