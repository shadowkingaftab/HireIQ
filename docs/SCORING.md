# Scoring

## Model

The scoring engine computes a normalized score between 0 and 1 for candidate-job pairs.

## Inputs

- Skill overlap ratio
- Experience match
- Evidence reliability
- Evidence freshness
- Evidence consistency across sources

## Calibration

Scores are calibrated to:
- Bound output to [0, 1]
- Account for uncertainty based on evidence count
- Penalize stale evidence

## Uncertainty

Uncertainty is computed based on:
- Number of evidence items
- Average reliability score
- Consistency across sources
- Recency of evidence

High uncertainty reduces confidence even if raw score is high.

## Versioning

Scoring algorithm versions are tracked in `score_versions` table to ensure reproducibility of past matches.
