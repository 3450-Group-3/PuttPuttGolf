import { useGet, usePost, usePut, useUser } from "../hooks"
import { DrinkOrderData, DrinkOrderState } from "../pages/DrinkOrderFufillment";
import { Button } from "../styles";
import { DetailFormError, DrinkData } from "../types";

interface props {
    activeOrder: DrinkOrderData | undefined,
    setActiveOrder: React.Dispatch<React.SetStateAction<DrinkOrderData | undefined>>,
    setOrderReadyToBeDelivered: React.Dispatch<React.SetStateAction<boolean>>

}

export default function SelectedDrinkOrder({activeOrder, setActiveOrder, setOrderReadyToBeDelivered}: props) {

    const [response, deliverOrder] = usePut<DrinkOrderData, DetailFormError>("/orders/status")

    function handleDeliverOrder() {
        deliverOrder({
            data: {
                id: activeOrder?.id,
                orderStatus: DrinkOrderState.ENROUTE
            }
        }).then((data) => {
            setActiveOrder(data.data)
            setOrderReadyToBeDelivered(true)
        })
    }

    const drinkGet = useGet<DrinkData[], DetailFormError>("/drinks")
    const drinkMap: Map<number, DrinkData> = new Map();
    drinkGet.data?.forEach((drink) => {
        drinkMap.set(drink.id, drink)
    })
    function getDrinkData(id: number): DrinkData | undefined {
        return drinkMap.get(id)
    }

    const status = ["OPEN", "INPROGRESS", "ENROUTE", "DELIVERED"]

    return (
        <div>
            {activeOrder && <div>
                <h2 style={{borderBottom: "2xp solid black"}}>Currently Active Order</h2>
                <p>Drink Order Id: {activeOrder.id}</p>
                <p>Customer Name: {activeOrder.customerName}</p>
                <p>Order Status: {status[activeOrder.orderStatus - 1]}</p>
                <p>Time Ordered" {activeOrder.timeOrdered}</p>
                <p>Order Total Price: {activeOrder.totalPrice}</p>
                <div>
                    <p>Drinks</p>
                    <div style={{marginLeft: "2em"}}>
                        {activeOrder.drinks.map((drink) => {
                            const drinkData = getDrinkData(drink.drinkId)
                            return (
                                <div style={{marginLeft: "2em", marginBottom: "1em", paddingLeft: "2em", borderLeft: "2px solid black"}} key={drink.drinkId}>
                                    <p>Drink Name: {drinkData?.name}</p>
                                    <p>Quantity: {drink.quantity}</p>
                                </div>
                            )
                        })}
                    </div>  
                </div>
                <Button onClick={() => {
                    handleDeliverOrder()
                }}>Deliver Order</Button>
            </div>}
        </div>
    )
} 