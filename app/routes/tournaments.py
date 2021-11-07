from typing import Literal, Optional
from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from sqlalchemy.orm.session import Session
from starlette import status
from starlette.responses import JSONResponse

from app.dependancies import current_user_is_manager, get_current_user, get_db
from app import schemas, models
from app.security import Password

tournaments = APIRouter(prefix="/tournaments", tags=["Tournament Crud"])


def not_found(obj: str):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND, content={"detail": f"{obj} not found"}
    )


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
        return not_found("Tournament")

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
        return not_found("Tournament")

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
        return not_found("Tournament")

    db.delete(tournament)
    db.commit()

    return JSONResponse(status_code=status.HTTP_200_OK)


@tournaments.post("/add_user")
def add_user(
    t_data: schemas.Tournament,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tournament: Optional[models.Tournament] = (
        db.query(models.Tournament).where(models.Tournament.id == t_data.id).first()
    )

    if not tournament:
        return not_found("Tournament")

    tournament.add_user(db, user)

    return JSONResponse(status_code=status.HTTP_200_OK)


@tournaments.post("/remove_user")
def remove_user(
    t_data: schemas.Tournament,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tournament: Optional[models.Tournament] = (
        db.query(models.Tournament).where(models.Tournament.id == t_data.id).first()
    )

    if not tournament:
        return not_found("Tournament")

    tournament.remove_user(db, user)

    return JSONResponse(status_code=status.HTTP_200_OK)


@tournaments.post("/update_score", dependencies=[Depends(get_current_user)])
def update_score(
    score_data: schemas.TournamentEnrollment,
    db: Session = Depends(get_db),
):
    tournament: Optional[models.Tournament] = (
        db.query(models.Tournament)
        .where(models.Tournament.id == score_data.tournament.id)
        .first()
    )

    if not tournament:
        return not_found("Tournament")

    user: Optional[models.User] = (
        db.query(models.User).where(models.User.id == score_data.user.id).first()
    )

    if not user:
        return not_found("User")

    tournament.increment_score(db, user, score_data.score)

    return (
        db.query(models.TournamentEnrollment)
        .where(
            models.TournamentEnrollment.tournament_id == tournament.id,
            models.TournamentEnrollment.user_id == user.id,
        )
        .first()
    )
