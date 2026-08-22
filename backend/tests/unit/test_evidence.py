import pytest

from proofhire.backend.app.evidence.validator import Validator


def test_validator_returns_true():
    validator = Validator()
    assert validator.validate(evidence_data={"source": "github"}) is True


def test_validator_empty_data():
    validator = Validator()
    assert validator.validate(evidence_data={}) is True
