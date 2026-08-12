import logging
import sys
from typing import Any, Dict

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Disable some noisy loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
