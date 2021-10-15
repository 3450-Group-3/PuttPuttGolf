from app import models
from sqlalchemy.orm import Session


class TestUserModel:
    def test_creation(self, db: Session):
        user = models.User(
            username="test", hashed_password="password", role=models.UserRole.PLAYER
        )

        db.add(user)
