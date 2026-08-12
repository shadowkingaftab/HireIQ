from typing import Any, Dict, Optional

class AppError(Exception):
    def __init__(
        self, 
        message: str, 
        status_code: int = 400, 
        code: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.code = code
        self.details = details

class NotFoundError(AppError):
    def __init__(self, message: str = "Resource not found", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=404, code="NOT_FOUND", details=details)

class UnauthorizedError(AppError):
    def __init__(self, message: str = "Unauthorized", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=401, code="UNAUTHORIZED", details=details)

class ForbiddenError(AppError):
    def __init__(self, message: str = "Forbidden", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=403, code="FORBIDDEN", details=details)
