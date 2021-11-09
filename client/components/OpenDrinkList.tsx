import styled from "styled-components"
import { useGet } from "../hooks"
import { DrinkOrderData, DrinkOrderState } from "../pages/DrinkOrderFufillment"
import { DetailFormError } from "../types"
import { DrinkData } from "../types"


const DrinkContainer = styled.div`
    border: 1px solid black
`



export default function OpenDrinkList() { //todo move fetching of data to drinkorderfullfillment component

    function getDrinkData(id: number): DrinkData | undefined {
        const {data, loading, error} = useGet<DrinkData, DetailFormError>("/drinks/" + id)
        return data;
    }

    const {data, loading, error} = useGet<DrinkOrderData[], DetailFormError>("/orders/state/" + DrinkOrderState.OPEN)
    const status = ["OPEN", "INPROGRESS", "ENROUTE", "DELIVERED"]

    console.log(data)

    if (!data || data.length == 0){
        return (
            <h2>No open orders at this time</h2>
        )
    }

    return (
        <div>
            {data.map((drinkOrder) => {
                return (
                    <div key={drinkOrder.id}>
                        <p>Order id {drinkOrder.id}</p>
                        <p>customer id {drinkOrder.customer_id}</p>
                        <p>status {status[drinkOrder.order_status]}</p>
                        <p>time ordered {drinkOrder.time_ordered}</p>
                        <p>Drinks</p>
                        {drinkOrder.drinks.map((drink) => {
                            const drinkData = getDrinkData(drink.drinkId)
                            if (drinkData){
                                return (
                                    <DrinkContainer key={drinkData.id}>
                                        <p>Drink Name {drinkData.name}</p>
                                        <p>AMount {drink.drinkQty}</p>
                                    </DrinkContainer>
                                )
                            }
                        })}
                        <p>DrinkMeister assigned {drinkOrder.drink_meister_id}</p>
                    </div>
                )
            })}
        </div>
    )
}