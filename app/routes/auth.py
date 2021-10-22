from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm

from ..security import authenticate_user, AccessToken
from ..dependancies import get_db

auth = APIRouter(prefix="/auth", tags=["Authorization"])


@auth.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):

    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    else:
        access_token = AccessToken.encode(data={"sub": user.username})
        return {"access_token": access_token, "token_type": "bearer"}
