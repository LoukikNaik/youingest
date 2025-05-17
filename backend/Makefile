.PHONY: build run stop logs clean status

# Build the Docker image
build:
	docker build -t youingest-backend .

# Run the container
run:
	@echo "Starting youingest-backend container..."
	@if docker ps -a --format '{{.Names}}' | grep -q "^youingest-backend$$"; then \
		echo "Container already exists. Stopping and removing it first..."; \
		make stop; \
	fi
	docker run --name youingest-backend \
		-p 8000:8000 \
		-v $(PWD)/transcripts:/app/transcripts \
		youingest-backend

# Stop the container
stop:
	@echo "Stopping youingest-backend container..."
	docker stop youingest-backend || true
	docker rm youingest-backend || true

# Show logs
logs:
	docker logs -f youingest-backend

# Check container status
status:
	@echo "Container status:"
	@docker ps -a --filter name=youingest-backend --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Clean up
clean: stop
	docker rmi youingest-backend || true