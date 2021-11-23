import { useGet, useUser } from "../hooks"
import { DrinkOrderData } from "../pages/DrinkOrderFufillment";
import { DetailFormError, DrinkData } from "../types";

interface props {
    activeOrder: DrinkOrderData | undefined
}

export default function SelectedDrinkOrder({activeOrder}: props) {

    const drinkGet = useGet<DrinkData[], DetailFormError>("/drinks")
    const drinkMap: Map<number, DrinkData> = new Map();
    drinkGet.data?.forEach((drink) => {
        drinkMap.set(drink.id, drink)
    })
    function getDrinkData(id: number): DrinkData | undefined {
        return drinkMap.get(id)
    }

    return (
        <div>
            {activeOrder && <div>
                <h2 style={{borderBottom: "2xp solid black"}}>Currently Active Order</h2>
                <p>Drink Order Id: {activeOrder.id}</p>
                <p>Customer Name: {activeOrder.customerName}</p>
                <p>Order Status: {activeOrder.orderStatus}</p>
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
            </div>}
        </div>
    )
} 