import { DrinkOrderData } from "../pages/DrinkOrderFufillment";

interface props {
    activeOrder: DrinkOrderData | undefined
}


export default function DeliverDrinkOrder({activeOrder}: props) {
    return (
        <p>I am the order delivery page</p>
    )
}