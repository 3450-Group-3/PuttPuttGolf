from __future__ import annotations
from typing import Optional, List
from pydantic import BaseModel
from datetime import date, datetime
from app.utils import to_camel, DrinkOrderState, UserRole


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


class TournamentEnrollment(OutModel):
    score: int
    tournament_id: int
    user_id: int
    current_hole: int

    class Config:
        orm_mode = True


class TournamentEnrollmentUser(OutModel):
    score: int
    user: User
    current_hole: int

    class Config:
        orm_mode = True


class TournamentEnrollmentIn(InModel):
    score: int
    tournament_id: int
    user_id: int


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
    enrollments: list[TournamentEnrollment]

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


class UserLocation(BaseModel):
    lattitude: float
    longitude: float


class DrinkOrderQuantity(BaseModel):
    drinkId: int
    quantity: int


class DrinkOrderOut(OutModel):
    id: int
    customer_id: int
    customer_name: str
    order_status: DrinkOrderState
    time_ordered: datetime
    total_price: float
    drinks: list[DrinkOrderQuantity]
    location: UserLocation
    drink_meister_id: int

    class Config:
        orm_mode = True


class DrinkOrderIn(InModel):
    drinks: list[DrinkOrderQuantity]
    location: UserLocation


class DrinkOrderStatusUpdateIn(InModel):
    id: int
    order_status: DrinkOrderState


class TournamentIn(InModel):
    date: datetime
    hole_count: int


class WinningDistribution(InModel):
    first: float
    second: float
    third: float


class TournamentUpdate(InModel):
    date: datetime
    hole_count: int
    completed: bool

    advertising_banner: Optional[str]
    balance: float


class SponsorTournament(InModel):
    advertising_banner: Optional[str]
    balance_diff: float
    winning_distributions: WinningDistribution


class Tournament(OutModel):
    id: int
    date: datetime
    hole_count: int
    balance: float
    completed: bool
    advertising_banner: Optional[str]
    sponsored_by: Optional[User]
    created_by: User
    enrollments: list[TournamentEnrollmentUser]
    winning_distributions: WinningDistribution

    class Config:
        orm_mode = True
        arbitrary_types_allowed = True  # Why is this needed


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: User


class AddOrRemoveUser(InModel):
    user_id: int


class IncrementScore(InModel):
    score: int
    user_id: int


class BalanceUpdate(BaseModel):
    balance: float


TournamentEnrollment.update_forward_refs()
TournamentEnrollmentUser.update_forward_refs()
