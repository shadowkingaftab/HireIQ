from fastapi import APIRouter, Depends
from backend.app.integrations.stripe.client import StripeIntegration
from backend.app.contracts.integrations import IntegrationCreate, Integration

router = APIRouter()
integration = StripeIntegration()


@router.get("/")
def list_integrations():
    return []


@router.post("/", response_model=Integration)
def create_integration(integration_in: IntegrationCreate):
    return integration.handle_webhook(payload={})

