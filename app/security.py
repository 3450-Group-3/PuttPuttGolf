from typing import Optional
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

from .schemas import UserInDB

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"


fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Wonderson",
        "email": "alice@example.com",
        "hashed_password": "fakehashedsecret2",
        "disabled": True,
    },
}


class AccessToken:
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

    @staticmethod
    def encode(data: dict, expires_delta: Optional[timedelta] = None):
        """Encodes a JWT access token_

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
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=AccessToken.ALGORITHM)
        return encoded_jwt

    @staticmethod
    def decode(token: str):
        """Decodes the provided JWT token

        Returns:
            dict: the decoded JWT

        Raises:
            JWTError if the JWT is not valid, or has expired
        """
        return jwt.decode(token, SECRET_KEY, algorithms=[AccessToken.ALGORITHM])


class Password:
    context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    @staticmethod
    def verify(plain_password: str, hashed_password: str):
        return Password.context.verify(plain_password, hashed_password)

    @staticmethod
    def hash(password):
        return Password.context.hash(password)


def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not Password.verify(password, user.hashed_password):
        return False
    return user


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)
