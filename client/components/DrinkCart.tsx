import { useState } from "react";
import { Redirect } from "react-router";
import styled from "styled-components";
import { usePost } from "../hooks";
import { Button } from "../styles";
import { DetailFormError, DrinkData } from "../types";
import { Pair } from "../utils";

interface Props {
    drinkMap: Map<number, Pair<DrinkData, number>>,
    setViewCart: React.Dispatch<React.SetStateAction<boolean>>
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


export default function DrinkCart({drinkMap, setViewCart} : Props) {
    
    const [{data, loading, error}, submitOrder] = usePost<DrinkOrder, DetailFormError>("/orders")
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
            drinkMap.clear()
            setSuccessfullyPlaceOrder(true)
            setTimeout(() => {setViewCart(false)}, 2000)
        })
    }

    const [dummy, setDummy] = useState(false);

    const drinks : drinkSelection[] = [];

    drinkMap.forEach((value, key) => {
        drinks.push({
            drinkID: key,
            drinkQty: value.second,
            drinkName: value.first.name
        })
    })

    function removeDrink(drinkOrder: drinkSelection) {
        drinkMap.delete(drinkOrder.drinkID);
        setDummy(!dummy)
    }
    
    console.log("Drinks before map", drinks)

    return (
        <div>
            {drinks.map((drinkOrder, counter) => {
        
                return (
                    <CartItem key={drinkOrder.drinkID}>
                        <p>Drink: {drinkOrder.drinkName}</p>
                        <p>Qty: {drinkOrder.drinkQty}</p>
                        <Button style={{marginLeft: "auto", marginRight: 0}} onClick={() => {removeDrink(drinkOrder)}}>Remove</Button>
                    </CartItem>
                )
            })}
            <Button onClick={() => {placeOrder()}}>Place Order</Button>
            {successfullyPlacedOrder && <h2>Successfully placed your order</h2>}
        </div>
    )

}