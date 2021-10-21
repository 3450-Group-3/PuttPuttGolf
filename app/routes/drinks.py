from fastapi import APIRouter, Depends
from sqlalchemy.orm.session import Session
from starlette import status
from starlette.responses import JSONResponse
from app.dependancies import get_current_user, get_db, current_user_is_manager
from app import schemas, models


drinks = APIRouter(prefix="/drinks")

@drinks.get("", response_model=list[schemas.Drink], dependencies=[Depends(get_current_user)])
def list_drinks(db: Session = Depends(get_db)):
    return db.query(models.Drink).all()

@drinks.post("", response_model=schemas.Drink, dependencies=[Depends(current_user_is_manager)])
def create_drink(drink_data: schemas.Drink, db: Session = Depends(get_db)):
    collisions = (
        db.query(models.Drink).where(models.Drink.name == drink_data.name).all()
    )

    if (collisions):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": "Drink already exists"}
    )

    drink = models.Drink.add_drink(
        db = db,   
        name = drink_data.name,
        price = drink_data.price,
        image_url = drink_data.image_url,
        description = drink_data.description
    )
    return drink


@drinks.delete("", dependencies=[Depends(current_user_is_manager)])
def remove_drink(drink_name: str = "", db: Session = Depends(get_db)):
    models.Drink.remove_drink(
        db = db,
        name = drink_name
    )


@drinks.put("", response_model=schemas.Drink, dependencies=[Depends(current_user_is_manager)])
def update_drink(drink_data: schemas.Drink, db: Session = Depends(get_db)):
    return models.Drink.update_drink(
        db = db,
        name = drink_data.name,
        price = drink_data.price,
        image_url = drink_data.image_url,
        description = drink_data.description
    )