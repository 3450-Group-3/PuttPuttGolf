from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles



from .routes import api, base
from fastapi.staticfiles import StaticFiles


app = FastAPI(
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    swagger_ui_oauth2_redirect_url="/api/docs/oauth2-redirect",
)
app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.include_router(api)
app.include_router(base)
