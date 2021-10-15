import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.append(os.getcwd())

from app.main import app  # type: ignore # pylint: disable=wrong-import-position
from app.db import SessionLocal


@pytest.fixture(scope="session")
def client():
    return TestClient(app)


@pytest.fixture()
def db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
