import { Children, cloneElement, EffectCallback, isValidElement, useEffect, useRef, useState } from "react";
import { createCustomEqual } from "fast-equals"
import { isLatLngLiteral } from "@googlemaps/typescript-guards"


interface MapProps extends google.maps.MapOptions {
    style: { [key: string]: string };
    onClick?: (e: google.maps.MapMouseEvent) => void;
    onIdle?: (map: google.maps.Map) => void;
    children: React.ReactNode
}



const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (a: any, b: any) => {
    if (isLatLngLiteral(a) || a instanceof google.maps.LatLng ||
        isLatLngLiteral(b) || b instanceof google.maps.LatLng
        ) {
            return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
            }

      // use fast-equals for other objects
    return deepEqual(a, b);
    }
);


function useDeepCompareMemoize(value: any) {
	const ref = useRef();
	if (!deepCompareEqualsForMaps(value, ref.current)) {
		ref.current = value;
	}
	return ref.current;
}

function useDeepCompareEffectForMaps(callback: EffectCallback, dependencies: any[]) {
	useEffect(callback, dependencies.map(useDeepCompareMemoize));
}


export default function DeliverMap({style, onClick, onIdle, children, ...options}: MapProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<google.maps.Map>()
    const [currLocButtonAdded, setCurrLocButtonadded] = useState(false)


    useDeepCompareEffectForMaps(() => {
        if (map) {
            map.setOptions(options);
        }
    }, [map, options]);

    useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}));
        }
    }, [ref, map])

    useEffect(() => {
        if (map) {
            ["click", "idle"].forEach((eventName) => {
                google.maps.event.clearListeners(map, eventName)

            });
            if (onClick) {
                map.addListener("click", onClick);
            }
            if (onIdle) {
                map.addListener("idle", () => onIdle(map));
            }
        }
    }, [map, onClick, onIdle]);


    return (
        <>
        <div ref={ref} style={style} />
        {Children.map(children, (child) => {
            if (isValidElement(child)) {
              // set the map prop on the child component
                return cloneElement(child, { map });
            }
        })}
        </>
    );

}