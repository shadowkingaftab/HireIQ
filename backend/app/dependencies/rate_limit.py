from fastapi import Request
from proofhire.backend.app.core.rate_limits import rate_limit_dependency

# This re-exports or wraps the core rate limiting logic for use as a dependency
get_rate_limit = rate_limit_dependency
