from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

from app import models

from .security import AccessToken, get_user
from .db import SessionLocal


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> models.User:
    """Dependancy to obtain the currently authenticated user.
    If no authetication is present, a 401 will be returned
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = AccessToken.decode(token)
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception

    except JWTError as e:
        raise credentials_exception from e

    user = get_user(db, username=username)
    if user is None:
        raise credentials_exception
    return user

async def current_user_is_manager() -> bool:
    permission_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="User does not have sufficient permissions",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user : models.User = get_current_user()
    if (user.is_manager):
        return True
    else:
        raise permission_exception
    
async def current_user_is_sponsor() -> bool:
    permission_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="User does not have sufficient permissions",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user : models.User = get_current_user()
    if (user.is_sponsor):
        return True
    else:
        raise permission_exception
    
async def current_user_is_drinkmeister() -> bool:
    permission_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="User does not have sufficient permissions",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user : models.User = get_current_user()
    if (user.is_drink_meister):
        return True
    else:
        raise permission_exception
    