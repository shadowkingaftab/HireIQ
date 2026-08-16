# Dependency Policy

## Requirements

- All dependencies must be reviewed before addition
- Prefer well-maintained, widely-used libraries
- Check license compatibility (MIT, Apache, BSD preferred)
- Run security audit before merging

## Process

1. Propose dependency in PR with justification
2. Check for known vulnerabilities
3. Verify license compatibility
4. Add to requirements.txt with pinned version
5. Schedule regular updates

## Audit Schedule

- Daily: automated vulnerability scans in CI
- Weekly: dependency review
- Monthly: major version updates assessment

## Prohibited

- Unmaintained packages
- Packages with viral licenses (GPL, AGPL)
- Packages with critical unpatched vulnerabilities

## Tools

- Python: `safety check`, `pip-audit`
- Node.js: `npm audit`
- GitHub: Dependabot, CodeQL
