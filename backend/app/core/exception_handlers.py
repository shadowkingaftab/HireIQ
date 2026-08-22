from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from proofhire.backend.app.core.exceptions import AppError
from proofhire.backend.app.core.logging import get_logger

logger = get_logger(__name__)


def add_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def app_error_handler(request: Request, exc: AppError):
        logger.error("AppError: %s %s", exc.code, exc.message)
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": {"message": exc.message, "code": exc.code, "details": exc.details}},
        )

    @app.exception_handler(Exception)
    async def general_error_handler(request: Request, exc: Exception):
        logger.exception("Unhandled exception on %s", request.url.path)
        return JSONResponse(
            status_code=500,
            content={"error": {"message": "An internal server error occurred", "code": "INTERNAL_SERVER_ERROR"}},
        )
