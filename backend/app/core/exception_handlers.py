from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from proofhire.backend.app.core.exceptions import AppError

def add_exception_handlers(app: FastAPI):
    @app.exception_handler(AppError)
    async def app_error_handler(request: Request, exc: AppError):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "message": exc.message,
                    "code": exc.code,
                    "details": exc.details
                }
            },
        )

    @app.exception_handler(Exception)
    async def general_error_handler(request: Request, exc: Exception):
        # In production, you'd want to log the stack trace here
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "message": "An internal server error occurred",
                    "code": "INTERNAL_SERVER_ERROR"
                }
            },
        )
