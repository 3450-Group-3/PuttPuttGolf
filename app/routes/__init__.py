"""Routing Package. Holds all api-routes and their associated functions

To add a new resource, create a new file in this package and declare a new APIRouter with
a unique prefix. (i.e for users it might be `/users`). Import that router in to this file
and include it with `api.include_router(<your router>)`
"""
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

# Special routes for base-level routes. Don't include in the api router
from .base import base
from .auth import auth
from .drinks import drinks
from .users import users
from .tournaments import tournaments
from .orders import orders
from ..dependancies import get_current_user, get_db
from ..schemas import User

api = APIRouter(prefix="/api")
api.include_router(auth)
api.include_router(users)
api.include_router(tournaments)
api.include_router(drinks)
api.include_router(orders)

@api.get("/{path:path}")
def api_catch():
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Endpoint not Found",
    )
