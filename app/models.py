import enum
import json

from typing import Optional, Union
from sqlalchemy import Column, ForeignKey
from sqlalchemy import types
from sqlalchemy.orm import Session, relationship
from functools import cache, cached_property

from .db import Base


class UserRole(enum.Enum):
    PLAYER = 1
    """
    Permissions:
    - Enter a tournament
    - Purchase Drinks
    - Look at their account information
    - Add to their Account Balance
    """
    DRINK_MEISTER = 2
    """
    Permissions:
    - All player Permissions
    - Look at the Drink Queue
    - Accept a drink order
    - Fufill that drink order
    """
    SPONSOR = 3
    """
    Permissions:
    - All player Permissions
    - Sponsor a Tournament
    """
    MANAGER = 4
    """
    Permissions:
    - All User permissions
    - Edit other user's information
    - Force reset their password
    """


class User(Base):  # type: ignore
    __tablename__ = "users"

    id = Column(types.Integer, primary_key=True, index=True, nullable=False)
    username = Column(types.String(50), unique=True, index=True)
    hashed_password = Column(types.String)
    birthdate = Column(types.Date, nullable=False)
    role = Column(types.Enum(UserRole), nullable=False)
    balance = Column(types.Float, default=0.0, nullable=False)
    """Represents their current monetary balance which
    can be used to purchase drinks or sponsor events"""

    enrollments: list["TournamentEnrollment"] = relationship(
        "TournamentEnrollment", back_populates="user"
    )
    created_tournaments: "Tournament" = relationship(
        "Tournament", back_populates="created_by", cascade="all, delete, delete-orphan"
    )
    # sponsored_tournaments = relationship(
    #     "Tournament",
    #     back_populates="sponsored_by",
    #     foreign_keys=["tournaments.sponsored_by_id"],
    # )

    @property
    def tournaments(self):
        for enrollment in self.enrollments:
            yield enrollment.tournament

    def has_role(self, role: UserRole) -> bool:
        return self.role == role

    @property
    def is_manager(self):
        return self.has_role(UserRole.MANAGER)

    @property
    def is_drink_meister(self):
        return self.has_role(UserRole.DRINK_MEISTER) 

    @property
    def is_sponsor(self):
        return self.has_role(UserRole.SPONSOR)

    @property
    def is_player(self):
        return self.has_role(UserRole.PLAYER) 

    def update_balance(self, value: float, db: Session):
        assert isinstance(value, (float, int))
        self.balance = value
        db.add(self)


class Drink(Base):
    __tablename__ = "drinks"

    id = Column(types.Integer, primary_key=True, nullable=False, index=True)
    name = Column(types.String, nullable=False, index=True)
    price = Column(types.FLOAT, nullable=False)
    image_url = Column(types.String)
    description = Column(types.String)
    
    @staticmethod
    def add_drink(
        db: Session,
        name: str,
        price: float,
        description: str = "",
        image_url: str = "",
    ) -> "Drink":
        drink = Drink(
            name = name,
            price = price, 
            description = description, 
            image_url = image_url
        )

        db.add(drink)
        db.commit()
        db.refresh(drink)
        return drink

    @staticmethod
    def remove_drink(db: Session, id: int = 0, name: str = "") -> None:
        """
        Removes a drink from the database. Pass in the db and either the drink id
        or pass in 0 for the id and the drink name to remove it
        """
        if id > 0:
            db.query(Drink).filter_by(id=id).delete()
        else:
            db.query(Drink).filter_by(name=name).delete()

        db.commit()

    @staticmethod
    def update_drink(
        db: Session,
        name: str,
        price: float,
        image_url: str,
        description: str
    ) -> "Drink":
        drink = db.query(Drink).where(Drink.name == name).first()

        drink.price = price
        drink.image_url = image_url
        drink.description = description

        db.commit()
        db.refresh(drink)

        return drink


class DrinkOrderState(enum.Enum):
    OPEN = 1
    """
    Order has not been accepted by any meister
    """
    INPROGRESS = 2
    """
    Order has been claimed by a meister and is being made
    """
    ENROUTE = 3
    """
    Order has been made by the meister and is being delivered
    """
    DELIVERED = 4
    """
    Order has been delivered to the customer
    """

class DrinkOrder(Base):
    __tablename__ = "orders"

    id = Column(types.Integer, primary_key=True, nullable=False, index=True)
    customer_id = Column(types.Integer, nullable=False, index=True)
    order_status = Column(types.Enum(DrinkOrderState), nullable=False, index=True)
    time_ordered = Column(types.DateTime, nullable=False, index=True)
    total_price = Column(types.Float, nullable=False)
    drinks_json = Column(types.String, nullable=False)
    location_json = Column(types.String, nullable=True)
    drink_meister_id = Column(types.Integer, nullable=True)
    
    @property
    @cache
    def location(self):
        return json.loads(self.location_json)
    """
    serialized json.
    {
        "lattitude" : "value",
        "longitude" : "value"
    }
    """
    @location.setter
    def location(self):
        self.location_json = json.dumps(self.location)


    @property
    @cache
    def drinks(self):
        return json.loads(self.drinks_json)
    """
    serialized json. 
    { 
        "drinkId1" : "quantity", 
        "drinkId2": "quantity" 
    }
    """
    @drinks.setter
    def drinks(self):
        self.drinks_json = json.dumps(self.drinks)


class Tournament(Base):  # type: ignore
    __tablename__ = "tournaments"

    id = Column(types.Integer, primary_key=True, index=True, nullable=False)
    date = Column(types.DateTime, index=True, nullable=False)
    completed = Column(types.Boolean, default=False)
    advertising_banner = Column(types.String)
    balance = Column(types.Float, default=0.0, nullable=False)
    hole_count = Column(types.Integer, nullable=False)

    created_by_id = Column(types.Integer, ForeignKey("users.id"), nullable=False)
    created_by = relationship("User", back_populates="created_tournaments")

    # sponsored_by_id = Column(types.Integer, ForeignKey("users.id"))
    # sponsored_by = relationship("User", back_populates="sponsored_tournaments")

    enrollments = relationship(
        "TournamentEnrollment",
        back_populates="tournament",
        cascade="all, delete, delete-orphan",
    )

    @property
    def _is_sponsored(self):
        return self.sponsored_by is not None

    @property
    def players(self):
        for enrollment in self.enrollments:
            yield enrollment.user

    def add_user(self, db: Session, user: User) -> "TournamentEnrollment":
        # Add user to scores / handle nonexistant id
        enrollment = TournamentEnrollment(tournament=self, user=user, score=0)
        db.add(enrollment)
        db.commit()
        db.refresh(enrollment)
        return enrollment

    def remove_user(self, db: Session, user: User) -> None:
        # Remove user from score / handle nonexistant id
        db.delete(
            db.query(TournamentEnrollment).filter_by(user=user, tournament=self).first()
        )
        db.commit()
        db.refresh(self)
        db.refresh(user)

    def update_balance(self, increment: float) -> None:
        self.balance += increment  # type: ignore

    def formatted_date(self) -> str:
        return self.date.strftime("%m/%d/%Y, %-I:%M/ %p")

    def increment_score(self, db: Session, user: User, increment: int) -> int:
        # Increment a user's score for this tournament
        assert not self.completed
        enrollment: Optional[TournamentEnrollment] = (
            db.query(TournamentEnrollment).filter_by(user=user, tournament=self).first()
        )
        if enrollment:
            enrollment.score += increment
            db.commit()
            return enrollment.score
        else:
            raise ValueError(f"User {user.id} is not enrolled in tournament {self.id}")

    def complete_tournament(self) -> None:  # TODO
        pass

    def _distribute_winnings(self) -> None:  # TODO
        pass

    def _finalize_scores(self) -> None:  # TODO
        pass


class TournamentEnrollment(Base):
    __tablename__ = "tournament_enrollments"

    tournament_id: int = Column(
        ForeignKey("tournaments.id"), primary_key=True, nullable=False
    )
    user_id: int = Column(ForeignKey("users.id"), primary_key=True, nullable=False)
    score = Column(types.Integer, index=True, nullable=False)

    user: User = relationship(User, back_populates="enrollments")
    tournament: Tournament = relationship(Tournament, back_populates="enrollments")
