from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm.session import Session
from starlette import status
from starlette.responses import JSONResponse
from app.dependancies import current_user_is_drinkmeister, get_current_user, get_db, current_user_is_manager
from app import schemas, models
import json



orders = APIRouter(prefix="/orders", tags=["Drink Orders"])

@orders.get(
    "", response_model=list[schemas.DrinkOrderOut], dependencies=[Depends(current_user_is_drinkmeister)]
)
def list_all_orders(db: Session = Depends(get_db)):
    return db.query(models.DrinkOrder).all()


@orders.get(
    "/{id}", response_model=schemas.DrinkOrderOut, dependencies=[Depends(current_user_is_drinkmeister)]
)
def get_single_order(id: int, db: Session = Depends(get_db)):
    return db.query(models.DrinkOrder).where(models.DrinkOrder.id == id).first()


@orders.get(
    "/user/{id}", response_model=list[schemas.DrinkOrderOut], dependencies=[Depends(current_user_is_drinkmeister)]
)
def get_customer_orders(id: int, db: Session = Depends(get_db)):
    user: models.User = db.query(models.User).where(models.User.id == id).first()
    if (user.is_drink_meister):
        return db.query(models.DrinkOrder).where(models.DrinkOrder.drink_meister_id == id).all()
        
    return db.query(models.DrinkOrder).where(models.DrinkOrder.customer_id == id).all()


@orders.get(
    "/state/{state}", response_model=list[schemas.DrinkOrderOut], dependencies=[Depends(current_user_is_drinkmeister)]
)
def get_order_by_state(state: int, db: Session = Depends(get_db)):
    try:
        state = models.DrinkOrderState(state)
    except ValueError as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail" : str(state) + " is not a valid DrinkOrderState. Valid states are OPEN = 1, INPROGRESS = 2, ENROUTE = 3, DELIVERED = 4"}
        )
    return db.query(models.DrinkOrder).where(models.DrinkOrder.order_status == state).all()


@orders.post(
    "", response_model=schemas.DrinkOrderOut
)
def create_order(order_data: schemas.DrinkOrderIn, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if (user.is_drink_meister):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": "Drink Meisters are unable to place orders"}
        )

    price = 0
    for drink in order_data.drinks:
        price += db.query(models.Drink).where(models.Drink.id == drink.drinkId).first().price * drink.quantity
    
    order = models.DrinkOrder(
        customer_id = user.id,
        order_status = models.DrinkOrderState.OPEN,
        time_ordered = datetime.now(),
        total_price = price,
        drinks_json = json.dumps([
            { 
                "drinkId" : order_data.drinks[i].drinkId,
                "quantity" : order_data.drinks[i].quantity
            } for i in range(len(order_data.drinks))
        ]),
        location_json = json.dumps({
            "lattitude" : order_data.location.lattitude,
            "longitude" : order_data.location.longitude
        })
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return order

@orders.post(
    "/{id}", response_model=schemas.DrinkOrderOut
)
def assign_dm_to_order(id: int, drinkmeister: Depends(current_user_is_drinkmeister), db: Session = Depends(get_db)):
    order: models.DrinkOrder = db.query(models.DrinkOrder).where(models.DrinkOrder.id == id).first()
    if (order.drink_meister_id):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": "This order has already been claimed by another drinkmeister"}
        )

    order.drink_meister_id = drinkmeister.id

    db.commit()
    db.refresh(order)

    return order


@orders.put(
    "/{id}/status", response_model=schemas.DrinkOrderOut, dependencies=[Depends(current_user_is_drinkmeister)]
)
def update_order_status(id: int, order_data: schemas.DrinkOrderStatusUpdateIn, db: Session = Depends(get_db)):
    order: models.DrinkOrder = db.query(models.DrinkOrder).where(models.DrinkOrder.id == id).first()

    if order.order_status.value != (order_data.order_status.value - 1):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail" : "Attempting to update an order status by more than 1 state"}
        )

    order.order_status = order_data.order_status
    db.commit()
    db.refresh(order)

    if (order.order_status == models.DrinkOrderState.DELIVERED):
        order.delete()
        db.commit()

    return order


@orders.put(
    "/{id}/location", response_model=schemas.DrinkOrderOut
)
def update_order_customer_location(
    id: int, 
    order_data: schemas.UserLocation , 
    user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    order: models.DrinkOrder = db.query(models.DrinkOrder).where(models.DrinkOrder.id == id).first()

    if (order.customer_id != user.id):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail" : "Attempting to update another users order, aborting."}
        )
    
    order.location_json = json.dumps({
            "lattitude" : order_data.lattitude,
            "longitude" : order_data.longitude
    })
    db.commit()
    db.refresh(order)

    return order

@orders.delete(
    "/{id}", dependencies=[Depends(current_user_is_manager)]
)
def delete_order(id: int, db: Session = Depends(get_db)):
    db.query(models.DrinkOrder).where(models.DrinkOrder.id == id).delete()
    db.commit()

