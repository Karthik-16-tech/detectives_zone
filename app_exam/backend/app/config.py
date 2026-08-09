from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Server configuration loaded from environment variables / backend/.env."""

    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    gemini_timeout_seconds: int = 45

    max_image_size_mb: int = 8
    rate_limit_per_minute: int = 30
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    sandbox_enabled: bool = False
    sandbox_mode: str = "subprocess"
    sandbox_timeout_seconds: int = 8
    sandbox_memory_mb: int = 256
    sandbox_cpu: float = 0.5

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
