from typing import List, Dict, Any

class SandboxManager:
    def create_sandbox(self) -> str:
        # Provision a docker container or firecracker microVM
        return "sandbox-id"

    def destroy_sandbox(self, sandbox_id: str):
        pass

sandbox_manager = SandboxManager()
