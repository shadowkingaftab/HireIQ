from backend.app.integrations.stripe.client import StripeIntegration
from fastapi import APIRouter, Request

router = APIRouter()
integration = StripeIntegration()


@router.post("/stripe")
async def stripe_webhook(request: Request):
    payload = await request.json()
    return await integration.handle_webhook(payload)

