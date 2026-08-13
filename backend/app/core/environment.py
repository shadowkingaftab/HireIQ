import os
from enum import Enum

class Environment(str, Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"
    TESTING = "testing"

def get_environment() -> Environment:
    env = os.getenv("APP_ENV", "development").lower()
    try:
        return Environment(env)
    except ValueError:
        return Environment.DEVELOPMENT

def is_production() -> bool:
    return get_environment() == Environment.PRODUCTION
