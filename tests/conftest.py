import sys
import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.engine import create_engine, Connection
from sqlalchemy.orm import Session, sessionmaker, scoped_session

# Makes app importable in the test context
sys.path.append(os.getcwd())

# Perform app imports
from app.main import app  # type: ignore # pylint: disable=wrong-import-position
from app.db import Base
from app.dependancies import get_db


@pytest.fixture(scope="session")
def client():
    return TestClient(app)


engine = create_engine(
    "sqlite:///./tests/test.db", connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session")
def setup_db():
    Base.metadata.create_all(bind=engine)  # type: ignore
    yield
    Base.metadata.drop_all(bind=engine)  # type: ignore


@pytest.fixture
def db(setup_db):
    db: Session = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = db
