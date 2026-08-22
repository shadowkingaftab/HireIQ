from fastapi import Query
from proofhire.backend.app.core.constants import DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE
from proofhire.backend.app.contracts.common import Params

def get_pagination_params(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE, description="Items per page")
) -> Params:
    return Params(page=page, size=size)
