import styled from "styled-components";

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

export default function DrinkCart({drinkMap} : Props) {
    
    const drinks: drinkSelection[] = [];

    drinkMap.forEach((key, value) => {
        drinks.push({
            drinkID: key,
            drinkQty: value
        })
    })

    console.log(drinks)
    
    return (
        <div>
            {drinks.map((drinkOrder, counter) => {
                return (
                    <Drink>
                        <p>Item number: {counter}</p>
                        <p>Drink ID: {drinkOrder.drinkID}</p>
                        <p>Drink Qty: {drinkOrder.drinkQty}</p>
                    </Drink>
                )
            })}
        </div>
    )

}