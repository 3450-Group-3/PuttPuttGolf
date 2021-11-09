import { useState } from "react";
import styled from "styled-components";
import { useGet, usePost } from "../hooks";
import { Button } from "../styles";
import { DetailFormError, DrinkData } from "../types";
import { Pair } from "../utils";

interface Props {
    drinkMap: Map<number, Pair<DrinkData, number>>
}

interface drinkSelection {
    drinkID: number
    drinkQty: number,
    drinkName: string
}

const CartItem = styled.div`
    border: 1px solid black;
    margin-bottom: 2em;
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
    
    const[{data, loading, error}, submitOrder] = usePost<DrinkOrder, DetailFormError>("/orders")
    const [successfullyPlacedOrder, setSuccessfullyPlaceOrder] = useState(false);

    function placeOrder() {
        submitOrder({
            data: {
                drinks: drinks.map((drink) => {
                    return {
                        drinkId: drink.drinkID,
                        quantity: drink.drinkQty
                    }
                }),
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
            drinkQty: value.second,
            drinkName: value.first.name
        })
    })

    // console.log(drinkMap)
    // console.log(drinks)
    
    return (
        <div>
            {drinks.map((drinkOrder, counter) => {
        
                return (
                    <CartItem key={drinkOrder.drinkID}>
                        <p>Drink: {drinkOrder.drinkName}</p>
                        <p>Qty: {drinkOrder.drinkQty}</p>
                        <Button style={{marginLeft: "auto", marginRight: 0}}>Remove</Button>
                    </CartItem>
                )
            })}
            <Button onClick={() => {placeOrder()}}>Place Order</Button>
        </div>
    )

}