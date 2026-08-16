# Assessments

## Adaptive Testing

Assessments use an adaptive engine that adjusts question difficulty based on candidate performance:
- Correct answer → increase difficulty
- Incorrect answer → decrease difficulty
- Goal: converge on true ability level with minimal questions

## Question Types
- Multiple choice
- Code execution
- Free text (LLM-evaluated)

## Anti-Cheat

- Window switch detection
- Copy-paste detection
- Multiple face detection
- Behavioral telemetry

## Plagiarism

Code submissions are compared using sequence similarity to detect copying.

## Rubric

Multi-criteria grading with configurable weights per criterion.

## Test Execution

Code runs in a sandboxed subprocess with timeout protection.
