from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

from .security import AccessToken, get_user, fake_users_db


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


async def get_current_user(token: str = Depends(oauth2_scheme)):
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

    user = get_user(fake_users_db, username=username)
    if user is None:
        raise credentials_exception
    return user
