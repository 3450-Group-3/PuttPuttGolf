from typing import Optional
from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from sqlalchemy.orm.session import Session
from starlette import status
from starlette.responses import JSONResponse

from app.dependancies import get_current_user, get_db
from app import schemas, models
from app.security import Password

users = APIRouter(prefix="/users")


@users.get("/me", response_model=schemas.User)
def me(user=Depends(get_current_user)):
    return user


@users.put("/me", response_model=schemas.User)
def edit_user(
    user_data: schemas.UserInUpdate,
    curr_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    collisions = (
        db.query(models.User)
        .where(
            models.User.username == user_data.username, models.User.id != user_data.id
        )
        .all()
    )

    if collisions:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": "Username Taken"},
        )

    curr_user.username = user_data.username
    curr_user.birthdate = user_data.birthdate
    curr_user.role = user_data.role

    db.commit()
    db.refresh(curr_user)
    return curr_user


@users.get(
    "",
    response_model=list[schemas.User],
    dependencies=[Depends(get_current_user)],
)
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@users.post("", response_model=schemas.User)
def create_user(user_data: schemas.UserIn, db: Session = Depends(get_db)):
    collisions = (
        db.query(models.User).where(models.User.username == user_data.username).all()
    )

    if collisions:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": "Username Taken"},
        )

    user = models.User(
        username=user_data.username,
        birthdate=user_data.birthdate,
        hashed_password=Password.hash(user_data.password),
        role=models.UserRole.PLAYER,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@users.post("/me/change-password", response_model=schemas.User)
def change_password(
    pw_data: schemas.PasswordIn,
    db: Session = Depends(get_db),
    user=Depends(
        get_current_user,
    ),
):
    if not Password.verify(pw_data.curr_password, user.hashed_password):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Incorrect password"},
        )

    user.hashed_password = Password.hash(pw_data.new_password)

    db.commit()
    db.refresh(user)
    return user
