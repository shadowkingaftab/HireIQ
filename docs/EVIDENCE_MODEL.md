# Evidence Model

## Concepts

Evidence is any verifiable artifact that supports a candidate's claimed capability. ProofHire treats evidence as first-class citizens rather than relying solely on self-reported information.

## Evidence Types
- `github_repo` - Public repositories
- `github_commit` - Specific commits
- `assessment_result` - Completed assessments
- `certification` - Third-party certifications
- `resume` - Parsed resume content
- `linkedin` - LinkedIn profile data

## Data Model

### Evidence
- `id` - primary key
- `candidate_id` - linked candidate
- `source_id` - linked evidence source
- `type` - evidence type
- `title` - human-readable title
- `description` - detailed description
- `url` - source URL
- `content` - JSON payload
- `verified` - verification status
- `verification_method` - how it was verified

### EvidenceSkillLink
Links evidence to specific skills with extracted proficiency and confidence.

### EvidenceSnapshot
Point-in-time snapshot of evidence to preserve historical state.

## Aggregation

The evidence pipeline:
1. Ingest raw data from sources
2. Normalize to canonical schema
3. Deduplicate across sources
4. Detect contradictions
5. Aggregate into skill-confidence pairs
6. Build explanations with provenance

## Provenance

Every piece of evidence tracks:
- Original source
- Fetch timestamp
- Verification method
- Transformation history
- Confidence/ reliability scores
