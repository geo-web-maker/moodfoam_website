from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    secret_key: str
    admin_username: str
    admin_password: str
    cors_origins: str = "http://localhost:5173,http://localhost:4173"
    whatsapp_number: str = "256743053096"
    access_token_expire_minutes: int = 60 * 12  # 12 hours
    mongodb_uri: str = "mongodb://localhost:27017"
    r2_bucket_name: str = "moodfoam-images"
    mongodb_db_name: str = "moodfoamdb"
    r2_account_id: str = ""
    r2_access_key_id: str = ""
    r2_secret_access_key: str = ""
    r2_public_url: str = ""
    debug: bool = False
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
