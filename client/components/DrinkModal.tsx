import { DrinkData } from "../types";

interface Props {
    readonly drinkData: DrinkData,
    setDrinkClicked: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DrinkModal({drinkData, setDrinkClicked}: Props) {
    return (
        <div>
            <p>Im a drink DrinkModal</p>
            <p>Drink id {drinkData.id}</p>
            <p>Drink name {drinkData.name}</p>
            <p>Drink url {drinkData.imageUrl}</p>
            <p>Drink description {drinkData.description}</p>
            <p>Drink price {drinkData.price}</p>
            <button onClick={() => {
                setDrinkClicked(false)
            }}>Press me</button>
        </div>
    )
}