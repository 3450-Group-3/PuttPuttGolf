from typing import Optional
from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from sqlalchemy.orm.session import Session
from starlette import status
from starlette.responses import JSONResponse

from app.dependancies import current_user_is_manager, get_current_user, get_db
from app import schemas, models
from app.security import Password

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
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"detail": "Tournament not found"},
        )

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
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"detail": "Tournament not found"},
        )

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
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"detail": "Tournament not found"},
        )

    db.delete(tournament)
    db.commit()

    return JSONResponse(status_code=status.HTTP_200_OK)
