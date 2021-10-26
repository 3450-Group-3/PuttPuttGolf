import { useGet } from "../hooks"
import { DetailFormError, DrinkData } from "../types"

export default function DrinkOrdering() { //todo list over all drinks returned

    const { data, loading, error} = useGet<DrinkData[],  DetailFormError>("/drinks");

    console.log(data)

    return (
        <div>
            <h2>Order Drinks</h2>
        </div>
    )
}