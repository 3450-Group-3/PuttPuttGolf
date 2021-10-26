from sqlalchemy.orm import Session
from starlette.testclient import TestClient
from app import models, schemas
import sys
from app.security import AccessToken

test_out_file = file=open("test.json", mode="w+", encoding="utf-8")

def auth_token(user: models.User):
    return AccessToken.encode(data={"sub": user.username})

def test_get_drinks(user: models.User, db: Session, client: TestClient):
    result = client.get("/api/drinks")
    assert result.status_code == 401

    token = auth_token(user)

    for role in models.UserRole.__members__.values():
        user.role = role
        db.commit()
        result = client.get("/api/drinks", headers={"Authorization": f"Bearer {token}"})
        assert result.status_code == 200, result.text

def test_post_drink(user: models.User, db: Session, client: TestClient): #todo ask sean about db sessions and persistance
    result = client.post("/api/drinks")
    print(result.text, file=test_out_file)
    assert result.status_code == 401

    token = auth_token(user)


    for role in models.UserRole.__members__.values():
        user.role = role
        db.commit()
        result = client.post("/api/drinks", headers={"Authorization": f"Bearer {token}"}, json = {
            "name": "testname3",
            "price": 69.69,
            "image_url": "google.com/url.jpg",
            "description": "this is a description"
        })
        print(result.text, file = test_out_file)
        if role ==  models.UserRole.MANAGER:
            assert result.status_code == 200, result.text
        else:
            assert result.status_code == 401

def test_put_drink(user: models.User, db: Session, client: TestClient):
    result = client.get("/api/drinks")
    assert result.status_code == 401

    token = auth_token(user)

    for role in models.UserRole.__members__.values():
        user.role = role
        db.commit()
        result = client.put("/api/drinks", headers={"Authorization": f"Bearer {token}"}, json = {
            "name": "testname3",
            "price": 69.69,
            "image_url": "google.com/url.jpg",
            "description": "this is a different description"
        })
        print(result.text, file = test_out_file)
        if role ==  models.UserRole.MANAGER:
            assert result.status_code == 200, result.text #todo check for updated description
        else:
            assert result.status_code == 401

def test_delete_drink(user: models.User, db: Session, client: TestClient):
    result = client.post("/api/drinks")
    assert result.status_code == 401

    token = auth_token(user)

    for role in models.UserRole.__members__.values():
        user.role = role
        db.commit()
        result = client.delete("/api/drinks", headers={"Authorization": f"Bearer {token}"}, json={
            "name": "testname3"
        })
        assert result.status_code == 200, result.text

        result = client.get("/api/drinks", headers={"Authorization": f"Bearer {token}"})
        assert not result.text.contains("testname3") 




