import { Client } from "@stomp/stompjs";

import SockJS from "sockjs-client";


let client = null;

let watchId = null;


// ==========================================
// START DRIVER GPS TRACKING
// ==========================================

export const startDriverLocationTracking =
    (rideId) => {

        client = new Client({

            webSocketFactory: () =>

                new SockJS(
                    "http://localhost:8080/ws"
                ),


            reconnectDelay: 5000,


            onConnect: () => {

                console.log(
                    "Driver WebSocket connected"
                );


                // ==================================
                // CHECK GPS SUPPORT
                // ==================================

                if (
                    !navigator.geolocation
                ) {

                    console.error(
                        "Geolocation is not supported"
                    );

                    return;
                }


                // ==================================
                // WATCH DRIVER LOCATION
                // ==================================

                watchId =
                    navigator.geolocation
                        .watchPosition(

                            (position) => {

                                const latitude =
                                    position.coords
                                        .latitude;


                                const longitude =
                                    position.coords
                                        .longitude;


                                console.log(
                                    "Driver GPS:",
                                    latitude,
                                    longitude
                                );


                                // ======================
                                // SEND TO SPRING BOOT
                                // ======================

                                client.publish({

                                    destination:
                                        "/app/driver/location",


                                    body:
                                        JSON.stringify({

                                            rideId:
                                                rideId,

                                            latitude:
                                                latitude,

                                            longitude:
                                                longitude

                                        })

                                });

                            },


                            (error) => {

                                console.error(
                                    "GPS error:",
                                    error.message
                                );

                            },


                            {

                                enableHighAccuracy:
                                    true,

                                maximumAge:
                                    5000,

                                timeout:
                                    10000

                            }

                        );

            },


            onStompError:
                (frame) => {

                    console.error(
                        "WebSocket error:",
                        frame
                    );

                }

        });


        client.activate();

    };


// ==========================================
// STOP DRIVER GPS TRACKING
// ==========================================

export const stopDriverLocationTracking =
    () => {

        if (
            watchId !== null
        ) {

            navigator.geolocation
                .clearWatch(
                    watchId
                );

            watchId = null;

        }


        if (client) {

            client.deactivate();

            client = null;

        }

    };