from pydantic import BaseSettings


class Config(BaseSettings):
    environment: str
    secret_key: str
    database_url: str = "sqlite:///./app.db"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


config = Config()
