import logging
from typing import Callable, Optional

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from proofhire.backend.app.core.exceptions import ForbiddenError

logger = logging.getLogger(__name__)


class TenantContextMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, auth_header_name: str = "X-Organization-ID"):
        super().__init__(app)
        self.auth_header_name = auth_header_name

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        organization_id = request.headers.get(self.auth_header_name)
        if not organization_id:
            user = getattr(request.state, "user", None)
            if user and hasattr(user, "organization_id") and user.organization_id:
                organization_id = user.organization_id
        request.state.organization_id = organization_id
        response = await call_next(request)
        return response
