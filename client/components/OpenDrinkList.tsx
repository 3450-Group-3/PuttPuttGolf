import { useState } from "react"
import styled from "styled-components"
import { useGet, usePost } from "../hooks"
import { DrinkOrderData, DrinkOrderState } from "../pages/DrinkOrderFufillment"
import { Button } from "../styles"
import { DetailFormError } from "../types"
import { DrinkData } from "../types"


const DrinkContainer = styled.div`
    border: 1px solid red;
    margin-left: 3em;
`

const Order = styled.div`
    border: 1px solid black;
    margin: 1em;
`

interface props {
    setHasActiveOrder: React.Dispatch<React.SetStateAction<boolean>>
}

export default function OpenDrinkList({setHasActiveOrder}: props) { 

    const orderGet = useGet<DrinkOrderData[], DetailFormError>("/orders/state/" + DrinkOrderState.OPEN)
    const [response, accecptOrder] = usePost<DrinkData, DetailFormError>("/orders/claimorder")
    
    function handleAcceptOrder(id: number) {
        accecptOrder({
            params: {
                id: id
            }
        }).then((data) => {
            setHasActiveOrder(true)
        })
    }
    
    const drinkGet = useGet<DrinkData[], DetailFormError>("/drinks")
    const drinkMap: Map<number, DrinkData> = new Map();
    drinkGet.data?.forEach((drink) => {
        drinkMap.set(drink.id, drink)
    })
    function getDrinkData(id: number): DrinkData | undefined {
        return drinkMap.get(id)
    }


    const status = ["OPEN", "INPROGRESS", "ENROUTE", "DELIVERED"]

    if (!orderGet.data || orderGet.data.length == 0){
        return (
            <h2>No open orders at this time</h2>
        )
    }

    return (
        <div>
        {orderGet.data.map((drinkOrder) => {
            return (
                <Order key={drinkOrder.id}>
                <p>Order id: {drinkOrder.id}</p>
                <p>Customer Name: {drinkOrder.customerName}</p>
                <p>Status: {status[drinkOrder.orderStatus - 1]}</p>
                <p>Time Ordered: {drinkOrder.timeOrdered}</p>
                <p>Drinks:</p>
                {drinkOrder.drinks.map((drink) => {
                    const drinkData = getDrinkData(drink.drinkId)
                    if (drinkData){
                        return (
                            <DrinkContainer key={drinkData.id}>
                                    <p>Drink Name: {drinkData.name}</p>
                                    <p>Amount: {drink.quantity}</p>
                                </DrinkContainer>
                            )
                        }
                    })}
                    <div style={{textAlign: "center"}}>
                        <Button onClick={() => {
                            handleAcceptOrder(drinkOrder.id)
                        }}>Accept Order</Button> 
                    </div>
                    </Order>
                )
            }
        )}
        </div>
    )
}