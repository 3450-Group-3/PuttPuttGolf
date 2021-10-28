from typing import Optional
from pydantic import BaseModel
from datetime import date, datetime

from sqlalchemy.sql.sqltypes import String
from app.models import Drink, UserRole, DrinkOrderState

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


class UserInUpdate(InModel):
    username: str
    birthdate: datetime
    role: UserRole


class PasswordIn(InModel):
    curr_password: str
    new_password: str


class User(OutModel):
    id: int
    username: str
    birthdate: date
    role: UserRole
    balance: int

    class Config:
        orm_mode = True


class UserInDB(User):
    hashed_password: str


class DrinkOut(OutModel):
    id: int
    name: str
    price: float
    image_url: str
    description: str

    class Config:
        orm_mode = True


class DrinkIn(InModel):
    name: str
    price: float
    image_url: str
    description: str

class DrinkOrderOut(OutModel):
    id: int
    customer_id: int
    order_status: DrinkOrderState
    time_ordered: datetime
    total_price: float
    drinks: str
    location: str

    class Config:
        orm_mode = True

class DrinkOrderIn(InModel):
    customer_id: int
    order_status: DrinkOrderState
    time_ordered: datetime
    total_price: float
    drinks: str
    location: str

class DrinkOrderLocationUpdateIn(InModel):
    id: int
    location: str


class TournamentIn(InModel):
    date: datetime
    hole_count: int


class Tournament(OutModel):
    id: int
    date: datetime
    hole_count: int
    balance: float
    completed: bool
    advertising_banner: Optional[str]
    sponsored_by: Optional[User]
    created_by: User

    class Config:
        orm_mode = True
        arbitrary_types_allowed = True  # Why is this needed


class Score(OutModel):
    score: int
    user: User
    tournament: Tournament


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: User