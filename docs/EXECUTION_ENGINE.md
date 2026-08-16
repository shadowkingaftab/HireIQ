# Execution Engine

## Purpose

The execution engine orchestrates complex multi-step workflows such as:
- Candidate ingestion pipelines
- Batch matching runs
- Report generation
- Evidence refresh cycles

## Components

### ExecutionPlan
Declares intent and tasks with dependencies.

### TaskGraph
Models task dependencies and enables parallel execution.

### DependencyResolver
Topological sort and ready-task detection.

### TaskScheduler
Executes ready tasks in batches with configurable concurrency.

### ExecutionContext
Shared state container for passing data between tasks.

### TimeoutManager
Wraps coroutines with timeout protection.

### RetryManager
Exponential backoff retry for transient failures.

### CircuitBreaker
Fails fast when downstream service is unhealthy.

### DeadLetterQueue
Captures permanently failed tasks for manual review.
