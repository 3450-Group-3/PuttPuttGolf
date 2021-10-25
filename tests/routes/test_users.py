import datetime
from sqlalchemy.orm import Session
from starlette.testclient import TestClient
from app import models, schemas
from app.security import AccessToken


def auth_token(user: models.User):
    return AccessToken.encode(data={"sub": user.username})


def test_list_users(user: models.User, db: Session, client: TestClient):
    # Test no-login
    res = client.get("/api/users")
    assert res.status_code == 401

    token = auth_token(user)

    # Test each non-manager role
    for role in models.UserRole.__members__.values():
        user.role = role
        db.commit()
        res = client.get("/api/users", headers={"Authorization": f"Bearer {token}"})
        if role == models.UserRole.MANAGER:
            assert res.status_code == 200, res.text
            assert res.json()[0]["id"] == user.id, res.text
        else:
            assert res.status_code == 401, res.text


def test_get_user(user: models.User, db: Session, client: TestClient):
    # Not logged in
    res = client.get("/api/users/me")
    assert res.status_code == 401, res.text

    # User can view themselves with /me
    token = auth_token(user)
    res = client.get("/api/users/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200, res.text
    assert res.json()["id"] == user.id

    # User can view themselves with their id
    res = client.get(
        f"/api/users/{user.id}", headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200, res.text
    assert res.json()["id"] == user.id

    manager = models.User(
        username="manager",
        hashed_password="password",
        birthdate=datetime.datetime.now(),
        role=models.UserRole.MANAGER,
    )
    db.add(manager)
    db.commit()
    db.refresh(manager)

    # Regular User cannot view others users
    res = client.get(
        f"/api/users/{manager.id}", headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 401

    # Manager can view other users
    res = client.get(
        f"/api/users/{user.id}",
        headers={"Authorization": f"Bearer {auth_token(manager)}"},
    )
    assert res.status_code == 200, res.text
    assert res.json()["id"] == user.id


def test_create_user(db: Session, client: TestClient):
    res = client.post(
        "/api/users",
        json={
            "username": "test-user",
            "birthdate": str(datetime.datetime.now()),
            "password": "password",
        },
    )

    assert res.status_code == 200, res.text
    assert res.json()["id"], res.json()
    assert db.query(models.User).get(res.json()["id"]), "User was not created"

    # Usernames can't collide
    res = client.post(
        "/api/users",
        json={
            "username": "test-user",
            "birthdate": str(datetime.datetime.now()),
            "password": "password",
        },
    )

    assert res.status_code == 400


def test_update_user(user: models.User, client: TestClient, db: Session):
    res = client.put(
        f"/api/users/{user.id}",
        json={
            "id": user.id,
            "username": "new_username",
            "birthdate": str(datetime.datetime.now()),
            "role": user.role.value,
        },
        headers={"Authorization": f"Bearer {auth_token(user)}"},
    )

    assert res.status_code == 200, res.text
    assert res.json()["username"] == "new_username"

    manager = models.User(
        username="manager",
        hashed_password="password",
        birthdate=datetime.datetime.now(),
        role=models.UserRole.MANAGER,
    )
    db.add(manager)
    db.commit()
    db.refresh(manager)

    res = client.put(
        f"/api/users/{user.id}",
        json={
            "id": user.id,
            "username": "third_username",
            "birthdate": str(datetime.datetime.now()),
            "role": user.role.value,
        },
        headers={"Authorization": f"Bearer {auth_token(manager)}"},
    )

    assert res.status_code == 200, res.text


def test_delete_user(user: models.User, client: TestClient, db: Session):
    res = client.delete(
        f"/api/users/{user.id}",
        headers={"Authorization": f"Bearer {auth_token(user)}"},
    )
    assert res.status_code == 200, res.text
