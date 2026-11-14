import React, {
    useEffect,
    useMemo
} from "react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


// =====================================================
// FIX DEFAULT LEAFLET ICON
// =====================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"

});


// =====================================================
// CUSTOM PICKUP ICON
// =====================================================

const pickupIcon =
    new L.DivIcon({

        className:
            "custom-map-icon",

        html:
            `
            <div style="
                width:36px;
                height:36px;
                background:#2563eb;
                border:4px solid white;
                border-radius:50%;
                display:flex;
                align-items:center;
                justify-content:center;
                box-shadow:0 3px 10px rgba(0,0,0,.35);
                font-size:18px;
            ">
                📍
            </div>
            `,

        iconSize: [
            36,
            36
        ],

        iconAnchor: [
            18,
            18
        ]

    });


// =====================================================
// CUSTOM DESTINATION ICON
// =====================================================

const destinationIcon =
    new L.DivIcon({

        className:
            "custom-map-icon",

        html:
            `
            <div style="
                width:36px;
                height:36px;
                background:#dc2626;
                border:4px solid white;
                border-radius:50%;
                display:flex;
                align-items:center;
                justify-content:center;
                box-shadow:0 3px 10px rgba(0,0,0,.35);
                font-size:18px;
            ">
                🏁
            </div>
            `,

        iconSize: [
            36,
            36
        ],

        iconAnchor: [
            18,
            18
        ]

    });


// =====================================================
// CUSTOM DRIVER ICON
// =====================================================

const driverIcon =
    new L.DivIcon({

        className:
            "custom-map-icon",

        html:
            `
            <div style="
                width:42px;
                height:42px;
                background:#16a34a;
                border:4px solid white;
                border-radius:50%;
                display:flex;
                align-items:center;
                justify-content:center;
                box-shadow:0 3px 12px rgba(0,0,0,.4);
                font-size:22px;
            ">
                🚗
            </div>
            `,

        iconSize: [
            42,
            42
        ],

        iconAnchor: [
            21,
            21
        ]

    });


// =====================================================
// LOCATION NORMALIZER
// =====================================================

const normalizeLocation = (
    location
) => {

    if (!location) {

        return null;

    }


    // =================================================
    // STRING LOCATION
    // =================================================

    if (
        typeof location ===
        "string"
    ) {

        return {

            address:
                location,

            latitude:
                null,

            longitude:
                null

        };

    }


    // =================================================
    // LATITUDE
    // =================================================

    let latitude =
        location.latitude ??
        location.lat ??
        location.coordinates?.latitude ??
        location.coordinates?.lat ??
        null;


    // =================================================
    // LONGITUDE
    // =================================================

    let longitude =
        location.longitude ??
        location.lng ??
        location.lon ??
        location.coordinates?.longitude ??
        location.coordinates?.lng ??
        null;


    // =================================================
    // MONGODB GEOJSON
    //
    // GeoJSON:
    //
    // coordinates = [
    //     longitude,
    //     latitude
    // ]
    // =================================================

    if (
        Array.isArray(
            location.coordinates
        )
        &&
        location.coordinates.length >= 2
    ) {

        longitude =
            location.coordinates[0];

        latitude =
            location.coordinates[1];

    }


    return {

        address:
            location.address ||
            location.location ||
            location.name ||
            location.formattedAddress ||
            "Address unavailable",

        latitude:
            latitude !== null
                ? Number(latitude)
                : null,

        longitude:
            longitude !== null
                ? Number(longitude)
                : null

    };

};


// =====================================================
// VALID LOCATION
// =====================================================

const isValidLocation =
    (
        location
    ) => {

        if (!location) {

            return false;

        }


        const latitude =
            Number(
                location.latitude
            );


        const longitude =
            Number(
                location.longitude
            );


        return (

            Number.isFinite(
                latitude
            )

            &&

            Number.isFinite(
                longitude
            )

            &&

            latitude >= -90

            &&

            latitude <= 90

            &&

            longitude >= -180

            &&

            longitude <= 180

        );

    };


// =====================================================
// MAP CLICK HANDLER
//
// FIRST CLICK
//      ↓
// PICKUP
//
// SECOND CLICK
//      ↓
// DESTINATION
//
// THIRD CLICK
//      ↓
// NEW PICKUP
//      ↓
// DESTINATION RESET
// =====================================================

function MapClickHandler({

    pickup,

    destination,

    setPickup,

    setDestination

}) {

    const map =
        useMap();


    useEffect(() => {

        const handleMapClick =
            (event) => {

                const latitude =
                    event.latlng.lat;


                const longitude =
                    event.latlng.lng;


                const clickedLocation = {

                    latitude:
                        latitude,

                    longitude:
                        longitude

                };


                // ==========================================
                // FIRST CLICK
                // ==========================================

                if (!pickup) {

                    setPickup(
                        clickedLocation
                    );

                    return;

                }


                // ==========================================
                // SECOND CLICK
                // ==========================================

                if (!destination) {

                    setDestination(
                        clickedLocation
                    );

                    return;

                }


                // ==========================================
                // THIRD CLICK
                //
                // Start a new route
                // ==========================================

                setPickup(
                    clickedLocation
                );

                setDestination(
                    null
                );

            };


        map.on(
            "click",
            handleMapClick
        );


        // ================================================
        // CLEANUP
        // ================================================

        return () => {

            map.off(
                "click",
                handleMapClick
            );

        };

    }, [

        map,

        pickup,

        destination,

        setPickup,

        setDestination

    ]);


    return null;

}


// =====================================================
// MAP AUTO FIT
// =====================================================

function MapAutoFit({

    locations

}) {

    const map =
        useMap();


    useEffect(() => {

        const validPoints =
            locations

                .filter(
                    isValidLocation
                )

                .map(
                    location => [

                        Number(
                            location.latitude
                        ),

                        Number(
                            location.longitude
                        )

                    ]
                );


        // ==============================================
        // NO LOCATIONS
        // ==============================================

        if (
            validPoints.length === 0
        ) {

            return;

        }


        // ==============================================
        // ONE LOCATION
        // ==============================================

        if (
            validPoints.length === 1
        ) {

            map.setView(

                validPoints[0],

                15

            );

            return;

        }


        // ==============================================
        // MULTIPLE LOCATIONS
        // ==============================================

        const bounds =
            L.latLngBounds(
                validPoints
            );


        map.fitBounds(

            bounds,

            {

                padding: [

                    50,

                    50

                ]

            }

        );

    }, [

        map,

        locations

    ]);


    return null;

}


// =====================================================
// RIDE MAP
// =====================================================

function RideMap({

    pickup,

    destination,

    driverLocation,

    routeCoordinates,

    distance,

    duration,

    setPickup,

    setDestination

}) {


    // =================================================
    // NORMALIZE PICKUP
    // =================================================

    const normalizedPickup =
        useMemo(

            () =>
                normalizeLocation(
                    pickup
                ),

            [
                pickup
            ]

        );


    // =================================================
    // NORMALIZE DESTINATION
    // =================================================

    const normalizedDestination =
        useMemo(

            () =>
                normalizeLocation(
                    destination
                ),

            [
                destination
            ]

        );


    // =================================================
    // NORMALIZE DRIVER
    // =================================================

    const normalizedDriver =
        useMemo(

            () =>
                normalizeLocation(
                    driverLocation
                ),

            [
                driverLocation
            ]

        );


    // =================================================
    // NORMALIZE BACKEND ROUTE
    //
    // Backend OSRM returns:
    //
    // [
    //     longitude,
    //     latitude
    // ]
    //
    // Leaflet requires:
    //
    // [
    //     latitude,
    //     longitude
    // ]
    // =================================================

    const route =
        useMemo(() => {

            if (
                !Array.isArray(
                    routeCoordinates
                )
            ) {

                return [];

            }


            return routeCoordinates

                .filter(
                    point =>

                        Array.isArray(
                            point
                        )

                        &&

                        point.length >= 2

                )

                .map(
                    point => {

                        const longitude =
                            Number(
                                point[0]
                            );


                        const latitude =
                            Number(
                                point[1]
                            );


                        return [

                            latitude,

                            longitude

                        ];

                    }

                )

                .filter(
                    point =>

                        Number.isFinite(
                            point[0]
                        )

                        &&

                        Number.isFinite(
                            point[1]
                        )

                        &&

                        point[0] >= -90

                        &&

                        point[0] <= 90

                        &&

                        point[1] >= -180

                        &&

                        point[1] <= 180

                );

        }, [

            routeCoordinates

        ]);


    // =================================================
    // DISPLAY ROUTE
    //
    // 1. REAL OSRM ROUTE
    //
    // 2. FALLBACK STRAIGHT LINE
    // =================================================

    const displayRoute =
        useMemo(() => {

            // ==========================================
            // REAL BACKEND ROUTE
            // ==========================================

            if (
                route.length >= 2
            ) {

                return route;

            }


            // ==========================================
            // FALLBACK ROUTE
            // ==========================================

            if (

                isValidLocation(
                    normalizedPickup
                )

                &&

                isValidLocation(
                    normalizedDestination
                )

            ) {

                return [

                    [

                        Number(
                            normalizedPickup.latitude
                        ),

                        Number(
                            normalizedPickup.longitude
                        )

                    ],

                    [

                        Number(
                            normalizedDestination.latitude
                        ),

                        Number(
                            normalizedDestination.longitude
                        )

                    ]

                ];

            }


            return [];

        }, [

            route,

            normalizedPickup,

            normalizedDestination

        ]);


    // =================================================
    // INITIAL MAP CENTER
    // =================================================

    const center =
        useMemo(() => {

            // ==========================================
            // DRIVER LOCATION
            // ==========================================

            if (
                isValidLocation(
                    normalizedDriver
                )
            ) {

                return [

                    Number(
                        normalizedDriver.latitude
                    ),

                    Number(
                        normalizedDriver.longitude
                    )

                ];

            }


            // ==========================================
            // PICKUP
            // ==========================================

            if (
                isValidLocation(
                    normalizedPickup
                )
            ) {

                return [

                    Number(
                        normalizedPickup.latitude
                    ),

                    Number(
                        normalizedPickup.longitude
                    )

                ];

            }


            // ==========================================
            // DESTINATION
            // ==========================================

            if (
                isValidLocation(
                    normalizedDestination
                )
            ) {

                return [

                    Number(
                        normalizedDestination.latitude
                    ),

                    Number(
                        normalizedDestination.longitude
                    )

                ];

            }


            // ==========================================
            // INDIA DEFAULT
            // ==========================================

            return [

                20.5937,

                78.9629

            ];

        }, [

            normalizedDriver,

            normalizedPickup,

            normalizedDestination

        ]);


    // =================================================
    // MAP LOCATIONS
    // =================================================

    const mapLocations = [

        normalizedPickup,

        normalizedDestination,

        normalizedDriver

    ];


    // =================================================
    // RETURN
    // =================================================

    return (

        <div>

            {/* ========================================= */}
            {/* MAP */}
            {/* ========================================= */}

            <div
                style={{

                    height:
                        "520px",

                    width:
                        "100%",

                    borderRadius:
                        "14px",

                    overflow:
                        "hidden",

                    position:
                        "relative"

                }}
            >

                <MapContainer

                    center={
                        center
                    }

                    zoom={
                        14
                    }

                    scrollWheelZoom={
                        true
                    }

                    style={{

                        height:
                            "100%",

                        width:
                            "100%"

                    }}

                >

                    {/* ================================= */}
                    {/* OPEN STREET MAP */}
                    {/* ================================= */}

                    <TileLayer

                        attribution=
                            '&copy; OpenStreetMap contributors'

                        url=
                            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                    />


                    {/* ================================= */}
                    {/* MAP CLICK */}
                    {/* ================================= */}

                    {
                        setPickup &&
                        setDestination && (

                            <MapClickHandler

                                pickup={
                                    normalizedPickup
                                }

                                destination={
                                    normalizedDestination
                                }

                                setPickup={
                                    setPickup
                                }

                                setDestination={
                                    setDestination
                                }

                            />

                        )
                    }


                    {/* ================================= */}
                    {/* AUTO FIT */}
                    {/* ================================= */}

                    <MapAutoFit

                        locations={
                            mapLocations
                        }

                    />


                    {/* ================================= */}
                    {/* PICKUP MARKER */}
                    {/* ================================= */}

                    {
                        isValidLocation(
                            normalizedPickup
                        )

                        &&

                        (

                            <Marker

                                position={[

                                    Number(
                                        normalizedPickup.latitude
                                    ),

                                    Number(
                                        normalizedPickup.longitude
                                    )

                                ]}

                                icon={
                                    pickupIcon
                                }

                            >

                                <Popup>

                                    <strong>
                                        📍 Pickup
                                    </strong>

                                    <br />

                                    {
                                        normalizedPickup.address
                                    }

                                </Popup>

                            </Marker>

                        )

                    }


                    {/* ================================= */}
                    {/* DESTINATION MARKER */}
                    {/* ================================= */}

                    {
                        isValidLocation(
                            normalizedDestination
                        )

                        &&

                        (

                            <Marker

                                position={[

                                    Number(
                                        normalizedDestination.latitude
                                    ),

                                    Number(
                                        normalizedDestination.longitude
                                    )

                                ]}

                                icon={
                                    destinationIcon
                                }

                            >

                                <Popup>

                                    <strong>
                                        🏁 Destination
                                    </strong>

                                    <br />

                                    {
                                        normalizedDestination.address
                                    }

                                </Popup>

                            </Marker>

                        )

                    }


                    {/* ================================= */}
                    {/* DRIVER MARKER */}
                    {/* ================================= */}

                    {
                        isValidLocation(
                            normalizedDriver
                        )

                        &&

                        (

                            <Marker

                                position={[

                                    Number(
                                        normalizedDriver.latitude
                                    ),

                                    Number(
                                        normalizedDriver.longitude
                                    )

                                ]}

                                icon={
                                    driverIcon
                                }

                            >

                                <Popup>

                                    <strong>
                                        🚗 Driver
                                    </strong>

                                    <br />

                                    Your driver is here.

                                </Popup>

                            </Marker>

                        )

                    }


                    {/* ================================= */}
                    {/* ROUTE */}
                    {/* ================================= */}

                    {
                        displayRoute.length >= 2

                        &&

                        (

                            <Polyline

                                positions={
                                    displayRoute
                                }

                                pathOptions={{

                                    color:
                                        "#2563eb",

                                    weight:
                                        6,

                                    opacity:
                                        0.8

                                }}

                            />

                        )

                    }

                </MapContainer>


                {/* ================================= */}
                {/* MAP INSTRUCTION */}
                {/* ================================= */}

                {
                    !normalizedPickup
                    &&

                    !normalizedDestination

                    &&

                    (

                        <div

                            style={{

                                position:
                                    "absolute",

                                top:
                                    "20px",

                                left:
                                    "50%",

                                transform:
                                    "translateX(-50%)",

                                zIndex:
                                    1000,

                                background:
                                    "white",

                                padding:
                                    "12px 18px",

                                borderRadius:
                                    "10px",

                                boxShadow:
                                    "0 3px 12px rgba(0,0,0,.2)",

                                fontWeight:
                                    "bold",

                                fontSize:
                                    "14px",

                                whiteSpace:
                                    "nowrap"

                            }}

                        >

                            📍 Click map to select pickup

                        </div>

                    )

                }


                {/* ================================= */}
                {/* DESTINATION INSTRUCTION */}
                {/* ================================= */}

                {
                    normalizedPickup
                    &&

                    !normalizedDestination

                    &&

                    (

                        <div

                            style={{

                                position:
                                    "absolute",

                                top:
                                    "20px",

                                left:
                                    "50%",

                                transform:
                                    "translateX(-50%)",

                                zIndex:
                                    1000,

                                background:
                                    "white",

                                padding:
                                    "12px 18px",

                                borderRadius:
                                    "10px",

                                boxShadow:
                                    "0 3px 12px rgba(0,0,0,.2)",

                                fontWeight:
                                    "bold",

                                fontSize:
                                    "14px",

                                whiteSpace:
                                    "nowrap"

                            }}

                        >

                            🏁 Click map to select destination

                        </div>

                    )

                }


                {/* ================================= */}
                {/* NO LOCATION WARNING */}
                {/* ================================= */}

                {
                    !isValidLocation(
                        normalizedPickup
                    )

                    &&

                    !isValidLocation(
                        normalizedDestination
                    )

                    &&

                    driverLocation

                    &&

                    !isValidLocation(
                        normalizedDriver
                    )

                    &&

                    (

                        <div

                            style={{

                                position:
                                    "absolute",

                                top:
                                    "70px",

                                left:
                                    "50%",

                                transform:
                                    "translateX(-50%)",

                                zIndex:
                                    1000,

                                background:
                                    "#fff7ed",

                                color:
                                    "#c2410c",

                                padding:
                                    "10px 16px",

                                borderRadius:
                                    "10px",

                                boxShadow:
                                    "0 3px 12px rgba(0,0,0,.15)",

                                fontWeight:
                                    "bold",

                                fontSize:
                                    "13px"

                            }}

                        >

                            ⚠️ Ride location unavailable

                        </div>

                    )

                }

            </div>


            {/* ========================================= */}
            {/* MAP INFO */}
            {/* ========================================= */}

            <div

                style={{

                    display:
                        "grid",

                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(150px,1fr))",

                    gap:
                        "12px",

                    marginTop:
                        "15px"

                }}

            >

                {/* ===================================== */}
                {/* DISTANCE */}
                {/* ===================================== */}

                <MapInfo

                    label="Distance"

                    value={

                        distance !== null

                        &&

                        distance !== undefined

                            ?

                            `${Number(
                                distance
                            ).toFixed(2)} km`

                            :

                            "N/A"

                    }

                />


                {/* ===================================== */}
                {/* ETA */}
                {/* ===================================== */}

                <MapInfo

                    label="ETA"

                    value={

                        duration !== null

                        &&

                        duration !== undefined

                            ?

                            `${duration} min`

                            :

                            "N/A"

                    }

                />


                {/* ===================================== */}
                {/* ROUTE */}
                {/* ===================================== */}

                <MapInfo

                    label="Route"

                    value={

                        displayRoute.length >= 2

                            ?

                            "Active"

                            :

                            "Unavailable"

                    }

                />

            </div>

        </div>

    );

}


// =====================================================
// MAP INFO
// =====================================================

function MapInfo({

    label,

    value

}) {

    return (

        <div

            style={{

                background:
                    "#f9fafb",

                padding:
                    "14px",

                borderRadius:
                    "10px",

                textAlign:
                    "center"

            }}

        >

            <div

                style={{

                    fontSize:
                        "12px",

                    color:
                        "#6b7280"

                }}

            >

                {
                    label
                }

            </div>


            <strong>

                {
                    value
                }

            </strong>

        </div>

    );

}


// =====================================================
// EXPORT
// =====================================================

export default RideMap;