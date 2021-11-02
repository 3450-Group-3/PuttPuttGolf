from typing import Literal, Optional
from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from sqlalchemy.orm.session import Session
from starlette import status
from starlette.responses import JSONResponse

from app.dependancies import current_user_is_manager, get_current_user, get_db
from app import schemas, models
from app.security import Password
from app import errors

tournaments = APIRouter(prefix="/tournaments", tags=["Tournament Crud"])


@tournaments.get(
    "",
    response_model=list[schemas.Tournament],
    dependencies=[Depends(get_current_user)],
)
def get_tournaments(db: Session = Depends(get_db)):
    return db.query(models.Tournament).all()


@tournaments.get(
    "/{id}",
    response_model=schemas.Tournament,
    dependencies=[Depends(get_current_user)],
)
def get_tournament(id: int, db: Session = Depends(get_db)):
    tournament = db.query(models.Tournament).where(models.Tournament.id == id).first()

    if not tournament:
        raise errors.ResourceNotFound("Tournament")

    return tournament


@tournaments.post(
    "",
    response_model=schemas.Tournament,
    dependencies=[],
)
def create_tournament(
    t_data: schemas.TournamentIn,
    curr_user=Depends(current_user_is_manager),
    db: Session = Depends(get_db),
):

    tournament = models.Tournament(
        date=t_data.date,
        hole_count=t_data.hole_count,
        balance=0,
        completed=False,
        created_by=curr_user,
    )

    db.add(tournament)
    db.commit()
    db.refresh(tournament)

    return tournament


@tournaments.put(
    "/{id}",
    response_model=schemas.Tournament,
    dependencies=[Depends(current_user_is_manager)],
)
def update_tournament(
    id: int, t_data: schemas.Tournament, db: Session = Depends(get_db)
):
    tournament: Optional[models.Tournament] = (
        db.query(models.Tournament).where(models.Tournament.id == id).first()
    )

    if not tournament:
        raise errors.ResourceNotFound("Tournament")

    tournament.date = t_data.date
    tournament.completed = t_data.completed
    tournament.advertising_banner = t_data.advertising_banner
    tournament.balance = t_data.balance
    tournament.hole_count = t_data.hole_count

    db.commit()
    db.refresh(tournament)

    return tournament


@tournaments.delete("/{id}", dependencies=[Depends(current_user_is_manager)])
def delete_tournament(id: int, db: Session = Depends(get_db)):
    tournament = db.query(models.Tournament).where(models.Tournament.id == id).first()

    if not tournament:
        raise errors.ResourceNotFound("Tournament")

    db.delete(tournament)
    db.commit()

    return {"status": "ok"}


@tournaments.post("/{id}/add_user")
def add_user(
    id: int,
    to_add: schemas.AddOrRemoveUser,
    db: Session = Depends(get_db),
):
    tournament: Optional[models.Tournament] = db.query(models.Tournament).get(id)
    user: Optional[models.User] = db.query(models.User).get(to_add.user_id)

    if not tournament:
        raise errors.ResourceNotFound("Tournament")

    if not user:
        raise errors.ResourceNotFound("User")

    tournament.add_user(db, user)

    return {"status": "ok"}


@tournaments.post("/{id}/remove_user")
def remove_user(
    id: int,
    to_remove: schemas.AddOrRemoveUser,
    db: Session = Depends(get_db),
):
    tournament: Optional[models.Tournament] = db.query(models.Tournament).get(id)
    user: Optional[models.User] = db.query(models.User).get(to_remove.user_id)

    if not tournament:
        raise errors.ResourceNotFound("Tournament")

    if not user:
        raise errors.ResourceNotFound("User")

    tournament.remove_user(db, user)

    return {"status": "ok"}


@tournaments.post("/{id}/update_score", dependencies=[Depends(get_current_user)])
def update_score(
    id: int,
    increment: schemas.IncrementScore,
    db: Session = Depends(get_db),
):
    tournament: Optional[models.Tournament] = db.query(models.Tournament).get(id)
    user: Optional[models.User] = db.query(models.User).get(increment.user_id)

    if not tournament:
        raise errors.ResourceNotFound("Tournament")

    if not user:
        raise errors.ResourceNotFound("User")

    tournament.increment_score(db, user, increment.score)

    return {"status": "ok"}
