# Skill Graph

## Purpose

The skill graph models relationships between skills to enable:
- Skill gap analysis
- Learning path recommendations
- Capability inference
- Similarity matching

## Graph Structure

### Nodes (Skills)
- `id` - canonical skill identifier
- `name` - display name
- `category` - skill category
- `description` - detailed description

### Edges (Relationships)
- `from_skill_id` - source skill
- `to_skill_id` - target skill
- `relation_type` - relationship type
  - `required_by` - target requires source
  - `subset_of` - source is subset of target
  - `related` - general relationship
  - `prerequisite` - source needed before target

## Algorithms

### Centrality
Identifies core skills in the graph using betweenness centrality.

### Similarity
- Jaccard similarity for skill sets
- Cosine similarity for vector embeddings

### Gap Analysis
Compares candidate skills against job requirements and suggests:
- Missing skills
- Related skills to fill gaps
- Learning progression paths

## Visualization

The frontend renders the graph using:
- Canvas-based rendering for performance
- Force-directed layout
- Interactive filtering and zoom
