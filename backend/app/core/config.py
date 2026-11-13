from typing import List, Optional

from pydantic import AnyHttpUrl, ValidationInfo, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "ORIONET"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "development_secret_key_change_me"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "proofhire"
    DATABASE_URL: str = ""
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_URL: Optional[str] = None
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    STRIPE_API_KEY: Optional[str] = None
    S3_BUCKET: Optional[str] = None
    S3_ENDPOINT_URL: Optional[str] = None
    S3_ACCESS_KEY: Optional[str] = None
    S3_SECRET_KEY: Optional[str] = None

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str], info: ValidationInfo) -> str:
        if isinstance(v, str) and v.strip():
            # Render supplies PostgreSQL URLs without SQLAlchemy's driver suffix.
            # This project installs psycopg 3, so select it explicitly.
            if v.startswith("postgres://"):
                return "postgresql+psycopg://" + v.removeprefix("postgres://")
            if v.startswith("postgresql://"):
                return "postgresql+psycopg://" + v.removeprefix("postgresql://")
            return v
        return (
            f"postgresql+psycopg://{info.data.get('POSTGRES_USER')}:{info.data.get('POSTGRES_PASSWORD')}"
            f"@{info.data.get('POSTGRES_SERVER')}/{info.data.get('POSTGRES_DB')}"
        )

    @field_validator("REDIS_URL", mode="before")
    @classmethod
    def assemble_redis_connection(cls, v: Optional[str], info: ValidationInfo) -> str:
        if isinstance(v, str):
            return v
        return f"redis://{info.data.get('REDIS_HOST')}:{info.data.get('REDIS_PORT')}/0"

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env")


settings = Settings()
