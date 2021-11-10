import { useState } from "react";
import styled from "styled-components";
import DrinkCart from "../components/DrinkCart";
import DrinkModal from "../components/DrinkModal";
import Input from '../components/Input';
import { useGet, useWindowSize } from "../hooks";
import { Button } from "../styles";
import { DetailFormError, DrinkData } from "../types";
import { Pair } from "../utils";

const Content = styled.div`
    text-align: center;
    width: 100%;
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

const HeaderText = styled.div`
    grid-column: header-text / filler2;
`

const HeaderCartButton = styled.div`
    grid-column: cart-button / filler3;
    align-self: center;
`


const cart: Map<number, Pair<DrinkData, number>> = new Map();

function addToCart(drinkId: number, drinkData: DrinkData, drinkQty: number) {
    const currQty = cart.get(drinkId)?.second
    if (currQty == undefined){
        cart.set(drinkId, new Pair<DrinkData, number>(drinkData, drinkQty))
    } else {
        cart.set(drinkId, new Pair<DrinkData, number>(drinkData, currQty + drinkQty))
    }
}

export default function DrinkOrdering() { 
    function layoutSwitch(desktop: string, mobile: string): string {
        const [width] = useWindowSize();
        if (width > 650) {
            return desktop;
        } else {
            return mobile;
        }
    }

    const Header = styled.div`
    display: grid;
    grid-template-columns: ${layoutSwitch(
        "[filler1] 40% [header-text] 20% [filler2] 20% [cart-button] 10% [filler3] 10%", 
        "[filler1] auto [header-text] auto [filler2] auto [cart-button] auto [filler3] auto"
    )};
`

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
    const [viewCart, setViewCart] = useState(false);

    // console.log(data)

    
    return (
        <Content>
            <Header>
                <HeaderText>
                    <h2>Order Drinks</h2>
                </HeaderText>
                <HeaderCartButton>
                    {!viewCart && <Button onClick={() => {
                        setViewCart(true)
                        setDrinkClicked(false)
                    }}>View Cart</Button>}
                    {viewCart && <Button onClick={() => {
                        setViewCart(false)
                    }} >Back</Button>}
                </HeaderCartButton>
            </Header>
            {!drinkClicked && !viewCart && <DrinkGridLayout>
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
            {drinkClicked && <DrinkModal drinkData={drinkData1} />}
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
                            addToCart(drinkData1.id, drinkData1, qtySelected)
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
                </div>
            }
            {viewCart && <DrinkCart drinkMap={cart} setViewCart={setViewCart} />}
        </Content>
    )
}