import React from "react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle
} from "react-leaflet";

import L from "leaflet";


// ==========================================
// DRIVER ICON
// ==========================================

const driverIcon =
    new L.Icon({

        iconUrl:
            "https://cdn-icons-png.flaticon.com/512/744/744465.png",

        iconSize: [
            40,
            40
        ],

        iconAnchor: [
            20,
            40
        ],

        popupAnchor: [
            0,
            -40
        ]

    });


// ==========================================
// DRIVER MAP
// ==========================================

export default function DriverMap({
    latitude,
    longitude,
    online = false
}) {

    if (
        latitude === undefined ||
        latitude === null ||
        longitude === undefined ||
        longitude === null
    ) {

        return (

            <div style={styles.noMap}>

                <div style={styles.icon}>
                    📍
                </div>

                <h3>
                    Location unavailable
                </h3>

                <p>
                    Go online and allow location
                    access to display your position.
                </p>

            </div>

        );

    }


    const position = [
        Number(latitude),
        Number(longitude)
    ];


    return (

        <div style={styles.mapWrapper}>

            <MapContainer

                center={position}

                zoom={15}

                style={styles.map}

            >

                <TileLayer

                    attribution='&copy; OpenStreetMap contributors'

                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                />


                <Marker

                    position={position}

                    icon={driverIcon}

                >

                    <Popup>

                        <strong>
                            🚗 You are here
                        </strong>

                        <br />

                        Status:{" "}

                        {online
                            ? "🟢 Online"
                            : "🔴 Offline"
                        }

                    </Popup>

                </Marker>


                {online && (

                    <Circle

                        center={position}

                        radius={100}

                        pathOptions={{
                            fillOpacity: 0.15
                        }}

                    />

                )}

            </MapContainer>


            <div style={styles.mapOverlay}>

                <span>
                    📍 Live Location
                </span>

                {online && (

                    <span style={styles.live}>
                        ● LIVE
                    </span>

                )}

            </div>

        </div>

    );

}


const styles = {

    mapWrapper: {
        position: "relative",
        width: "100%",
        height: "420px",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.10)"
    },

    map: {
        width: "100%",
        height: "100%"
    },

    mapOverlay: {
        position: "absolute",
        top: "15px",
        left: "15px",
        zIndex: 1000,
        background: "white",
        padding: "9px 13px",
        borderRadius: "8px",
        boxShadow:
            "0 2px 8px rgba(0,0,0,0.15)",
        display: "flex",
        gap: "10px",
        fontWeight: "bold"
    },

    live: {
        color: "#16a34a"
    },

    noMap: {
        height: "300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb",
        borderRadius: "14px",
        textAlign: "center",
        color: "#6b7280"
    },

    icon: {
        fontSize: "55px"
    }

};