import {
    useEffect,
    useState
} from "react";

import {
    connectWebSocket,
    disconnectWebSocket
} from "../api/websocket";


export default function useRideLocation(
    rideId
) {

    const [
        driverLocation,
        setDriverLocation
    ] = useState(null);


    const [
        rideStatus,
        setRideStatus
    ] = useState(null);


    const [
        connected,
        setConnected
    ] = useState(false);


    useEffect(() => {

        // ==========================================
        // NO RIDE
        // ==========================================

        if (!rideId) {

            setConnected(false);

            return;

        }


        console.log(
            "Connecting to live ride tracking..."
        );


        connectWebSocket(

            (client) => {

                console.log(
                    "Subscribing for ride:",
                    rideId
                );


                setConnected(true);


                // ==================================
                // DRIVER LOCATION
                // ==================================

                client.subscribe(

                    "/topic/ride/location",

                    (message) => {

                        try {

                            const data =
                                JSON.parse(
                                    message.body
                                );


                            console.log(
                                "Driver location:",
                                data
                            );


                            if (
                                String(
                                    data.rideId
                                ) ===
                                String(
                                    rideId
                                )
                            ) {

                                const latitude =
                                    Number(
                                        data.latitude
                                    );

                                const longitude =
                                    Number(
                                        data.longitude
                                    );


                                if (
                                    Number.isFinite(
                                        latitude
                                    ) &&
                                    Number.isFinite(
                                        longitude
                                    )
                                ) {

                                    setDriverLocation({

                                        latitude:
                                            latitude,

                                        longitude:
                                            longitude

                                    });

                                }

                            }

                        }
                        catch (error) {

                            console.error(
                                "Location parsing error:",
                                error
                            );

                        }

                    }

                );


                // ==================================
                // RIDE STATUS
                // ==================================

                client.subscribe(

                    "/topic/ride/status",

                    (message) => {

                        try {

                            const data =
                                JSON.parse(
                                    message.body
                                );


                            console.log(
                                "Ride status:",
                                data
                            );


                            if (
                                String(
                                    data.id
                                ) ===
                                String(
                                    rideId
                                )
                            ) {

                                setRideStatus(
                                    data
                                );

                            }

                        }
                        catch (error) {

                            console.error(
                                "Status parsing error:",
                                error
                            );

                        }

                    }

                );

            },


            () => {

                setConnected(false);

            }

        );


        // ==========================================
        // CLEANUP
        // ==========================================

        return () => {

            console.log(
                "Cleaning ride WebSocket..."
            );


            setConnected(false);

            disconnectWebSocket();

        };


    }, [rideId]);


    return {

        driverLocation,

        rideStatus,

        connected

    };

}