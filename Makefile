.PHONY: help backend frontend test lint format clean deploy

help:
	@echo "ProofHire Makefile"
	@echo ""
	@echo "Usage:"
	@echo "  make backend    - Run backend dev server"
	@echo "  make frontend   - Run frontend dev server"
	@echo "  make test       - Run all tests"
	@echo "  make lint       - Run linters"
	@echo "  make format     - Format code"
	@echo "  make clean      - Remove build artifacts"

backend:
	cd proofhire/backend && uvicorn proofhire.backend.app.main:app --reload

frontend:
	cd proofhire/frontend && npm run dev

test:
	cd proofhire/backend && pytest
	cd proofhire/frontend && npm test

lint:
	cd proofhire/backend && ruff check .
	cd proofhire/frontend && npm run lint

format:
	cd proofhire/backend && black .
	cd proofhire/frontend && npm run format

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type d -name node_modules -exec rm -rf {} +
	find . -type d -name .venv -exec rm -rf {} +
	find . -type d -name dist -exec rm -rf {} +
	find . -type d -name build -exec rm -rf {} +

deploy:
	@echo "Deploying ProofHire..."
	# Add deployment steps here
