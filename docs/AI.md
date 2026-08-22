# AI

## Providers

- OpenAI (GPT-4, embeddings)
- Anthropic (Claude)

## Inference Router

Routes tasks to appropriate providers based on:
- Task kind (extraction, classification, generation)
- Cost constraints
- Latency requirements
- Fallback availability

## Prompt Registry

Centralized prompt templates with versioning.

## Extraction

Extracts skills, experience, and entities from unstructured text.

## Classification

Classifies evidence types and candidate capabilities.

## Reranking

Reranks search/match results using LLM judgment.

## Evaluation

Tracks model performance on domain-specific tasks.

## Hallucination Guard

Validates LLM outputs against provided context to reduce fabrication.

## Citation Builder

Attaches source citations to LLM-generated claims.

## Audit

All AI usage is logged for governance and compliance.
