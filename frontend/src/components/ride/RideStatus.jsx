export default function RideStatus({
    status
}) {

    const statusMap = {

        REQUESTED: "Searching for driver...",

        SEARCHING_DRIVER:
            "Searching for nearby driver...",

        DRIVER_ASSIGNED:
            "Driver assigned",

        DRIVER_ACCEPTED:
            "Driver accepted your ride",

        DRIVER_ARRIVING:
            "Driver is arriving",

        DRIVER_ARRIVED:
            "Driver has arrived",

        IN_PROGRESS:
            "Ride in progress",

        STARTED:
            "Ride started",

        COMPLETED:
            "Ride completed",

        CANCELLED:
            "Ride cancelled"

    };


    return (

        <div>

            <h3>
                {statusMap[status] || status}
            </h3>

        </div>

    );

}