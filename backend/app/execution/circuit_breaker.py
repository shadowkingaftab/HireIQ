import time

class CircuitBreaker:
    def __init__(self, threshold: int = 5, recovery_timeout: int = 60):
        self.threshold = threshold
        self.recovery_timeout = recovery_timeout
        self.failures = 0
        self.last_failure_time = 0
        self.state = "closed" # closed, open, half-open

    def record_failure(self):
        self.failures += 1
        self.last_failure_time = time.time()
        if self.failures >= self.threshold:
            self.state = "open"

    def can_execute(self) -> bool:
        if self.state == "open":
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = "half-open"
                return True
            return False
        return True

circuit_breaker = CircuitBreaker()
