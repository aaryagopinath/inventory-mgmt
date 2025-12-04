# app/config.py
from pydantic import BaseSettings

class Settings(BaseSettings):
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_EMAIL: str
    SMTP_PASSWORD: str

    class Config:
        env_file = ".env"

settings = Settings()
