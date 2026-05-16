# C:\Users\Melody\Documents\haliberrycake\backend\app\core\config.py
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    app_name: str = "Haliberry Cake API"
    app_env: str = "development"
    debug: bool = False

    # Database
    database_url: str

    # Supabase
    supabase_url: str
    supabase_anon_key: str
    supabase_service_key: str

    # JWT
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # Admin seed
    admin_email: str
    admin_password: str

    # CORS
    frontend_url: str = "http://localhost:5173"
    production_url: str = "https://haliberrycake.co.uk"

    @property
    def cors_origins(self) -> list[str]:
        return [self.frontend_url, self.production_url]

    model_config = {"env_file": ".env", "extra": "ignore"}


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore


settings = get_settings()