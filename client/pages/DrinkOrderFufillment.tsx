import { useState } from "react"
import DeliverDrinkOrder from "../components/DeliverDrinkOrder"
import OpenDrinkList from "../components/OpenDrinkList"
import SelectedDrinkOrder from "../components/SelectedDrinkOrder"
import { useGet, useUser } from "../hooks"
import { DetailFormError, DrinkData } from "../types"


interface DrinkOrderQuantity {
    drinkId: number,
    drinkQty: number
}

interface UserLocation {
    longitude: number,
    lattitude: number
}

export interface DrinkOrderData {
    id: number
    customerId: number
    customerName: string
    orderStatus: DrinkOrderState
    timeOrdered: string
    totalPrice: number
    drinks: DrinkOrderQuantity[]
    location: UserLocation
    drinkMeisterId: number 
}

export enum DrinkOrderState {
    OPEN = 1,
    INPROGRESS = 2,
    ENROUTE = 3,
    DELIVERED = 4
}


export default function DrinkOrderFufillment() {

    const [hasAcceptedOrder, setHasAcceptedOrder] = useState(false)
    const [orderReadyToBeDelivered, setOrderReadyToBeDelivered] = useState(false)
    const {user} = useUser()

    const {data, loading, error} = useGet<DrinkOrderData[], DetailFormError>("/orders/user/" + user.id)

    console.log(data)

    if (!hasAcceptedOrder && data){
        if (data.length > 0){
            setHasAcceptedOrder(true)
            if (!orderReadyToBeDelivered){
                if (data[0].orderStatus == DrinkOrderState.ENROUTE){
                    setOrderReadyToBeDelivered(true)
                }
            }
        }
    }


    return (
        <div>
            {!hasAcceptedOrder && <OpenDrinkList setHasActiveOrder={setHasAcceptedOrder}/>}
            {hasAcceptedOrder && !orderReadyToBeDelivered && <SelectedDrinkOrder />}
            {hasAcceptedOrder && orderReadyToBeDelivered && <DeliverDrinkOrder />}
        </div>
    )
}