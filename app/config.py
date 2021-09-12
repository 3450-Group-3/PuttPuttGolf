from pydantic import BaseSettings


class Config(BaseSettings):
    environment: str
    secret_key: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


config = Config()
