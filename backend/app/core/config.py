"""Application configuration settings using Pydantic Settings."""
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    PROJECT_NAME: str = "Career & Skill Intelligence Platform"
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "dev-secret-key-super-secure-career-intelligence-2026"

    # Database
    DATABASE_URL: str = "sqlite:///./career_intel.db"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # LLM Settings (Optional)
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    # Supabase (Optional)
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""


settings = Settings()
