from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    GROQ_API_KEY: str
    GOOGLE_CLIENT_ID: str
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )
    BREVO_API_KEY: str

    MAIL_FROM_EMAIL: str

    MAIL_FROM_NAME: str

    FRONTEND_URL: str


settings = Settings()