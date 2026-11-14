import {
    Client
} from "@stomp/stompjs";

import SockJS
    from "sockjs-client";


let client = null;


// ==========================================
// CONNECT
// ==========================================

export const connectWebSocket = (
    onConnected,
    onDisconnected
) => {

    // Already connected
    if (
        client &&
        client.connected
    ) {

        onConnected(client);

        return;

    }


    // Already connecting
    if (
        client &&
        client.active
    ) {

        return;

    }


    client =
        new Client({

            webSocketFactory:
                () =>
                    new SockJS(
                        "http://localhost:8080/ws"
                    ),


            reconnectDelay:
                5000,


            debug:
                (message) => {

                    console.log(
                        "STOMP:",
                        message
                    );

                },


            onConnect:
                () => {

                    console.log(
                        "Customer WebSocket connected"
                    );


                    onConnected(
                        client
                    );

                },


            onDisconnect:
                () => {

                    console.log(
                        "Customer WebSocket disconnected"
                    );


                    if (
                        onDisconnected
                    ) {

                        onDisconnected();

                    }

                },


            onStompError:
                (frame) => {

                    console.error(
                        "STOMP error:",
                        frame
                    );

                },


            onWebSocketError:
                (error) => {

                    console.error(
                        "WebSocket error:",
                        error
                    );

                }

        });


    client.activate();

};


// ==========================================
// DISCONNECT
// ==========================================

export const disconnectWebSocket =
    () => {

        if (client) {

            console.log(
                "Disconnecting WebSocket..."
            );


            client.deactivate();

            client = null;

        }

    };