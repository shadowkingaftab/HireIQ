import pytest

from proofhire.backend.app.core.config import Settings


def test_settings_defaults():
    settings = Settings()
    assert settings.PROJECT_NAME == "ProofHire"
    assert settings.API_V1_STR == "/api/v1"


def test_settings_db_url_assembly():
    settings = Settings(POSTGRES_USER="user", POSTGRES_PASSWORD="pass", POSTGRES_SERVER="localhost", POSTGRES_DB="db")
    assert settings.DATABASE_URL == "postgresql://user:pass@localhost/db"
