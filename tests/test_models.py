from datetime import datetime
import pytest
from sqlalchemy.orm import Session
from app import models


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


class TestUserModel:
    def test_creation(self, user: models.User):
        assert user.id == 1

    def test_role(self, user: models.User):
        assert user.has_role(models.UserRole.PLAYER)
        assert user.is_player
        assert not user.is_drink_meister
        assert not user.is_sponsor
        assert not user.is_manager

    def test_update_balance(self, user: models.User, db: Session):
        assert user.balance == 0
        user.update_balance(5, db)
        assert user.balance == 5

        with pytest.raises(AssertionError):
            user.update_balance("string", db)  # type: ignore


class TestTournamentModel:
    def test_enrollments(
        self, user: models.User, tournament: models.Tournament, db: Session
    ):
        tournament.add_user(db, user)
        assert len(user.enrollments) == 1
        assert len(tournament.enrollments) == 1
        tournament.remove_user(db, user)
        assert len(user.enrollments) == 0
        assert len(tournament.enrollments) == 0

    def test_increment_score(
        self, user: models.User, tournament: models.Tournament, db: Session
    ):
        tournament.add_user(db, user)
        tournament.increment_score(db, user, 5)
        assert user.enrollments[0].score == 5

        tournament.remove_user(db, user)
        with pytest.raises(ValueError):
            tournament.increment_score(db, user, 5)
