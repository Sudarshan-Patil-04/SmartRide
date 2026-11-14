import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getCustomerRide,
    cancelRide
} from "../../api/rideApi";

import RideStatus
    from "../../components/ride/RideStatus";

import RideMap
    from "../../components/ride/RideMap";

import RatingModal
    from "../../components/ride/RatingModal";

import useRideLocation
    from "../../hooks/useRideLocation";


export default function RideDetails() {

    const {
        rideId
    } = useParams();

    const navigate =
        useNavigate();


    // ==========================================
    // RIDE
    // ==========================================

    const [
        ride,
        setRide
    ] = useState(null);


    // ==========================================
    // UI
    // ==========================================

    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const [
        cancelling,
        setCancelling
    ] = useState(false);


    const [
        showRating,
        setShowRating
    ] = useState(false);


    // ==========================================
    // LIVE LOCATION
    // ==========================================

    const {
        driverLocation,
        rideStatus,
        connected
    } = useRideLocation(
        rideId
    );


    // ==========================================
    // LOAD RIDE
    // ==========================================

    const loadRide =
        async () => {

        try {

            setLoading(true);

            setError("");


            const data =
                await getCustomerRide(
                    rideId
                );


            setRide(data);

        }
        catch (err) {

            console.error(
                "Load ride error:",
                err
            );


            setError(
                err.message ||
                "Unable to load ride."
            );

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        if (!rideId) {

            return;

        }


        loadRide();

    }, [rideId]);


    // ==========================================
    // WEBSOCKET STATUS UPDATE
    // ==========================================

    useEffect(() => {

        if (!rideStatus) {

            return;

        }


        setRide(
            previousRide => {

                if (!previousRide) {

                    return previousRide;

                }


                return {

                    ...previousRide,

                    ...rideStatus

                };

            }
        );

    }, [
        rideStatus
    ]);


    // ==========================================
    // FALLBACK STATUS REFRESH
    // ==========================================

    useEffect(() => {

        if (!rideId) {

            return;

        }


        const interval =
            setInterval(

                async () => {

                    try {

                        const data =
                            await getCustomerRide(
                                rideId
                            );


                        setRide(
                            previousRide => {

                                if (
                                    !previousRide
                                ) {

                                    return data;

                                }


                                return {

                                    ...previousRide,

                                    ...data

                                };

                            }
                        );

                    }
                    catch (err) {

                        console.error(
                            "Background ride refresh error:",
                            err
                        );

                    }

                },

                5000

            );


        return () => {

            clearInterval(
                interval
            );

        };

    }, [
        rideId
    ]);


    // ==========================================
    // CANCEL RIDE
    // ==========================================

    const handleCancel =
        async () => {

        if (!ride) {

            return;

        }


        const cancellableStatuses = [

            "REQUESTED",

            "ACCEPTED",

            "DRIVER_ARRIVING"

        ];


        if (
            !cancellableStatuses.includes(
                ride.status
            )
        ) {

            setError(
                "This ride cannot be cancelled now."
            );

            return;

        }


        const confirmed =
            window.confirm(

                "Are you sure you want to cancel this ride?"

            );


        if (!confirmed) {

            return;

        }


        try {

            setError("");

            setCancelling(true);


            const cancelledRide =
                await cancelRide(
                    rideId
                );


            /*
             * Keep the user on this page.
             * This allows them to see the
             * CANCELLED status.
             */

            setRide(
                cancelledRide || {

                    ...ride,

                    status: "CANCELLED"

                }
            );

        }
        catch (err) {

            console.error(
                "Cancel ride error:",
                err
            );


            setError(
                err.message ||
                "Unable to cancel ride."
            );

        }
        finally {

            setCancelling(false);

        }

    };


    // ==========================================
    // STATUS MESSAGE
    // ==========================================

    const getStatusMessage =
        () => {

        switch (
            ride?.status
        ) {

            case "REQUESTED":

                return (
                    "🔎 Finding the nearest available driver..."
                );


            case "ACCEPTED":

                return (
                    "✅ Your driver accepted the ride."
                );


            case "DRIVER_ARRIVING":

                return (
                    "🚗 Your driver is coming to the pickup location."
                );


            case "STARTED":

                return (
                    "🏁 Your ride is currently in progress."
                );


            case "COMPLETED":

                return (
                    "🎉 Ride completed successfully."
                );


            case "CANCELLED":

                return (
                    "❌ This ride has been cancelled."
                );


            default:

                return (
                    "Ride information"
                );

        }

    };


    // ==========================================
    // CAN CANCEL
    // ==========================================

    const canCancel =
        ride &&
        [

            "REQUESTED",

            "ACCEPTED",

            "DRIVER_ARRIVING"

        ].includes(
            ride.status
        );


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="
                min-h-screen
                bg-slate-50
                flex
                items-center
                justify-center
            ">

                <div className="
                    rounded-2xl
                    bg-white
                    px-8
                    py-8
                    text-center
                    shadow-sm
                    border
                    border-slate-200
                ">

                    <div className="
                        mx-auto
                        mb-4
                        h-12
                        w-12
                        rounded-full
                        border-4
                        border-slate-200
                        border-t-blue-600
                        animate-spin
                    " />

                    <p className="
                        font-semibold
                        text-slate-700
                    ">
                        Loading ride...
                    </p>

                    <p className="
                        mt-1
                        text-xs
                        text-slate-400
                    ">
                        Please wait
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error && !ride) {

        return (

            <div className="
                min-h-screen
                bg-slate-50
                flex
                items-center
                justify-center
                p-6
            ">

                <div className="
                    max-w-md
                    w-full
                    rounded-2xl
                    bg-white
                    border
                    border-red-200
                    p-6
                    text-center
                    shadow-sm
                ">

                    <div className="
                        text-4xl
                        mb-4
                    ">
                        ⚠️
                    </div>

                    <h2 className="
                        text-xl
                        font-bold
                        text-slate-900
                    ">
                        Unable to load ride
                    </h2>

                    <p className="
                        mt-2
                        text-sm
                        text-red-600
                    ">
                        {error}
                    </p>


                    <button
                        onClick={() =>
                            navigate(
                                "/customer/dashboard"
                            )
                        }
                        className="
                            mt-6
                            w-full
                            rounded-xl
                            bg-slate-900
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-white
                            hover:bg-slate-800
                        "
                    >
                        ← Back to Dashboard
                    </button>

                </div>

            </div>

        );

    }


    if (!ride) {

        return (

            <div className="
                min-h-screen
                bg-slate-50
                flex
                items-center
                justify-center
            ">

                <div className="
                    text-center
                ">

                    <div className="
                        text-5xl
                        mb-4
                    ">
                        🚕
                    </div>

                    <h2 className="
                        text-xl
                        font-bold
                    ">
                        Ride not found
                    </h2>


                    <button
                        onClick={() =>
                            navigate(
                                "/customer/dashboard"
                            )
                        }
                        className="
                            mt-5
                            rounded-xl
                            bg-slate-900
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-white
                        "
                    >
                        ← Dashboard
                    </button>

                </div>

            </div>

        );

    }


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="
            min-h-screen
            bg-slate-50
            text-slate-900
        ">


            {/* ==========================================
                HEADER
            ========================================== */}

            <header className="
                sticky
                top-0
                z-50
                border-b
                border-slate-200
                bg-white/95
                backdrop-blur
            ">

                <div className="
                    mx-auto
                    flex
                    h-16
                    max-w-7xl
                    items-center
                    justify-between
                    px-4
                    sm:px-6
                    lg:px-8
                ">


                    {/* LOGO */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/customer/dashboard"
                            )
                        }
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-600
                            text-xl
                            text-white
                            shadow-md
                        ">
                            🚕
                        </div>


                        <div className="
                            text-left
                        ">

                            <p className="
                                text-lg
                                font-bold
                                text-slate-900
                            ">
                                SmartRide
                            </p>

                            <p className="
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-widest
                                text-slate-400
                            ">
                                Ride Details
                            </p>

                        </div>

                    </button>


                    {/* DASHBOARD */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/customer/dashboard"
                            )
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-slate-700
                            shadow-sm
                            hover:bg-slate-50
                        "
                    >

                        ←

                        <span className="
                            hidden
                            sm:inline
                        ">
                            Dashboard
                        </span>

                    </button>

                </div>

            </header>


            {/* ==========================================
                MAIN
            ========================================== */}

            <main className="
                mx-auto
                max-w-7xl
                px-4
                py-6
                sm:px-6
                lg:px-8
            ">


                {/* ==========================================
                    TITLE
                ========================================== */}

                <div className="
                    mb-5
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <div>

                        <p className="
                            text-xs
                            font-bold
                            uppercase
                            tracking-widest
                            text-blue-600
                        ">
                            SmartRide
                        </p>

                        <h1 className="
                            mt-1
                            text-2xl
                            font-black
                            text-slate-900
                            sm:text-3xl
                        ">
                            Ride Details
                        </h1>

                    </div>


                    {/* LIVE CONNECTION */}

                    <div className={`
                        inline-flex
                        w-fit
                        items-center
                        gap-2
                        rounded-full
                        px-3
                        py-2
                        text-xs
                        font-bold
                        ${
                            connected
                                ? "bg-green-50 text-green-700"
                                : "bg-yellow-50 text-yellow-700"
                        }
                    `}>

                        <span className={`
                            h-2
                            w-2
                            rounded-full
                            ${
                                connected
                                    ? "bg-green-500"
                                    : "bg-yellow-500"
                            }
                        `} />

                        {connected
                            ? "Live Tracking"
                            : "Connecting..."
                        }

                    </div>

                </div>


                {/* ==========================================
                    CONTENT GRID
                ========================================== */}

                <div className="
                    grid
                    gap-5
                    lg:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.75fr)]
                ">


                    {/* ======================================
                        MAP
                    ====================================== */}

                    <section className="
                        overflow-hidden
                        rounded-3xl
                        bg-white
                        shadow-sm
                        ring-1
                        ring-slate-200
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-slate-100
                            px-5
                            py-4
                        ">

                            <div>

                                <h2 className="
                                    font-bold
                                    text-slate-900
                                ">
                                    Live Ride Tracking
                                </h2>

                                <p className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                ">
                                    Track your driver in real time.
                                </p>

                            </div>


                            {driverLocation && (

                                <span className="
                                    rounded-full
                                    bg-green-50
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-bold
                                    text-green-700
                                ">
                                    🚗 Driver Live
                                </span>

                            )}

                        </div>


                        <div className="
                            h-[480px]
                            sm:h-[560px]
                        ">

                            <RideMap

                                pickup={
                                    ride.pickup
                                }

                                destination={
                                    ride.destination
                                }

                                driverLocation={
                                    driverLocation
                                }

                                setPickup={() => {}}

                                setDestination={() => {}}

                            />

                        </div>

                    </section>


                    {/* ======================================
                        RIGHT PANEL
                    ====================================== */}

                    <aside className="
                        space-y-4
                    ">


                        {/* ==================================
                            STATUS
                        ================================== */}

                        <section className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                                gap-4
                            ">

                                <div>

                                    <p className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-widest
                                        text-slate-400
                                    ">
                                        Current Status
                                    </p>

                                    <h2 className="
                                        mt-1
                                        text-xl
                                        font-black
                                        text-slate-900
                                    ">
                                        {ride.status}
                                    </h2>

                                </div>


                                <span className="
                                    rounded-full
                                    bg-blue-50
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-bold
                                    text-blue-700
                                ">
                                    #{ride.id?.slice(-6)}
                                </span>

                            </div>


                            <div className="
                                mt-4
                                rounded-xl
                                bg-blue-50
                                px-4
                                py-3
                                text-sm
                                font-medium
                                text-blue-700
                            ">

                                {getStatusMessage()}

                            </div>


                            <div className="
                                mt-4
                            ">

                                <RideStatus
                                    status={
                                        ride.status
                                    }
                                />

                            </div>

                        </section>


                        {/* ==================================
                            RIDE INFORMATION
                        ================================== */}

                        <section className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                        ">

                            <h3 className="
                                mb-4
                                font-bold
                                text-slate-900
                            ">
                                Trip Information
                            </h3>


                            <div className="
                                space-y-4
                            ">


                                {/* PICKUP */}

                                <div className="
                                    flex
                                    gap-3
                                ">

                                    <div className="
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-green-100
                                    ">
                                        📍
                                    </div>


                                    <div className="
                                        min-w-0
                                    ">

                                        <p className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-slate-400
                                        ">
                                            Pickup
                                        </p>

                                        <p className="
                                            mt-1
                                            truncate
                                            text-sm
                                            font-semibold
                                            text-slate-800
                                        ">
                                            {ride.pickup
                                                ? `${Number(
                                                    ride.pickup.latitude
                                                  ).toFixed(5)}, ${Number(
                                                    ride.pickup.longitude
                                                  ).toFixed(5)}`
                                                : "N/A"
                                            }
                                        </p>

                                    </div>

                                </div>


                                {/* LINE */}

                                <div className="
                                    ml-4
                                    h-5
                                    border-l-2
                                    border-dashed
                                    border-slate-200
                                " />


                                {/* DESTINATION */}

                                <div className="
                                    flex
                                    gap-3
                                ">

                                    <div className="
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-red-100
                                    ">
                                        🏁
                                    </div>


                                    <div className="
                                        min-w-0
                                    ">

                                        <p className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-slate-400
                                        ">
                                            Destination
                                        </p>

                                        <p className="
                                            mt-1
                                            truncate
                                            text-sm
                                            font-semibold
                                            text-slate-800
                                        ">
                                            {ride.destination
                                                ? `${Number(
                                                    ride.destination.latitude
                                                  ).toFixed(5)}, ${Number(
                                                    ride.destination.longitude
                                                  ).toFixed(5)}`
                                                : "N/A"
                                            }
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* STATS */}

                            <div className="
                                mt-5
                                grid
                                grid-cols-2
                                gap-3
                            ">

                                <div className="
                                    rounded-xl
                                    bg-slate-50
                                    p-3
                                ">

                                    <p className="
                                        text-xs
                                        text-slate-400
                                    ">
                                        Distance
                                    </p>

                                    <p className="
                                        mt-1
                                        font-bold
                                        text-slate-900
                                    ">
                                        {Number(
                                            ride.distance || 0
                                        ).toFixed(2)}
                                        {" "}km
                                    </p>

                                </div>


                                <div className="
                                    rounded-xl
                                    bg-slate-50
                                    p-3
                                ">

                                    <p className="
                                        text-xs
                                        text-slate-400
                                    ">
                                        Fare
                                    </p>

                                    <p className="
                                        mt-1
                                        font-bold
                                        text-slate-900
                                    ">
                                        ₹
                                        {Number(
                                            ride.finalFare ||
                                            ride.estimatedFare ||
                                            0
                                        ).toFixed(2)}
                                    </p>

                                </div>

                            </div>

                        </section>


                        {/* ==================================
                            DRIVER LOCATION
                        ================================== */}

                        {driverLocation && (

                            <section className="
                                rounded-2xl
                                border
                                border-green-200
                                bg-green-50
                                p-4
                            ">

                                <div className="
                                    flex
                                    items-center
                                    gap-3
                                ">

                                    <div className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-white
                                        text-xl
                                        shadow-sm
                                    ">
                                        🚗
                                    </div>


                                    <div>

                                        <p className="
                                            text-sm
                                            font-bold
                                            text-green-900
                                        ">
                                            Driver location is live
                                        </p>

                                        <p className="
                                            mt-1
                                            text-xs
                                            text-green-700
                                        ">
                                            Your driver is currently
                                            visible on the map.
                                        </p>

                                    </div>

                                </div>


                                <div className="
                                    mt-3
                                    grid
                                    grid-cols-2
                                    gap-2
                                ">

                                    <div className="
                                        rounded-lg
                                        bg-white/70
                                        p-2
                                    ">

                                        <p className="
                                            text-[10px]
                                            text-green-600
                                        ">
                                            Latitude
                                        </p>

                                        <p className="
                                            text-xs
                                            font-bold
                                            text-green-900
                                        ">
                                            {Number(
                                                driverLocation.latitude
                                            ).toFixed(5)}
                                        </p>

                                    </div>


                                    <div className="
                                        rounded-lg
                                        bg-white/70
                                        p-2
                                    ">

                                        <p className="
                                            text-[10px]
                                            text-green-600
                                        ">
                                            Longitude
                                        </p>

                                        <p className="
                                            text-xs
                                            font-bold
                                            text-green-900
                                        ">
                                            {Number(
                                                driverLocation.longitude
                                            ).toFixed(5)}
                                        </p>

                                    </div>

                                </div>

                            </section>

                        )}


                        {/* ==================================
                            CANCEL
                        ================================== */}

                        {canCancel && (

                            <button
                                type="button"
                                onClick={
                                    handleCancel
                                }
                                disabled={
                                    cancelling
                                }
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-red-200
                                    bg-white
                                    px-5
                                    py-3.5
                                    text-sm
                                    font-bold
                                    text-red-600
                                    shadow-sm
                                    transition
                                    hover:bg-red-50
                                    disabled:cursor-not-allowed
                                    disabled:bg-gray-100
                                    disabled:text-gray-400
                                "
                            >

                                {cancelling
                                    ? "Cancelling Ride..."
                                    : "❌ Cancel Ride"
                                }

                            </button>

                        )}


                        {/* ==================================
                            CANCELLED MESSAGE
                        ================================== */}

                        {ride.status ===
                            "CANCELLED" && (

                            <div className="
                                rounded-2xl
                                border
                                border-red-200
                                bg-red-50
                                p-4
                            ">

                                <p className="
                                    font-bold
                                    text-red-800
                                ">
                                    Ride Cancelled
                                </p>

                                <p className="
                                    mt-1
                                    text-xs
                                    text-red-600
                                ">
                                    This ride has been cancelled.
                                </p>

                            </div>

                        )}


                        {/* ==================================
                            PAYMENT
                        ================================== */}

                        {ride.status ===
                            "COMPLETED" && (

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/customer/payment/${ride.id}`
                                    )
                                }
                                className="
                                    w-full
                                    rounded-2xl
                                    bg-blue-600
                                    px-5
                                    py-3.5
                                    text-sm
                                    font-bold
                                    text-white
                                    shadow-lg
                                    transition
                                    hover:bg-blue-700
                                "
                            >
                                💳 Pay Fare
                            </button>

                        )}


                        {/* ==================================
                            RATING
                        ================================== */}

                        {ride.status ===
                            "COMPLETED" && (

                            <button
                                type="button"
                                onClick={() =>
                                    setShowRating(
                                        true
                                    )
                                }
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-yellow-200
                                    bg-yellow-50
                                    px-5
                                    py-3.5
                                    text-sm
                                    font-bold
                                    text-yellow-700
                                    transition
                                    hover:bg-yellow-100
                                "
                            >
                                ⭐ Rate Driver
                            </button>

                        )}


                        {/* ==================================
                            ERROR
                        ================================== */}

                        {error && (

                            <div className="
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                text-red-700
                            ">
                                ❌ {error}
                            </div>

                        )}


                        {/* ==================================
                            DASHBOARD
                        ================================== */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/customer/dashboard"
                                )
                            }
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                px-5
                                py-3.5
                                text-sm
                                font-bold
                                text-slate-700
                                shadow-sm
                                transition
                                hover:bg-slate-50
                            "
                        >
                            ← Back to Dashboard
                        </button>

                    </aside>

                </div>

            </main>


            {/* ==========================================
                RATING MODAL
            ========================================== */}

            {showRating && (

                <RatingModal

                    rideId={
                        ride.id
                    }

                    onClose={() =>
                        setShowRating(
                            false
                        )
                    }

                    onSuccess={() => {

                        setShowRating(
                            false
                        );

                    }}

                />

            )}

        </div>

    );

}