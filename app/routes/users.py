from fastapi import APIRouter, Depends
from sqlalchemy.orm.session import Session

from app.dependancies import get_current_user, get_db
from app import schemas, models
from app.security import Password

users = APIRouter(prefix=("/users"))


@users.get(
    "/",
    response_model=list[schemas.User],
    dependencies=[Depends(get_current_user)],
)
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@users.post(
    "/",
    response_model=schemas.User,
    dependencies=[Depends(get_current_user)],
)
def create_user(user_data: schemas.UserIn, db: Session = Depends(get_db)):
    hashed_password = Password.hash(user_data.password)
    user = models.User(
        username=user_data.username,
        hashed_password=hashed_password,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
