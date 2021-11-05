import { Button } from "../styles";
import { DrinkData } from "../types";
import Input from '../components/Input';
import styled from "styled-components";
import { useState } from "react";
import { drinkSelection } from "../pages/DrinkOrdering";

const QtyInput = styled.input`
    display: inline;
    -webkit-appearance: none;
    margin: 0;
    MozAppearance: textfield;
    type: number;
`

const QtyContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    align-items: baseline;
`

interface Props {
    readonly drinkData: DrinkData,
    setDrinkClicked: React.Dispatch<React.SetStateAction<boolean>>,
    addToCart: (drink: drinkSelection) => void
}

export default function DrinkModal({drinkData, setDrinkClicked, addToCart}: Props) {

    const [qtySelected, setQtySelected] = useState(1);


    return (
        <div>
            <img src={drinkData.imageUrl} alt="Drink Image" />
            <h2>{drinkData.name}</h2>
            <p>Price: $ {drinkData.price}</p>
            <p>{drinkData.description}</p>
            <QtyContainer>
                <Button onClick={(event) => {
                    setQtySelected(qtySelected - 1)
                }}>-</Button> 
                <Input
                    value={qtySelected.toString()}
                    type="number"
                    onChange={(e) => {
                        setQtySelected(parseInt(e.target.value))
                    }}
                ></Input>
                <Button onClick={(event) => {
                    setQtySelected(qtySelected + 1)
                }}>+</Button>
            </QtyContainer>
            <br/>
            <Button onClick={() => {
                setDrinkClicked(false)
                if (qtySelected != 0 && !isNaN(qtySelected)){
                    addToCart({
                    drinkID: drinkData.id,
                    drinkQty: qtySelected
                    })
                }
            }}>Add to cart</Button>
            <Button onClick={() => {
                setDrinkClicked(false)
            }}>Cancel</Button>
        </div>
    )
}