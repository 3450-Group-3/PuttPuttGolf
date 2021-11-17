from typing import Literal, Union
from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from sqlalchemy.orm.session import Session
from starlette import status
from starlette.responses import JSONResponse

from app.dependancies import get_current_user, get_db, current_user_is_manager
from app import errors, schemas, models
from app.security import Password

users = APIRouter(prefix="/users", tags=["User Crud"])


def get_relevant_user(
    id: Union[int, Literal["me"]],
    curr_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if id == "me":
        return curr_user
    else:
        user = db.query(models.User).get(id)
        if user:
            if curr_user == user or curr_user.is_manager:
                return user
            else:
                raise errors.ResourceNotFound("User", {"id": id})
        else:
            raise errors.ResourceNotFound("User", {"id": id})


@users.get(
    "",
    response_model=list[schemas.User],
    dependencies=[Depends(current_user_is_manager)],
)
def list_users(db: Session = Depends(get_db), search: str = None):
    """List all users

    # Permissions:
    Must be a manager
    """
    if search:
        return (
            db.query(models.User).filter(models.User.username.like(f"%{search}%")).all()
        )

    else:
        return db.query(models.User).all()


@users.get("/{id}", response_model=schemas.User)
def show_user(user: models.User = Depends(get_relevant_user)):
    return user


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


@users.put("/{id}", response_model=schemas.User)
def update_user(
    user_data: schemas.UserInUpdate,
    id: Union[int, Literal["me"]],
    db: Session = Depends(get_db),
    user: models.User = Depends(get_relevant_user),
):
    collisions = tuple(
        collision
        for collision in db.query(models.User)
        .where(models.User.username == user_data.username)
        .all()
        if collision != user
    )

    if collisions:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": "Username Taken"},
        )

    user.username = user_data.username
    user.birthdate = user_data.birthdate
    user.role = user_data.role

    db.commit()
    db.refresh(user)
    return user


@users.put("/{id}/balance", response_model=schemas.BalanceUpdate)
def update_balance(
    update: schemas.BalanceUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_relevant_user),
):
    if update.balance < 0:
        raise errors.ValidationError("Balance cannot be negative")

    user.update_balance(update.balance, db)
    return {"balance": user.balance}


@users.delete("/{id}")
def delete_user(
    user: models.User = Depends(get_relevant_user),
    db: Session = Depends(get_db),
):

    db.delete(user)
    db.commit()
    return {"status": "ok"}


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