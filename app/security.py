"""Module to handle user authentication, token encoding/decoding, and password encryption verification"""
from typing import Optional
from datetime import datetime, timedelta
from jose import jwt
import bcrypt
from sqlalchemy.orm.session import Session

from .schemas import UserInDB
from .config import config
from . import models


class AccessToken:
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 300

    @staticmethod
    def encode(data: dict, expires_delta: Optional[timedelta] = None):
        """Encodes a JWT access token

        Args:
            data (dict): The date to encode in the JWT token
            expires_delta (Optional[timedelta], optional): A `timedelta` representing when the
                token should expire. If a time isn't given, it will default to 30 minutes

        Returns:
            str: encoded JWT token
        """
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                minutes=AccessToken.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode, config.secret_key, algorithm=AccessToken.ALGORITHM
        )
        return encoded_jwt

    @staticmethod
    def decode(token: str):
        """Decodes the provided JWT token

        Returns:
            dict: the decoded JWT

        Raises:
            JWTError if the JWT is not valid, or has expired
        """
        return jwt.decode(token, config.secret_key, algorithms=[AccessToken.ALGORITHM])


class Password:
    @staticmethod
    def verify(plain_password: str, hashed_password: str) -> bool:
        """Checks a plain password against a stored hashed password"""
        return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

    @staticmethod
    def hash(password: str) -> str:
        """Hashes a provided password using the `bcrypt` algorithm"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode(), salt=salt).decode()


def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if not user or not Password.verify(password, user.hashed_password):
        return False

    return user


def get_user(db: Session, username: str):
    user: Optional[models.User] = (
        db.query(models.User).where(models.User.username == username).first()
    )

    return user
