import { useGet, useUser } from "../hooks"
import { DrinkOrderData } from "../pages/DrinkOrderFufillment";
import { DetailFormError, DrinkData } from "../types";

export default function SelectedDrinkOrder() {

    const {user} = useUser();
    const {data, loading, error} = useGet<DrinkOrderData[], DetailFormError>("/orders/user/" + user.id)

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
            {data && <div>
                <h2 style={{borderBottom: "2xp solid black"}}>Currently Active Order</h2>
                <p>Drink Order Id: {data.at(0)?.id}</p>
                <p>Customer Name: {data.at(0)?.customerName}</p>
                <p>Order Status: {data.at(0)?.orderStatus}</p>
                <p>Time Ordered" {data.at(0)?.timeOrdered}</p>
                <p>Order Total Price: {data.at(0)?.totalPrice}</p>
                <div>
                    <p>Drinks</p>
                    <div style={{marginLeft: "2em"}}>
                        {data.at(0)?.drinks.map((drink) => {
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
            {loading && <p>Loading order data...</p>}
            {error && <p>Error getting order info. Contact a manager.</p>}
        </div>
    )
} 