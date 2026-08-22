import asyncio
from proofhire.backend.app.integrations.github.provider import github_provider
from proofhire.backend.app.integrations.stripe.provider import StripeProvider
from proofhire.backend.app.integrations.greenhouse.client import greenhouse_client

async def main():
    providers = [github_provider, StripeProvider()]
    for provider in providers:
        health = await provider.health()
        print(f"{provider.name}: {health}")
    print("Greenhouse sync skipped (no API key)")

if __name__ == "__main__":
    asyncio.run(main())
