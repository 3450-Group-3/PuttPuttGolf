import styled from "styled-components";
import { usePost } from "../hooks";
import { Button } from "../styles";
import { DetailFormError } from "../types";

interface Props {
    drinkMap: Map<number, number>
}

interface drinkSelection {
    drinkID: number
    drinkQty: number
}

const Drink = styled.div`
    border: 1px solid black
`

interface DrinkOrder {
    id: number
    customer_id: number
    order_status: number
    time_ordered: string
    total_price: number
    drinks: drinkSelection[]
    location: {
        lattitude: number
        longitude: number
    }
}


export default function DrinkCart({drinkMap} : Props) {
    
    const[{data, loading, error}, submitOrder] = usePost<DrinkOrder, DetailFormError>("/drinks")

    function placeOrder() {
        submitOrder({
            data: {
                drinks: [ drinks.map((drink) => {
                    return {
                        drinkId: drink.drinkID,
                        quantity: drink.drinkQty
                    }
                })],
                location: {
                    longitude: 69,
                    lattitude: 420
                }
            }
        }).then(({data}) => {
            console.log(data)
        })
    }

    const drinks: drinkSelection[] = [];

    drinkMap.forEach((value, key) => {
        // console.log("key value" + key + "value value" + value)
        drinks.push({
            drinkID: key,
            drinkQty: value
        })
    })

    // console.log(drinkMap)
    // console.log(drinks)
    
    return (
        <div>
            {drinks.map((drinkOrder, counter) => {
                return (
                    <Drink key={drinkOrder.drinkID}>
                        <p>Item number: {counter}</p>
                        <p>Drink ID: {drinkOrder.drinkID}</p>
                        <p>Drink Qty: {drinkOrder.drinkQty}</p>
                    </Drink>
                )
            })}
            <Button onClick={() => {placeOrder()}}>Place Order</Button>
        </div>
    )

}