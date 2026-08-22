import pytest

from proofhire.backend.app.search.query_parser import QueryParser


def test_query_parser_basic():
    parser = QueryParser()
    result = parser.parse("Python developer")
    assert result.text == "Python developer"
    assert result.filters == {}


def test_query_parser_with_filters():
    parser = QueryParser()
    result = parser.parse("skill:python location:remote experience:5")
    assert result.filters["skills"] == ["python"]
    assert result.filters["location"] == "remote"
    assert result.filters["min_experience_years"] == 5
