from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi import status

from .routes import api, base
from . import errors

app = FastAPI(
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    swagger_ui_oauth2_redirect_url="/api/docs/oauth2-redirect",
)
app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.include_router(api)
app.include_router(base)


@app.exception_handler(errors.PermissionException)
async def permission_error_handler(request: Request, exc: errors.PermissionException):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED, content={"message": exc.detail}
    )


@app.exception_handler(errors.ResourceNotFound)
async def not_found_handler(request: Request, exc: errors.ResourceNotFound):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "message": f'"{exc.resource}" not found with search paramaters: {exc.search_params}'
        },
    )