import stripe
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from ..models.subscription import Subscription

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

def create_checkout_session(user_id: str, plan_type: str, success_url: str, cancel_url: str):
    """Create a Stripe checkout session for a specific plan."""
    price_ids = {
        "pro": os.getenv("STRIPE_PRO_PRICE_ID"),
        "team": os.getenv("STRIPE_TEAM_PRICE_ID")
    }
    
    if plan_type not in price_ids:
        raise ValueError("Invalid plan type")
        
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price': price_ids[plan_type],
            'quantity': 1,
        }],
        mode='subscription',
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            'user_id': user_id,
            'plan_type': plan_type
        }
    )
    return session

def handle_webhook(payload, sig_header, endpoint_secret, db: Session):
    """Handle Stripe webhooks to update subscription status."""
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        return None
    except stripe.error.SignatureVerificationError:
        return None

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session['metadata']['user_id']
        plan_type = session['metadata']['plan_type']
        
        # Update or create subscription in DB
        sub = db.query(Subscription).filter(Subscription.user_id == user_id).first()
        if not sub:
            sub = Subscription(user_id=user_id)
            db.add(sub)
            
        sub.stripe_customer_id = session['customer']
        sub.stripe_subscription_id = session['subscription']
        sub.plan_type = plan_type
        sub.status = "active"
        db.commit()
        
    return event
