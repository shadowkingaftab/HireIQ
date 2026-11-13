from backend.app.core.config import Settings


def test_settings_defaults():
    settings = Settings(_env_file=None)
    assert settings.PROJECT_NAME == "ORIONET"
    assert settings.API_V1_STR == "/api/v1"


def test_settings_db_url_assembly():
    settings = Settings(
        _env_file=None,
        POSTGRES_USER="user",
        POSTGRES_PASSWORD="pass",
        POSTGRES_SERVER="localhost",
        POSTGRES_DB="db",
    )
    assert settings.DATABASE_URL == "postgresql+psycopg://user:pass@localhost/db"


def test_database_url_uses_psycopg_for_provider_urls():
    for url in (
        "postgres://user:pass@localhost/db",
        "postgresql://user:pass@localhost/db",
    ):
        settings = Settings(_env_file=None, DATABASE_URL=url)
        assert settings.DATABASE_URL == "postgresql+psycopg://user:pass@localhost/db"

