import { useState } from "react"
import DeliverDrinkOrder from "../components/DeliverDrinkOrder"
import OpenDrinkList from "../components/OpenDrinkList"
import SelectedDrinkOrder from "../components/SelectedDrinkOrder"



export default function DrinkOrderFufillment() {

    const [hasAcceptedOrder, setHasAcceptedOrder] = useState(false)
    const [orderReadyToBeDelivered, setOrderReadyToBeDelivered] = useState(false)


    return (
        <div>
            {!hasAcceptedOrder && <OpenDrinkList />}
            {hasAcceptedOrder && !orderReadyToBeDelivered && <SelectedDrinkOrder />}
            {hasAcceptedOrder && orderReadyToBeDelivered && <DeliverDrinkOrder />}
        </div>
    )
}