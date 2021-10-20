from fastapi import APIRouter, Depends
from sqlalchemy.orm.session import Session
from app.dependancies import get_current_user, get_db
from app import schemas, models


drinks = APIRouter(prefix="drinks")

@drinks.get("", response_model=list[schemas.Drink]) #todo: get a list of all drinks
def list_drinks():
    pass

@drinks.post("", response_model=schemas.Drink) #todo: create a drink and add it to the db
def create_drink():
    pass

@drinks.delete("")
def remove_drink(): #todo: remove a drink
    pass