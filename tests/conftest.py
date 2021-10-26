import sys
import os
from datetime import datetime
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.engine import create_engine, Connection
from sqlalchemy.orm import Session, sessionmaker, scoped_session

# Makes app importable in the test context
sys.path.append(os.getcwd())

# Perform app imports
from app.main import app  # type: ignore # pylint: disable=wrong-import-position
from app import models
from app.db import Base
from app.dependancies import get_db

engine = create_engine(
    "sqlite:///./tests/test.db", connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def db_override():
    db: Session = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(name="db")
def db_fixture():
    Base.metadata.create_all(bind=engine)  # type: ignore
    db: Session = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # We drop everything in the DB for each test run
        # This is more testable, but may result in fairly slow test runs
        Base.metadata.drop_all(bind=engine)  # type: ignore


app.dependency_overrides[get_db] = db_override


@pytest.fixture(scope="session")
def client():
    return TestClient(app)


@pytest.fixture
def user(db: Session):
    user = models.User(
        username="test",
        hashed_password="password",
        role=models.UserRole.PLAYER,
        birthdate=datetime.now(),
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    try:
        yield user
    finally:
        db.delete(user)
        db.commit()


@pytest.fixture
def tournament(user: models.User, db: Session):
    tournament = models.Tournament(
        date=datetime.now(),
        hole_count=10,
        created_by=user,
    )

    db.add(tournament)
    db.commit()
    db.refresh(tournament)
    try:
        yield tournament
    finally:
        db.delete(tournament)
        db.commit()
