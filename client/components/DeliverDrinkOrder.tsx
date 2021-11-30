import { useEffect } from "react";
import { useGet, useUser } from "../hooks";
import { DrinkOrderData } from "../pages/DrinkOrderFufillment";
import { Button } from "../styles";
import { DetailFormError } from "../types";


export default function DeliverDrinkOrder() {
    const {user} = useUser()
    const {data, loading, error, refetch} = useGet<DrinkOrderData[], DetailFormError>("/orders/user/" + user.id)
    
    useEffect(() => {
        setInterval(() => {
            refetch()
        }, 5000)

        return () => {clearInterval()}
    }, [])

    console.log(data)

    return (
        <div>
            <h2>Deliver the order</h2>
            <div>
                <iframe
                    id="map"
                    width="500" 
                    height="380" 
                    style={{border:0}} 
                    loading="lazy" 
                    allowFullScreen 
                    src={"https://www.google.com/maps/embed/v1/view?zoom=20&center=" + data?.at(0)?.location.lattitude +"%2C" + data?.at(0)?.location.longitude +"&key=AIzaSyD_Nz3FsRYOBxM4FgqH_e40HNYGABA_CXc"}
                />
            </div>
            <Button>
                Order Delivered
            </Button>
        </div>
    )
}