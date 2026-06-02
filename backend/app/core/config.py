# C:\Users\Melody\Documents\haliberrycake\backend\app\core\config.py
from pydantic_settings import BaseSettings
from pydantic import field_validator
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    app_name: str = "Haliberry Cake API"
    app_env: str = "development"
    debug: bool = False

    database_url: str
    secret_key: str

    supabase_url: Optional[str] = None
    supabase_anon_key: Optional[str] = None
    supabase_service_key: Optional[str] = None

    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    admin_email: str = "admin@haliberrycake.co.uk"
    admin_password: str = "changeme"

    frontend_url: str = "http://localhost:5173"
    production_url: str = "https://haliberrycake.co.uk"

    @property
    def cors_origins(self) -> list[str]:
        origins = {
            "http://localhost:5173",
            "http://localhost:3000",
            "https://haliberrycake.vercel.app",
            "https://haliberrycake.co.uk",
            self.frontend_url.rstrip("/"),
            self.production_url.rstrip("/"),
        }
        return list(origins)

    @field_validator("database_url")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        if not v:
            raise ValueError("DATABASE_URL is required")
        if v.startswith("postgres://"):
            v = v.replace("postgres://", "postgresql://", 1)
        return v

    model_config = {"env_file": ".env", "extra": "ignore"}


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore


settings = get_settings()

# # C:\Users\Melody\Documents\haliberrycake\backend\app\core\config.py
# from pydantic_settings import BaseSettings
# from pydantic import field_validator
# from functools import lru_cache
# from typing import Optional


# class Settings(BaseSettings):
#     app_name: str = "Haliberry Cake API"
#     app_env: str = "development"
#     debug: bool = False

#     database_url: str

#     supabase_url: Optional[str] = None
#     supabase_anon_key: Optional[str] = None
#     supabase_service_key: Optional[str] = None

#     secret_key: str
#     algorithm: str = "HS256"
#     access_token_expire_minutes: int = 60

#     admin_email: str = "admin@haliberrycake.co.uk"
#     admin_password: str = "changeme"

#     # Single string only — NOT a tuple
#     frontend_url: str = "http://localhost:5173"
#     production_url: str = "https://haliberrycake.co.uk"

#     @property
#     def cors_origins(self) -> list[str]:
#         # Hardcode all known origins — always safe to include extras
#         return list(set([
#             "http://localhost:5173",
#             "http://localhost:3000",
#             "https://haliberrycake.vercel.app",
#             "https://haliberrycake.co.uk",
#             self.frontend_url,
#             self.production_url,
#         ]))

#     @field_validator("database_url")
#     @classmethod
#     def validate_database_url(cls, v: str) -> str:
#         if not v or not v.startswith(("postgresql", "postgres")):
#             raise ValueError("DATABASE_URL must be a valid PostgreSQL connection string.")
#         if v.startswith("postgres://"):
#             v = v.replace("postgres://", "postgresql://", 1)
#         return v

#     model_config = {"env_file": ".env", "extra": "ignore"}


# @lru_cache
# def get_settings() -> Settings:
#     return Settings()  # type: ignore


# settings = get_settings()



# # C:\Users\Melody\Documents\haliberrycake\backend\app\core\config.py
# from pydantic_settings import BaseSettings
# from pydantic import field_validator
# from functools import lru_cache
# from typing import Optional


# class Settings(BaseSettings):
#     # App
#     app_name: str = "Haliberry Cake API"
#     app_env: str = "development"
#     debug: bool = False

#     # Database — REQUIRED, app cannot start without this
#     database_url: str

#     # Supabase — optional at startup; only needed when uploading images
#     # If not set the app still starts; storage.py handles the missing values
#     supabase_url: Optional[str] = None
#     supabase_anon_key: Optional[str] = None
#     supabase_service_key: Optional[str] = None

#     # JWT
#     secret_key: str
#     algorithm: str = "HS256"
#     access_token_expire_minutes: int = 60

#     # Admin seed credentials
#     admin_email: str = "admin@haliberrycake.co.uk"
#     admin_password: str = "changeme"

#     # CORS
#     frontend_url: str = "https://haliberrycake.vercel.app"
#     production_url: str = "https://haliberrycake.co.uk"

#     @property
#     def cors_origins(self) -> list[str]:
#         origins = [self.frontend_url, self.production_url]
#         # Always allow localhost in development
#         if self.app_env != "production":
#             origins += ["http://localhost:3000", "http://localhost:5173", "https://haliberrycake.vercel.app"]
#         return list(set(origins))

#     @field_validator("database_url")
#     @classmethod
#     def validate_database_url(cls, v: str) -> str:
#         if not v or not v.startswith(("postgresql", "postgres")):
#             raise ValueError(
#                 "DATABASE_URL must be a valid PostgreSQL connection string "
#                 "starting with 'postgresql://' or 'postgres://'"
#             )
#         # Render/Supabase sometimes give 'postgres://' — SQLAlchemy needs 'postgresql://'
#         if v.startswith("postgres://"):
#             v = v.replace("postgres://", "postgresql://", 1)
#         return v

#     model_config = {"env_file": ".env", "extra": "ignore"}


# @lru_cache
# def get_settings() -> Settings:
#     return Settings()  # type: ignore


# settings = get_settings()

# # C:\Users\Melody\Documents\haliberrycake\backend\app\core\config.py
# from pydantic_settings import BaseSettings
# from functools import lru_cache


# class Settings(BaseSettings):
#     # App
#     app_name: str = "Haliberry Cake API"
#     app_env: str = "development"
#     debug: bool = False

#     # Database
#     database_url: str

#     # Supabase
#     supabase_url: str
#     supabase_anon_key: str
#     supabase_service_key: str

#     # JWT
#     secret_key: str
#     algorithm: str = "HS256"
#     access_token_expire_minutes: int = 60

#     # Admin seed
#     admin_email: str
#     admin_password: str

#     # CORS
#     frontend_url: str = "http://localhost:5173"
#     production_url: str = "https://haliberrycake.co.uk"

#     @property
#     def cors_origins(self) -> list[str]:
#         return [self.frontend_url, self.production_url]

#     model_config = {"env_file": ".env", "extra": "ignore"}


# @lru_cache
# def get_settings() -> Settings:
#     return Settings()  # type: ignore


# settings = get_settings()