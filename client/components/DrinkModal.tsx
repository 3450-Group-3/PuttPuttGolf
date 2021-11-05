import { DrinkData } from "../types";

interface Props {
    readonly drinkData: DrinkData
}

export default function DrinkModal({drinkData}: Props) {
    return (
        <div>
            <img src={drinkData.imageUrl} alt="Drink Image" />
            <h2>{drinkData.name}</h2>
            <p>Price: $ {drinkData.price}</p>
            <p>{drinkData.description}</p>
        </div>
    )
}