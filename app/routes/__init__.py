"""Routing Package. Holds all api-routes and their associated functions

To add a new resource, create a new file in this package and declare a new APIRouter with
a unique prefix. (i.e for users it might be `/users`). Import that router in to this file
and include it with `api.include_router(<your router>)`
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# Special routes for base-level routes. Don't include in the api router
from .base import base
from .auth import auth
from ..dependancies import get_current_user, get_db
from ..schemas import User

api = APIRouter(prefix="/api")
api.include_router(auth)


@api.get("/test", response_model=User)
def test(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return user
