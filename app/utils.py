import enum


def to_camel(string: str, upper_camel_case=False):
    """Converts the provided string to camelCase"""
    return "".join(
        [
            word.capitalize() if idx != 0 or upper_camel_case else word
            for idx, word in enumerate(string.split("_"))
        ]
    )


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