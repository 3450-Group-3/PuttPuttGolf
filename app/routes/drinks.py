from fastapi import APIRouter, Depends
from sqlalchemy.orm.session import Session
from app.dependancies import get_current_user, get_db, current_user_is_manager
from app import schemas, models


drinks = APIRouter(prefix="drinks")

@drinks.get("", response_model=list[schemas.Drink], dependencies=[Depends(get_current_user)]) #todo: get a list of all drinks
def list_drinks():
    pass

@drinks.post("", response_model=schemas.Drink, dependencies=[Depends(current_user_is_manager)]) #todo: create a drink and add it to the db
def create_drink():
    pass

@drinks.delete("", dependencies=[Depends(current_user_is_manager)])
def remove_drink(): #todo: remove a drink
    pass