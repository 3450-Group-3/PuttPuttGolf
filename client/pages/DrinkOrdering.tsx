import { useGet } from "../hooks"
import { DetailFormError, DrinkData } from "../types"

export default function DrinkOrdering() { //todo list over all drinks returned

    const { data, loading, error} = useGet<DrinkData[],  DetailFormError>("/drinks");

    console.log(data)

    const tmp = data?.map((drink) => {
        return (
            <p key={drink.id}>{drink.name}</p>
        )
    })

    return (
        <div>
            <h2>Order Drinks</h2>
            {tmp}
        </div>
    )
}