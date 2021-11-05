import styled from "styled-components";
import { useGet } from "../hooks"
import { DetailFormError, DrinkData } from "../types"
import { useState } from "react";
import DrinkModal from "../components/DrinkModal";
import { Button } from "../styles";
import Input from '../components/Input';

const Content = styled.div`
    text-align: center;
`;

const DrinkGridLayout = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 90%;
    margin: auto;
    justify-content: center;
`;

const DrinkThumbnail = styled.div`
    width: 33.3%
    margin: auto;
    padding: .25em;
`;

const QtyContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    align-items: baseline;
`

export interface drinkSelection {
    drinkID: number
    drinkQty: number
}

const cart: drinkSelection[] = []; 

function addToCart(drink: drinkSelection) {
    cart.push(drink);
}

export default function DrinkOrdering() { 

    const { data, loading, error} = useGet<DrinkData[],  DetailFormError>("/drinks");
    const [drinkClicked, setDrinkClicked] = useState(false);
    const [drinkData1, setDrinkData] = useState<DrinkData>({
        id: 0,
        name: "",
        price: 0,
        imageUrl: "",
        description: ""
    });
    const [qtySelected, setQtySelected] = useState(1);
    const [qtyPostive, setQtyPositive] = useState(true);

    console.log(data)

    
    return (
        <Content>
            <h2>Order Drinks</h2>
            <button onClick={() => {console.log(cart)}}>click</button>
                {!drinkClicked && <DrinkGridLayout>
                {data?.map((drink) => {
                    return (
                        <DrinkThumbnail key={drink.id} onClick={() => {
                            setDrinkData({
                                id: drink.id,
                                name: drink.name,
                                price: drink.price,
                                imageUrl: drink.imageUrl,
                                description: drink.description
                            })
                            setDrinkClicked(true)
                        }}>
                            <img src={drink.imageUrl} alt="Image for drink" height="100em" width="100em"></img>
                            <p>{drink.name}</p>
                        </DrinkThumbnail>
                    )
                })}
                </DrinkGridLayout>}
                {drinkClicked && 
                <DrinkModal drinkData={drinkData1} />}
                {!qtyPostive && <p style={{color: "red"}}>The drink quantity must be a more than 0.</p> } 
                {drinkClicked &&
                <div>
                    <QtyContainer>
                        <Button onClick={() => {
                            if (!isNaN(qtySelected)){
                                setQtySelected(qtySelected - 1)
                            } else {
                                setQtySelected(0)
                            }
                        }}>-</Button> 
                        <Input
                            value={qtySelected.toString()}
                            type="number"
                            onChange={(e) => {
                                setQtySelected(parseInt(e.target.value))
                            }}
                            min="1"
                        />
                        <Button onClick={() => {
                            if (!isNaN(qtySelected)){
                                setQtySelected(qtySelected + 1)
                            } else {
                                setQtySelected(0)
                            }
                        }}>+</Button>
                    </QtyContainer>
                    <br/>
                    <Button onClick={() => {
                        if (qtySelected > 0 && !isNaN(qtySelected)){
                            addToCart({
                            drinkID: drinkData1.id,
                            drinkQty: qtySelected
                            })
                            setQtyPositive(true)
                            setDrinkClicked(false)
                        } else {
                            setQtyPositive(false)
                        }
                        setQtySelected(1)
                    }}>Add to cart</Button>
                    <Button onClick={() => {
                        setDrinkClicked(false)
                        setQtySelected(1)
                        setQtyPositive(true)
                    }}>Cancel</Button>
                </div>}
        </Content>
    )
}