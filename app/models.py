import enum
from sqlalchemy import Column
from sqlalchemy import types
from sqlalchemy.orm import Session

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


class User(Base):
    __tablename__ = "users"

    id = Column(types.Integer, primary_key=True, index=True, nullable=False)
    username = Column(types.String(50), unique=True, index=True)
    hashed_password = Column(types.String)
    birthdate = Column(types.Date, nullable=False)
    role = Column(types.Enum(UserRole), nullable=False)
    balance = Column(types.Float, default=0.0, nullable=False)
    """Represents their current monetary balance which
    can be used to purchase drinks or sponsor events"""

    # TODO: Uncomment when adding the scores table
    # scores = relationship("Score")
    # The scores table will have something like this to refer back to the user:
    # user_id = Column(types.Integer, ForeignKey("user.id"))

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


class Drink(Base):
    __tablename__ = "drinks"

    id = Column(types.Integer, primary_key=True, nullable = False, index=True)
    name = Column(types.String, nullable=False, index=True)
    price = Column(types.FLOAT, nullable=False)
    image_url = Column(types.String)
    description = Column(types.String)

    def add_drink(self, db: Session, name: str, price: float, description: str = "", image_url: str = "", ) -> "Drink":
        drink = Drink(name, price, description, image_url)
        db.add(drink)
        db.commit()
        db.refresh(drink)
        return drink

    def remove_drink(self, db : Session, id: int, name: str = "") -> None:
        db.query(Drink).filter_by(id = id).delete()
        db.commit()
