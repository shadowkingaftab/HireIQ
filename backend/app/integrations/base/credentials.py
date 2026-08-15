from typing import Optional, Dict, Any
from pydantic import BaseModel

class IntegrationCredentials(BaseModel):
    provider_name: str
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    api_key: Optional[str] = None
    client_id: Optional[str] = None
    client_secret: Optional[str] = None
    extra_params: Dict[str, Any] = {}
