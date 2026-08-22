from typing import List
from fastapi import Depends, HTTPException, status
from proofhire.backend.app.core.constants import UserRole
# This will be properly implemented once we have the user model and dependency
# For now, it's a structural placeholder for the permission logic

class PermissionChecker:
    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: any = None): # Placeholder for user dependency
        if current_user and current_user.role in self.allowed_roles:
            return True
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )

def has_role(roles: List[UserRole]):
    return PermissionChecker(roles)
