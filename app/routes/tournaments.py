from typing import Optional
from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from sqlalchemy.orm.session import Session
from starlette import status
from starlette.responses import JSONResponse

from app.dependancies import get_current_user, get_db
from app import schemas, models
from app.security import Password

tournaments = APIRouter(prefix="/tournaments")


@tournaments.get(
    "",
    response_model=list[schemas.Tournament],
    dependencies=[Depends(get_current_user)],
)
def get_tournaments(db: Session = Depends(get_db)):
    return db.query(models.Tournament).all()


@tournaments.post(
    "", response_model=schemas.Tournament, dependencies=[Depends(get_current_user)]
)
def add_tournament():
    pass


@tournaments.get(
    "/{id}", response_model=schemas.Tournament, dependencies=[Depends(get_current_user)]
)
def get_tournament(id: int):
    pass


@tournaments.put(
    "/{id}", response_model=schemas.Tournament, dependencies=[Depends(get_current_user)]
)
def update_tournament(id: int, tournament_data: schemas.Tournament):
    pass


@tournaments.delete("/{id}", dependencies=[Depends(get_current_user)])
def delete_tournament(id: int):
    pass