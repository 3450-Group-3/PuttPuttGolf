import { Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { useGet, usePut, useUser } from "../hooks";
import { DrinkOrderData, DrinkOrderState } from "../pages/DrinkOrderFufillment";
import { Button } from "../styles";
import { DetailFormError } from "../types";
import DeliverMap from "./DeliverMap";
import { DeliverMarker } from "./DeliverMarker";

interface props {
    setHasAcceptedOrder: React.Dispatch<React.SetStateAction<boolean>>,
    setOrderReadyToBeDelivered: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DeliverDrinkOrder() {
    const {user} = useUser()
    const {data, loading, error, refetch} = useGet<DrinkOrderData[], DetailFormError>("/orders/user/" + user.id)
    const [putRet, updateOrderStatus] = usePut<DrinkOrderData, DetailFormError>("/orders/status")
    const apiKey = "AIzaSyD_Nz3FsRYOBxM4FgqH_e40HNYGABA_CXc"
    const [redir, setRedir] = useState(false)

    const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
    const [zoom, setZoom] = useState(17); // initial zoom

    let lat = data?.at(0)?.location.lattitude
    let lng = data?.at(0)?.location.longitude

    const [center, setCenter] = useState<google.maps.LatLngLiteral>({
        lat: 0,
        lng: 0,
    });

    const [dmPos, setDmPos] = useState<google.maps.LatLngLiteral>()

    navigator.geolocation.getCurrentPosition((location) => {
        setDmPos({lat: location.coords.latitude, lng: location.coords.longitude})
    })

    useEffect(() => {
        setInterval(() => {
            navigator.geolocation.getCurrentPosition((location) => {
                setDmPos({lat: location.coords.latitude, lng: location.coords.longitude})
            })
        }, 5000)
    })

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

    function handleOrderDelivered() {
        updateOrderStatus({
            data: {
                id: data?.at(0)?.id,
                orderStatus: DrinkOrderState.DELIVERED
            }
        }).then(() => {
            setRedir(true)
        })
    }

    
    return (
        <div >
            <h2>Deliver the order</h2>
            <Button onClick={() => {
                handleOrderDelivered()
            }}>
                Order Delivered
            </Button>
            <div style={{height: "20em"}}>
                <Wrapper apiKey={apiKey}>
                    <DeliverMap style={{height: "50em", width: "50em"}} onClick={onClick} onIdle={onIdle} center={center} zoom={zoom}>
                        {lat !== undefined && lng !== undefined && <DeliverMarker position={{lat: lat, lng: lng}} />}
                        {dmPos?.lat !== undefined && dmPos?.lng !== undefined && <DeliverMarker position={{lat: dmPos.lat, lng: dmPos.lng}} icon={"https://raw.githubusercontent.com/scottdejonge/map-icons/master/src/icons/male.svg"} />}
                    </DeliverMap>
                </Wrapper>
            </div>
            {redir && <Redirect to="/dm/orders" />}
        </div>
    )
}