import { useGet, useUser } from "../hooks"
import { DrinkOrderData } from "../pages/DrinkOrderFufillment";
import { DetailFormError } from "../types";

export default function SelectedDrinkOrder() {

    const {user} = useUser();
    const {data, loading, error} = useGet<DrinkOrderData[], DetailFormError>("/orders/user/" + user.id)

    return (
        <div>
            {data && <div>
                <p>Drink Order Id: {data.at(0)?.id}</p>
                <p>Customer Name: {data.at(0)?.customerName}</p>
                <p>Order Status: {data.at(0)?.orderStatus}</p>
                <p>Time Ordered" {data.at(0)?.timeOrdered}</p>
                <p>Order Total Price: {data.at(0)?.totalPrice}</p>
                <p>Drinks
                    <div style={{marginLeft: "2em"}}>
                        {data.at(0)?.drinks.map((drink) => {
                                return 
                            })}
                    </div>
                </p>
            </div>}
            {loading && <p>Loading order data...</p>}
        </div>
    )
} 