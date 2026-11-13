from typing import List

from backend.app.core.constants import UserRole
from backend.app.dependencies.auth import get_current_active_user
from backend.app.models.user import User
from fastapi import Depends, HTTPException, status


class PermissionChecker:
    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_active_user)) -> bool:
        user_roles = {role.name for role in current_user.roles}
        if current_user.is_superuser or any(role.value in user_roles for role in self.allowed_roles):
            return True
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )

def has_role(roles: List[UserRole]):
    return PermissionChecker(roles)

