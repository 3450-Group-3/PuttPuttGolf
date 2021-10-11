from typing import Optional
from pydantic import BaseModel
from datetime import datetime


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


class Tournament:
    created_by: User
    sponsored_by: Optional[User]
    date = datetime
    completed = bool
    advertising_banner = Optional[str]
    balance = float
    hole_count = int

    class Config:
        orm_mode = True