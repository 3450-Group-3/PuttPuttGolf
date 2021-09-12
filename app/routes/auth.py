from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm

from ..security import authenticate_user, AccessToken
from ..dependancies import fake_users_db

auth = APIRouter(prefix="/auth")


@auth.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = AccessToken.encode(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
