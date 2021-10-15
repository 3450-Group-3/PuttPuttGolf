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

    stored_user: Optional[models.User] = (
        db.query(models.User).where(models.User.id == user_data.id).first()
    )

    if stored_user:
        stored_user.username = user_data.username
        stored_user.birthdate = user_data.birthdate
        stored_user.role = user_data.role

        db.commit()
        db.refresh(stored_user)
        return stored_user

    else:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": "User not found"},
        )


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
