from typing import Optional
from pydantic import BaseModel
from datetime import date, datetime
from app.models import UserRole

from app.utils import to_camel


class InModel(BaseModel):
    """Accepts camelCase paramaters, and creates snake_case equivalents
    this way, the frontend can send their data in camelCase and we can read
    it as snake_case. Allowing both JS and Python language conventions
    """

    class Config:
        alias_generator = to_camel


class OutModel(BaseModel):
    """Excepts snake_case paramaters, and outputs camelCase equivelants
    this way, the backend can send their data in snake_case and the frontend
    can read it as camelCase. Allowing both JS and Python language conventions
    """

    def dict(self, **kwargs):
        return {to_camel(key): value for key, value in super().dict(**kwargs).items()}


class UserIn(InModel):
    """Form data for creating a user"""

    username: str
    password: str
    birthdate: datetime


class User(OutModel):
    id: int
    username: str
    birthdate: date
    role: UserRole

    class Config:
        orm_mode = True


class UserInDB(User):
    hashed_password: str


class Token(BaseModel):
    access_token: str
    token_type: str



class Drink(BaseModel):
    name: str
    price: float
    image_url: str
    description: str

    class Config:
        orm_mode = True

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

class Score:
    score: int
    user: User
    tournament: Tournament