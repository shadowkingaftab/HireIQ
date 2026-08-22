# Sandbox Policy

## Purpose
Sandboxed execution for code assessments and untrusted code.

## Rules
- No network access
- Limited CPU and memory
- Process isolation
- Timeout enforcement
- Filesystem isolation

## Enforcement
Docker-based sandbox with seccomp and AppArmor profiles.
