"""Routing Package. Holds all api-routes and their associated functions

To add a new resource, create a new file in this package and declare a new APIRouter with
a unique prefix. (i.e for users it might be `/users`). Import that router in to this file
and include it with `api.include_router(<your router>)`
"""
from fastapi import APIRouter

# Special routes for base-level routes. Don't include in the api router
from .base import base

api = APIRouter(prefix="/api")


@api.get("/test")
def test():
    return {"api": "value"}
