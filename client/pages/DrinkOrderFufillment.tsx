import { useState } from "react"
import DeliverDrinkOrder from "../components/DeliverDrinkOrder"
import OpenDrinkList from "../components/OpenDrinkList"
import SelectedDrinkOrder from "../components/SelectedDrinkOrder"
import { useGet, useUser } from "../hooks"
import { DetailFormError, DrinkData } from "../types"


interface DrinkOrderQuantity {
    drinkId: number,
    quantity: number
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
    const [drinkFullfillmentRefreshOrder, setDrinkFullfillmentRefreshOrder] = useState(false)

    function refreshOrderData() {
        setDrinkFullfillmentRefreshOrder(!drinkFullfillmentRefreshOrder)
    }

    const [activeOrder, setActiveOrder] = useState<DrinkOrderData>()

    const {data, loading, error} = useGet<DrinkOrderData[], DetailFormError>("/orders/user/" + user.id)

    

    if (!hasAcceptedOrder && data){
        if (data.length > 0){
            setActiveOrder(data[0])
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
            {!hasAcceptedOrder && <OpenDrinkList setHasActiveOrder={setHasAcceptedOrder} refreshOrderData={refreshOrderData} setActiveOrder={setActiveOrder}/>}
            {hasAcceptedOrder && !orderReadyToBeDelivered && <SelectedDrinkOrder activeOrder={activeOrder} setActiveOrder={setActiveOrder} setOrderReadyToBeDelivered={setOrderReadyToBeDelivered}/>}
            {hasAcceptedOrder && orderReadyToBeDelivered && <DeliverDrinkOrder />}
        </div>
    )
}