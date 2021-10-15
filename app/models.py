import enum

from typing import Union
from sqlalchemy import Column, ForeignKey
from sqlalchemy import types
from sqlalchemy.orm import Session, relationship

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

    tournaments = relationship("Score", back_populates="user")

    def has_role(self, role: UserRole):
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


class Tournament(Base):  # type: ignore
    __tablename__ = "tournaments"

    id = Column(types.Integer, primary_key=True, index=True, nullable=False)
    created_by_id = Column(types.Integer, ForeignKey("users.id"), nullable=False)
    sponsored_by_id = Column(types.Integer, ForeignKey("users.id"))
    date = Column(types.DateTime, index=True, nullable=False)
    completed = Column(types.Boolean, default=False)
    advertising_banner = Column(types.String)
    balance = Column(types.Float, default=0.0, nullable=False)
    hole_count = Column(types.Integer, nullable=False)

    players = relationship("Score", back_populates="tournament")

    @property
    def _is_sponsored(self):
        return self.sponsored_by is not None

    def add_user(self, db: Session, user: User) -> None:
        # Add user to scores / handle nonexistant id
        self.players.append(user)
        db.commit()
        db.refresh(self)

    def remove_user(self, db: Session, user: User) -> None:
        # Remove user from score / handle nonexistant id
        self.players.remove(user)
        db.commit()
        db.refresh(self)

    def update_balance(self, increment: float) -> None:
        self.balance += increment  # type: ignore

    def formatted_date(self) -> str:
        return self.date.strftime("%m/%d/%Y, %-I:%M/ %p")

    def increment_score(self, user: Union[User, int], increment: int) -> int:
        # Increment a user's score for this tournament
        self.user.score += increment

    def complete_tournament(self) -> None:  # TODO
        pass

    def _distribute_winnings(self) -> None:  # TODO
        pass

    def _finalize_scores(self) -> None:  # TODO
        pass


class Score(Base):
    __tablename__ = "scores"

    tournament_id: int = Column(
        ForeignKey("tournaments.id"), primary_key=True, nullable=False
    )
    user_id: int = Column(ForeignKey("users.id"), primary_key=True, nullable=False)
    score = Column(types.Integer, index=True, nullable=False)

    user: User = relationship(User, back_populates="tournaments")
    tournament: Tournament = relationship(Tournament, back_populates="players")


class Drink(Base):
    __tablename__ = "drinks"

    id = Column(types.Integer, primary_key=True, nullable=False, index=True)
    name = Column(types.String, nullable=False, index=True)
    price = Column(types.FLOAT, nullable=False)
    image_url = Column(types.String)
    description = Column(types.String)

    def add_drink(
        self,
        db: Session,
        name: str,
        price: float,
        description: str = "",
        image_url: str = "",
    ) -> "Drink":
        drink = Drink(
            name=name, price=price, description=description, image_url=image_url
        )
        db.add(drink)
        db.commit()
        db.refresh(drink)
        return drink

    def remove_drink(self, db: Session, id: int, name: str = "") -> None:
        """
        Removes a drink from the database. Pass in the db and either the drink id
        or pass in 0 for the id and the drink name to remove it
        """
        if id > 0:
            db.query(Drink).filter_by(id=id).delete()
        else:
            db.query(Drink).filter_by(name=name).delete()

        db.commit()
