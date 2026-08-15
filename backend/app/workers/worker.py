import asyncio
from typing import Dict, Any

class BaseWorker:
    def __init__(self, name: str):
        self.name = name

    async def start(self):
        print(f"Worker {self.name} started.")
        while True:
            # Poll queue and process tasks
            await asyncio.sleep(10)

worker = BaseWorker("main-worker")
