from fastapi import FastAPI


from .routes import api, base
from . import models
from .db import engine

models.Base.metadata.create_all(bind=engine)


app = FastAPI(
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    swagger_ui_oauth2_redirect_url="/api/docs/oauth2-redirect",
)
app.include_router(api)
app.include_router(base)
