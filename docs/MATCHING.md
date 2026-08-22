# Matching

## Overview

Candidate-job matching is a multi-signal ensemble that combines semantic, skill-based, experience, and evidence-quality signals into a single explainable score.

## Pipeline

1. **Feature Building** - Extract features from candidate and job
2. **Semantic Matching** - NLP-based text similarity
3. **Graph Matching** - Skill overlap using skill graph
4. **Experience Matching** - Years and seniority fit
5. **Evidence Quality** - Reliability and freshness of evidence
6. **Ensemble Scoring** - Weighted combination
7. **Calibration** - Score normalization
8. **Uncertainty Estimation** - Confidence bounds
9. **Explanation Generation** - Human-readable reasoning

## Weights

Default weights:
- Skill overlap: 40%
- Experience: 30%
- Evidence quality: 30%

Weights are configurable via `weight_manager`.

## Caching

Match results are cached in `match_cache` to avoid redundant computation. Cache is invalidated when:
- Candidate evidence changes
- Job requirements change
- Scoring algorithm version changes
