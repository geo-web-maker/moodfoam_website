from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    secret_key: str = "dev-only-secret-change-me"
    admin_username: str = "admin"
    admin_password: str = "admin123"
    cors_origins: str = "http://localhost:5173,http://localhost:4173"
    whatsapp_number: str = "256743053096"
    access_token_expire_minutes: int = 60 * 12  # 12 hours

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
