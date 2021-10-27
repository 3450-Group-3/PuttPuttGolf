from sqlalchemy.orm import Session
from starlette.testclient import TestClient
from app import models, schemas
from app.security import AccessToken

test_out_file = file=open("test.json", mode="w+", encoding="utf-8")

def auth_token(user: models.User):
    return AccessToken.encode(data={"sub": user.username})

def create_test_drink(db: Session,  drinkName: str):
    drink = models.Drink(
        name = drinkName,
        price = 69.69,
        image_url = "this is a test url",
        description = "this is a test description"
    )

    db.add(drink)
    db.commit()
    db.refresh(drink)
    return db.query(models.Drink).where(models.Drink.name == drink.name).first()

def test_get_drinks(user: models.User, db: Session, client: TestClient):
    result = client.get("/api/drinks")
    assert result.status_code == 401

    token = auth_token(user)

    for role in models.UserRole.__members__.values():
        user.role = role
        db.commit()
        result = client.get("/api/drinks", headers={"Authorization": f"Bearer {token}"})
        assert result.status_code == 200, result.text

def test_post_drink(user: models.User, db: Session, client: TestClient): 
    result = client.post("/api/drinks")
    assert result.status_code == 401

    token = auth_token(user)
    for role in models.UserRole.__members__.values():
        user.role = role
        db.commit()
        result = client.post("/api/drinks", headers={"Authorization": f"Bearer {token}"}, json = {
            "name": "test",
            "price": 69.69,
            "imageUrl": "google.com/url.jpg",
            "description": "this is a description"
        })

        if role ==  models.UserRole.MANAGER:
            assert result.status_code == 200, result.text
        else:
            assert result.status_code == 401

def test_put_drink(user: models.User, db: Session, client: TestClient):
    result = client.get("/api/drinks")
    assert result.status_code == 401

    token = auth_token(user)
    create_test_drink(db, "testDrink")

    for role in models.UserRole.__members__.values():
        user.role = role
        db.commit()
        result = client.put("/api/drinks", headers={"Authorization": f"Bearer {token}"}, json = {
            "name": "testDrink",
            "price": 69.69,
            "imageUrl": "google.com/url.jpg",
            "description": "this is a different description"
        })
        if role ==  models.UserRole.MANAGER:
            assert result.status_code == 200, "this is a different description" in result.text 
            assert result.status_code == 401

def test_delete_drink(user: models.User, db: Session, client: TestClient):
    result = client.post("/api/drinks")
    assert result.status_code == 401

    token = auth_token(user)
    drink = create_test_drink(db, "testDrink")

    for role in models.UserRole.__members__.values():
        user.role = role
        db.commit()
        result = client.delete(f"/api/drinks/{drink.id}", headers={"Authorization": f"Bearer {token}"})

        if role == models.UserRole.MANAGER:
            assert result.status_code == 200, result.text
            result = client.get("/api/drinks", headers={"Authorization": f"Bearer {token}"})
            assert "testDrink" not in result.text
        else:
            assert result.status_code == 401




