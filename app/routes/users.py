from typing import Optional, Literal, Union
from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from sqlalchemy.orm.session import Session
from starlette import status
from starlette.responses import JSONResponse

from app.dependancies import get_current_user, get_db, current_user_is_manager
from app import errors, schemas, models
from app.security import Password

users = APIRouter(prefix="/users", tags=["User Crud"])


@users.get(
    "",
    response_model=list[schemas.User],
    dependencies=[Depends(current_user_is_manager)],
)
def list_users(db: Session = Depends(get_db)):
    """List all users

    # Permissions:
    Must be a manager
    """
    return db.query(models.User).all()


@users.get("/{id}", response_model=schemas.User)
def show_user(
    id: Union[int, Literal["me"]],
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if id == "me" or id == user.id:
        return user

    if user.is_manager:
        found = db.query(models.User).get(id)
        if found:
            return found
        raise errors.ResourceNotFound("User", {"id": id})

    raise errors.PermissionException("retrieve user data")


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
    id: Union[int, Literal["me"]],
    user_data: schemas.UserInUpdate,
    db: Session = Depends(get_db),
    curr_user: models.User = Depends(get_current_user),
):
    collisions = (
        db.query(models.User)
        .where(models.User.username == user_data.username, models.User.id != id)
        .all()
    )

    if collisions:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": "Username Taken"},
        )

    if id == "me" or curr_user.id == id:
        curr_user.username = user_data.username
        curr_user.birthdate = user_data.birthdate
        curr_user.role = user_data.role

        db.commit()
        db.refresh(curr_user)
        return curr_user

    elif curr_user.is_manager:
        user = db.query(models.User).get(id)
        if not user:
            raise errors.ResourceNotFound("User", {"id": id})

        user.username = user_data.username
        user.birthdate = user_data.birthdate
        user.role = user_data.role

        db.commit()
        db.refresh(user)
        return user

    raise errors.PermissionException("edit user")


@users.delete("/{id}")
def delete_user(
    id: Union[int, Literal["me"]],
    db: Session = Depends(get_db),
    curr_user: models.User = Depends(get_current_user),
):
    if id == "me":
        user = curr_user
    else:
        user = db.query(models.User).get(id)

    if not user:
        raise errors.ResourceNotFound("User", {"id": id})

    if user and (user.id == curr_user.id or curr_user.is_manager):
        db.delete(user)
        db.commit()
        return {"status": "ok"}
    else:
        raise errors.PermissionException("delete user")


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