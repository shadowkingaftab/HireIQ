from typing import List
from proofhire.backend.app.core.constants import UserRole
from proofhire.backend.app.dependencies.auth import get_current_active_user

def require_roles(roles: List[UserRole]):
    def checker(current_user = Depends(get_current_active_user)):
        if current_user.role not in roles:
            raise HTTPException(status_code=403, detail="Forbidden")
        return current_user
    return checker
