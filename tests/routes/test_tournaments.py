from datetime import datetime
from sqlalchemy.orm import Session
from starlette.testclient import TestClient
from app import models, schemas
from app.security import AccessToken


def auth_token(user: models.User):
    return AccessToken.encode(data={"sub": user.username})


def create_test_tournament(db: Session, user: models.User):
    tournament = models.Tournament(
        date=datetime.now(),
        hole_count=10,
        balance=0,
        completed=False,
        created_by=user,
    )

    db.add(tournament)
    db.commit()
    db.refresh(tournament)

    return tournament


def create_tournament_json(tournament: models.Tournament):
    return {
        "id": tournament.id,
        "date": str(tournament.date),
        "hole_count": tournament.hole_count,
        "balance": tournament.balance,
        "completed": tournament.completed,
        "advertising_banner": tournament.advertising_banner,
        "created_by": {
            "id": tournament.created_by.id,
            "username": tournament.created_by.username,
            "birthdate": str(tournament.created_by.birthdate),
            "role": tournament.created_by.role.value,
            "balance": tournament.created_by.balance,
        },
    }


def test_create_tournament(user: models.User, db: Session, client: TestClient):
    res = client.post(
        "/api/tournaments",
        json={"date": str(datetime.now()), "holeCount": 10},
    )

    assert res.status_code == 401

    token = auth_token(user)

    for role in models.UserRole.__members__.values():
        user.role = role
        db.commit()

        res = client.post(
            "/api/tournaments",
            json={"date": str(datetime.now()), "holeCount": 10},
            headers={"Authorization": f"Bearer {token}"},
        )

        if role == models.UserRole.MANAGER:
            assert res.status_code == 200, res.text
            assert res.json()["id"], res.json()
            assert db.query(models.Tournament).get(
                res.json()["id"]
            ), "Tournament was not created"

        else:
            assert res.status_code == 401, res.text


def test_list_tournaments(user: models.User, db: Session, client: TestClient):
    res = client.get("/api/tournaments")

    assert res.status_code == 401

    token = auth_token(user)

    res = client.get(
        "/api/tournaments",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200, res.text


def test_update_tournament(user: models.User, db: Session, client: TestClient):
    tournament = create_test_tournament(db, user)
    token = auth_token(user)

    for role in models.UserRole.__members__.values():
        user.role = role
        db.commit()

        tournament_json = create_tournament_json(tournament)
        tournament_json["completed"] = True

        res = client.put(
            f"/api/tournaments/{tournament.id}",
            json=tournament_json,
            headers={"Authorization": f"Bearer {token}"},
        )

        if role == models.UserRole.MANAGER:
            assert res.status_code == 200, res.text
            assert res.json()["completed"] == True, res.text
        else:
            assert res.status_code == 401, res.text


def test_get_tournament(user: models.User, db: Session, client: TestClient):
    tournament = create_test_tournament(db, user)
    token = auth_token(user)

    res = client.get(
        f"api/tournaments/{tournament.id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200, res.text


def test_delete_tournament(user: models.User, db: Session, client: TestClient):
    tournament = create_test_tournament(db, user)
    token = auth_token(user)

    for role in models.UserRole.__members__.values():
        user.role = role
        db.commit()

        res = client.delete(
            f"/api/tournaments/{tournament.id}",
            headers={"Authorization": f"Bearer {token}"},
        )

        if role == models.UserRole.MANAGER:
            assert res.status_code == 200, res.text
        else:
            assert res.status_code == 401, res.text


def test_add_user(user: models.User, db: Session, client: TestClient):
    tournament = create_test_tournament(db, user)
    token = auth_token(user)

    res = client.post(
        f"/api/tournaments/{tournament.id}/add_user",
        json={"userId": user.id},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200, res.text
    assert len(user.enrollments) == 1
    assert len(tournament.enrollments) == 1


def test_remove_user(user: models.User, db: Session, client: TestClient):
    tournament = create_test_tournament(db, user)
    tournament.add_user(db, user)

    token = auth_token(user)

    res = client.post(
        f"/api/tournaments/{tournament.id}/remove_user",
        json={"userId": user.id},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200, res.text
    assert len(user.enrollments) == 0, res.text
    assert len(tournament.enrollments) == 0, res.text


def test_update_score(user: models.User, db: Session, client: TestClient):
    tournament = create_test_tournament(db, user)
    tournament.add_user(db, user)

    token = auth_token(user)

    res = client.post(
        f"/api/tournaments/{tournament.id}/update_score",
        json={"score": 10, "userId": user.id},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200, res.text
    assert user.enrollments[0].score == 10, res.text

    # Properly increments/decrements score, not sets it
    res = client.post(
        f"/api/tournaments/{tournament.id}/update_score",
        json={"score": -2, "userId": user.id},
        headers={"Authorization": f"Bearer {token}"},
    )

    db.refresh(user)

    assert res.status_code == 200, res.text
    assert user.enrollments[0].score == 8, res.text
