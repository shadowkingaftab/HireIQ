from typing import List
from fastapi import Depends, HTTPException, status
from proofhire.backend.app.dependencies.auth import get_current_user
from proofhire.backend.app.models.user import User

class PermissionChecker:
    def __init__(self, required_permissions: List[str]):
        self.required_permissions = required_permissions

    def __call__(self, current_user: User = Depends(get_current_user)):
        # Check if user is superuser (bypass)
        if current_user.is_superuser:
            return True
            
        # Check roles and their permissions
        user_permissions = set()
        for role in current_user.roles:
            for perm in role.permissions:
                user_permissions.add(perm.name)
        
        for required in self.required_permissions:
            if required not in user_permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Missing required permission: {required}",
                )
        return True

def has_permissions(permissions: List[str]):
    return PermissionChecker(permissions)
