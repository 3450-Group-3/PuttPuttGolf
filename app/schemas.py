from typing import Optional
from pydantic import BaseModel


class UserIn(BaseModel):
    """Form data for creating a user"""

    username: str
    password: str


class User(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True


class UserInDB(User):
    hashed_password: str


class Token(BaseModel):
    access_token: str
    token_type: str