import styled from "styled-components";
import { useGet } from "../hooks"
import { DetailFormError, DrinkData } from "../types"
import { useState } from "react";
import DrinkModal from "../components/DrinkModal";

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

    console.log(data)

    
    return (
        <Content>
            <h2>Order Drinks</h2>
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
                {drinkClicked && <DrinkModal drinkData={drinkData1} setDrinkClicked={setDrinkClicked}/>}
        </Content>
    )
}