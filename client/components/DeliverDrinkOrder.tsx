import { Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useState } from "react";
import { useGet, useUser } from "../hooks";
import { DrinkOrderData } from "../pages/DrinkOrderFufillment";
import { Button } from "../styles";
import { DetailFormError } from "../types";
import DeliverMap from "./DeliverMap";
import { DeliverMarker } from "./DeliverMarker";

export default function DeliverDrinkOrder() {
    const {user} = useUser()
    const {data, loading, error, refetch} = useGet<DrinkOrderData[], DetailFormError>("/orders/user/" + user.id)
    const apiKey = "AIzaSyD_Nz3FsRYOBxM4FgqH_e40HNYGABA_CXc"

    const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
    const [zoom, setZoom] = useState(17); // initial zoom

    let lat = data?.at(0)?.location.lattitude
    let lng = data?.at(0)?.location.longitude

    const [center, setCenter] = useState<google.maps.LatLngLiteral>({
        lat: 0,
        lng: 0,
    });

    if (lat !== undefined && lng !== undefined && center.lat == 0 && center.lng == 0){
        setCenter({
            lat: lat,
            lng: lng
        })
    }

    const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
        setClicks([...clicks, e.latLng!]);
    };

    const onIdle = (m: google.maps.Map) => {
        console.log("onIdle");
        setZoom(m.getZoom()!);
        setCenter(m.getCenter()!.toJSON());
    };

    
    useEffect(() => {
        setInterval(() => {
            refetch()
        }, 5000)

        return () => {clearInterval()}
    }, [])
    

    console.log(data)

    
    return (
        <div >
            <h2>Deliver the order</h2>
            <Button>
                Order Delivered
            </Button>
            <div style={{height: "20em"}}>
                <Wrapper apiKey={apiKey}>
                    <DeliverMap style={{height: "50em", width: "50em"}} onClick={onClick} onIdle={onIdle} center={center} zoom={zoom}>
                        {lat !== undefined && lng !== undefined && <DeliverMarker position={{lat: lat, lng: lng}} />}
                    </DeliverMap>
                </Wrapper>
            </div>
        </div>
    )
}