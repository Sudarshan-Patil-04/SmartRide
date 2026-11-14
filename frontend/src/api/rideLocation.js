import {
    connectWebSocket,
    disconnectWebSocket
} from "./websocket";


export const subscribeToRideLocation = (
    rideId,
    onLocationUpdate
) => {

    connectWebSocket((client) => {

        client.subscribe(
            "/topic/ride/location",
            (message) => {

                const data =
                    JSON.parse(
                        message.body
                    );


                if (
                    data.rideId === rideId
                ) {

                    onLocationUpdate(
                        data
                    );
                }
            }
        );
    });
};


export const disconnectRideLocation = () => {

    disconnectWebSocket();
};