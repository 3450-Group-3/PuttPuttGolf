"""Handles base-level routing
Most of the FastAPI code should be namespaced under `/api/`
Anything else should be registered to the `base` router.
"""
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from ..config import config

base = APIRouter()
templates = Jinja2Templates(directory="app/templates")

base.mount("/static", StaticFiles(directory="app/static"), name="static")


@base.get("/{path:path}", response_class=HTMLResponse)
async def root(request: Request, path: str):
    """Catch all path for frontend application.
    Recieves any undeclared route and fowards it to the
    React application.
    """
    return templates.TemplateResponse(
        "index.html", {"request": request, "environment": config.environment}
    )
