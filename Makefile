deploy:
	docker-compose -f docker-compose.production.yml up -d --build
	