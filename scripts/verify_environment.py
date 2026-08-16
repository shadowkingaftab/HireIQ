import os
from proofhire.backend.app.core.config import Settings

def main():
    settings = Settings()
    checks = []
    checks.append(("DATABASE_URL", bool(settings.DATABASE_URL)))
    checks.append(("SECRET_KEY", bool(settings.SECRET_KEY)))
    checks.append(("REDIS_URL", bool(settings.REDIS_URL)))
    checks.append(("OPENAI_API_KEY", bool(settings.OPENAI_API_KEY)))
    for name, ok in checks:
        status = "OK" if ok else "MISSING"
        print(f"[{status}] {name}")
    if not all(ok for _, ok in checks):
        raise SystemExit(1)

if __name__ == "__main__":
    main()
