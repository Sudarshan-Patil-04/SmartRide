import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import RideMap
    from "../../components/ride/RideMap";

import {
    createRide,
    cancelRide
} from "../../api/rideApi";

import useRideLocation
    from "../../hooks/useRideLocation";

import {
    createPaymentOrder,
    verifyPayment
} from "../../api/paymentApi";

import DriverReviews
    from "../../components/ride/DriverReviews";


function BookRide() {

    const navigate = useNavigate();


    // =====================================================
    // LOCATION
    // =====================================================

    const [
        pickup,
        setPickup
    ] = useState(null);


    const [
        destination,
        setDestination
    ] = useState(null);


    // =====================================================
    // RIDE
    // =====================================================

    const [
        ride,
        setRide
    ] = useState(null);


    // =====================================================
    // RIDE TYPE
    // =====================================================

    const [
        rideType,
        setRideType
    ] = useState("ECONOMY");


    // =====================================================
    // UI
    // =====================================================

    const [
        error,
        setError
    ] = useState("");


    const [
        bookingLoading,
        setBookingLoading
    ] = useState(false);


    const [
        paymentLoading,
        setPaymentLoading
    ] = useState(false);


    const [
        paymentCompleted,
        setPaymentCompleted
    ] = useState(false);


    // =====================================================
    // WEBSOCKET
    // =====================================================

    const {

        driverLocation,

        rideStatus,

        connected

    } = useRideLocation(
        ride?.id
    );


    // =====================================================
    // RIDE TYPES
    // =====================================================

    const rideTypes = [

        {
            id: "ECONOMY",

            name: "Economy",

            icon: "🚗",

            description:
                "Affordable everyday rides",

            multiplier: 1

        },

        {
            id: "PREMIUM",

            name: "Premium",

            icon: "🚘",

            description:
                "More comfort for your trip",

            multiplier: 1.4

        },

        {
            id: "XL",

            name: "XL",

            icon: "🚙",

            description:
                "Extra space for groups",

            multiplier: 1.7

        }

    ];


    const selectedRideType =
        rideTypes.find(
            type =>
                type.id === rideType
        );


    // =====================================================
    // WEBSOCKET RIDE STATUS
    // =====================================================

    useEffect(() => {

        if (!rideStatus) {

            return;

        }


        setRide(previousRide => {

            if (!previousRide) {

                return previousRide;

            }


            return {

                ...previousRide,

                ...rideStatus

            };

        });

    }, [

        rideStatus

    ]);


    // =====================================================
    // BOOK RIDE
    // =====================================================

    const handleBookRide = async () => {

        if (!pickup || !destination) {

            setError(
                "Please select pickup and destination."
            );

            return;

        }


        try {

            setError("");

            setBookingLoading(true);


            // =============================================
            // DATA SENT TO SPRING BOOT
            // =============================================

            const rideData = {

                pickup: {

                    latitude:
                        Number(
                            pickup.latitude
                        ),

                    longitude:
                        Number(
                            pickup.longitude
                        )

                },

                destination: {

                    latitude:
                        Number(
                            destination.latitude
                        ),

                    longitude:
                        Number(
                            destination.longitude
                        )

                },

                rideType:
                    rideType

            };


            console.log(
                "Creating ride:",
                rideData
            );


            const result =
                await createRide(
                    rideData
                );


            console.log(
                "Ride created:",
                result
            );


            // =============================================
            // STORE RIDE
            // =============================================

            setRide(result);

        }
        catch (err) {

            console.error(
                "Book ride error:",
                err
            );


            setError(
                err.message ||
                "Failed to book ride."
            );

        }
        finally {

            setBookingLoading(false);

        }

    };


    // =====================================================
    // CANCEL RIDE
    // =====================================================

    const handleCancelRide = async () => {

        if (!ride) {

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


            const cancelledRide =
                await cancelRide(
                    ride.id
                );


            setRide(
                cancelledRide
            );

        }
        catch (err) {

            console.error(
                "Cancel ride error:",
                err
            );


            setError(
                err.message ||
                "Failed to cancel ride."
            );

        }

    };


    // =====================================================
    // PAYMENT
    // =====================================================

    const handlePayment = async () => {

        if (!ride) {

            return;

        }


        if (
            ride.status !==
            "COMPLETED"
        ) {

            setError(
                "Ride must be completed before payment."
            );

            return;

        }


        try {

            setError("");

            setPaymentLoading(true);


            const payment =
                await createPaymentOrder(
                    ride.id
                );


            const confirmPayment =
                window.confirm(

                    `Test Payment\n\n` +

                    `Amount: ₹${payment.amount}\n\n` +

                    `Order ID:\n${payment.razorpayOrderId}\n\n` +

                    `This is a temporary test payment.\n` +

                    `No real money will be charged.\n\n` +

                    `Click OK to simulate payment.`

                );


            if (!confirmPayment) {

                return;

            }


            const paymentData = {

                rideId:
                    ride.id,

                razorpayOrderId:
                    payment.razorpayOrderId,

                razorpayPaymentId:
                    "mock_payment_" +
                    Date.now(),

                razorpaySignature:
                    "mock_signature"

            };


            await verifyPayment(
                paymentData
            );


            setPaymentCompleted(true);


            alert(
                "Payment successful! 🎉"
            );

        }
        catch (err) {

            console.error(
                "Payment error:",
                err
            );


            setError(
                err.message ||
                "Payment failed."
            );

        }
        finally {

            setPaymentLoading(false);

        }

    };


    // =====================================================
    // CAN CANCEL
    // =====================================================

    const canCancelRide =

        ride &&

        [

            "REQUESTED",

            "ACCEPTED",

            "DRIVER_ARRIVING"

        ].includes(
            ride.status
        );


    // =====================================================
    // DISPLAY FARE
    // =====================================================

    const displayFare =

        ride?.estimatedFare

            ? (

                ride.estimatedFare *

                (
                    selectedRideType?.multiplier ||
                    1
                )

            ).toFixed(0)

            : null;


    // =====================================================
    // LOCATION CARD
    // =====================================================

    const LocationCard = () => (

        <div className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-4
            shadow-sm
        ">

            {/* PICKUP */}

            <div className="
                flex
                items-center
                gap-3
            ">

                <div className="
                    flex
                    h-10
                    w-10
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
                    flex-1
                ">

                    <p className="
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-gray-400
                    ">
                        Pickup
                    </p>


                    <p className="
                        truncate
                        text-sm
                        font-semibold
                        text-gray-800
                    ">

                        {pickup

                            ? `${Number(
                                pickup.latitude
                              ).toFixed(5)}, ${Number(
                                pickup.longitude
                              ).toFixed(5)}`

                            : "Select pickup location"

                        }

                    </p>

                </div>

            </div>


            <div className="
                ml-5
                h-6
                border-l-2
                border-dashed
                border-gray-200
            " />


            {/* DESTINATION */}

            <div className="
                flex
                items-center
                gap-3
            ">

                <div className="
                    flex
                    h-10
                    w-10
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
                    flex-1
                ">

                    <p className="
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-gray-400
                    ">
                        Destination
                    </p>


                    <p className="
                        truncate
                        text-sm
                        font-semibold
                        text-gray-800
                    ">

                        {destination

                            ? `${Number(
                                destination.latitude
                              ).toFixed(5)}, ${Number(
                                destination.longitude
                              ).toFixed(5)}`

                            : "Select destination"

                        }

                    </p>

                </div>

            </div>

        </div>

    );


    // =====================================================
    // STATUS
    // =====================================================

    const getStatusMessage = () => {

        switch (ride?.status) {

            case "REQUESTED":

                return "🔎 Finding the nearest available driver...";


            case "ACCEPTED":

                return "✅ Driver accepted your ride.";


            case "DRIVER_ARRIVING":

                return "🚗 Your driver is coming to you.";


            case "STARTED":

                return "🏁 Your ride has started.";


            case "COMPLETED":

                return "🎉 Ride completed successfully.";


            case "CANCELLED":

                return "❌ Ride cancelled.";


            default:

                return "";

        }

    };


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div className="
            min-h-screen
            bg-slate-50
        ">


            {/* HEADER */}

            <header className="
                sticky
                top-0
                z-20
                border-b
                border-gray-200
                bg-white/95
                backdrop-blur
            ">

                <div className="
                    mx-auto
                    flex
                    max-w-7xl
                    items-center
                    justify-between
                    px-4
                    py-4
                    sm:px-6
                    lg:px-8
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
                            text-xl
                            font-bold
                            text-gray-900
                            sm:text-2xl
                        ">
                            Book a ride
                        </h1>

                    </div>


                    <button

                        type="button"

                        onClick={() =>
                            navigate(
                                "/customer/dashboard"
                            )
                        }

                        className="
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-gray-700
                            shadow-sm
                        "
                    >

                        ← Dashboard

                    </button>

                </div>

            </header>


            {/* CONTENT */}

            <main className="
                mx-auto
                max-w-7xl
                px-4
                py-5
                sm:px-6
                lg:px-8
            ">

                <div className="
                    grid
                    gap-5
                    lg:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.75fr)]
                ">


                    {/* ================================================= */}
                    {/* MAP */}
                    {/* ================================================= */}

                    <section className="
                        overflow-hidden
                        rounded-3xl
                        bg-white
                        shadow-sm
                        ring-1
                        ring-gray-200
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-gray-100
                            px-5
                            py-4
                        ">

                            <div>

                                <h2 className="
                                    font-bold
                                    text-gray-900
                                ">
                                    Choose your route
                                </h2>


                                <p className="
                                    mt-1
                                    text-xs
                                    text-gray-500
                                ">
                                    Search or tap the map to choose
                                    your locations.
                                </p>

                            </div>


                            {ride && (

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    bg-green-50
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-semibold
                                    text-green-700
                                ">

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
                                        ? "Live"
                                        : "Connecting"
                                    }

                                </div>

                            )}

                        </div>


                        <div className="
                            h-[480px]
                            sm:h-[560px]
                        ">

                            <RideMap

                                pickup={pickup}

                                destination={destination}

                                driverLocation={
                                    driverLocation
                                }

                                setPickup={
                                    setPickup
                                }

                                setDestination={
                                    setDestination
                                }

                            />

                        </div>

                    </section>


                    {/* ================================================= */}
                    {/* RIGHT PANEL */}
                    {/* ================================================= */}

                    <aside className="space-y-4">


                        <LocationCard />


                        {/* ================================================= */}
                        {/* RIDE TYPES */}
                        {/* ================================================= */}

                        {!ride && (

                            <section className="
                                rounded-2xl
                                border
                                border-gray-200
                                bg-white
                                p-4
                                shadow-sm
                            ">

                                <div className="
                                    mb-3
                                    flex
                                    items-center
                                    justify-between
                                ">

                                    <h2 className="
                                        font-bold
                                        text-gray-900
                                    ">
                                        Choose your ride
                                    </h2>


                                    <span className="
                                        text-xs
                                        text-gray-400
                                    ">
                                        3 options
                                    </span>

                                </div>


                                <div className="space-y-2">

                                    {rideTypes.map(type => (

                                        <button

                                            key={type.id}

                                            type="button"

                                            onClick={() =>
                                                setRideType(
                                                    type.id
                                                )
                                            }

                                            className={`
                                                w-full
                                                rounded-xl
                                                border
                                                p-3
                                                text-left
                                                transition
                                                ${
                                                    rideType ===
                                                    type.id

                                                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"

                                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                                }
                                            `}
                                        >

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
                                                    rounded-xl
                                                    bg-gray-100
                                                    text-xl
                                                ">

                                                    {type.icon}

                                                </div>


                                                <div className="
                                                    min-w-0
                                                    flex-1
                                                ">

                                                    <p className="
                                                        text-sm
                                                        font-bold
                                                        text-gray-900
                                                    ">
                                                        {type.name}
                                                    </p>


                                                    <p className="
                                                        truncate
                                                        text-xs
                                                        text-gray-500
                                                    ">
                                                        {
                                                            type.description
                                                        }
                                                    </p>

                                                </div>


                                                <span className="
                                                    text-xs
                                                    font-bold
                                                    text-gray-500
                                                ">

                                                    {type.id ===
                                                    "ECONOMY"
                                                        ? "₹"
                                                        : type.id ===
                                                          "PREMIUM"
                                                            ? "₹₹"
                                                            : "₹₹₹"
                                                    }

                                                </span>

                                            </div>

                                        </button>

                                    ))}

                                </div>

                            </section>

                        )}


                        {/* ================================================= */}
                        {/* FARE */}
                        {/* ================================================= */}

                        {!ride &&
                         pickup &&
                         destination && (

                            <section className="
                                rounded-2xl
                                border
                                border-gray-200
                                bg-white
                                p-5
                                shadow-sm
                            ">

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                ">

                                    <div>

                                        <p className="
                                            text-xs
                                            text-gray-400
                                        ">
                                            Estimated fare
                                        </p>


                                        <p className="
                                            mt-1
                                            text-3xl
                                            font-black
                                            text-gray-900
                                        ">

                                            {displayFare
                                                ? `₹${displayFare}`
                                                : "..."
                                            }

                                        </p>

                                    </div>


                                    <div className="
                                        rounded-xl
                                        bg-gray-100
                                        px-3
                                        py-2
                                        text-right
                                    ">

                                        <p className="
                                            text-[10px]
                                            uppercase
                                            text-gray-400
                                        ">
                                            Ride
                                        </p>


                                        <p className="
                                            text-sm
                                            font-bold
                                            text-gray-800
                                        ">
                                            {
                                                selectedRideType?.name
                                            }
                                        </p>

                                    </div>

                                </div>

                            </section>

                        )}


                        {/* ================================================= */}
                        {/* BOOK */}
                        {/* ================================================= */}

                        {!ride && (

                            <button

                                type="button"

                                onClick={
                                    handleBookRide
                                }

                                disabled={
                                    !pickup ||
                                    !destination ||
                                    bookingLoading
                                }

                                className="
                                    w-full
                                    rounded-2xl
                                    bg-gray-950
                                    px-5
                                    py-4
                                    text-sm
                                    font-bold
                                    text-white
                                    shadow-lg
                                    disabled:bg-gray-300
                                "
                            >

                                {bookingLoading

                                    ? "Finding your ride..."

                                    : `🚕 Book ${selectedRideType?.name}`

                                }

                            </button>

                        )}


                        {/* ================================================= */}
                        {/* RIDE STATUS */}
                        {/* ================================================= */}

                        {ride && (

                            <section className="
                                rounded-2xl
                                border
                                border-gray-200
                                bg-white
                                p-5
                                shadow-sm
                            ">

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                ">

                                    <div>

                                        <p className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-widest
                                            text-gray-400
                                        ">
                                            Current status
                                        </p>


                                        <h2 className="
                                            mt-1
                                            text-xl
                                            font-black
                                            text-gray-900
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
                                        text-blue-600
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
                                    grid
                                    grid-cols-2
                                    gap-3
                                ">

                                    <div className="
                                        rounded-xl
                                        bg-gray-50
                                        p-3
                                    ">

                                        <p className="
                                            text-xs
                                            text-gray-400
                                        ">
                                            Distance
                                        </p>


                                        <p className="
                                            mt-1
                                            font-bold
                                            text-gray-900
                                        ">
                                            {ride.distance} km
                                        </p>

                                    </div>


                                    <div className="
                                        rounded-xl
                                        bg-gray-50
                                        p-3
                                    ">

                                        <p className="
                                            text-xs
                                            text-gray-400
                                        ">
                                            Fare
                                        </p>


                                        <p className="
                                            mt-1
                                            font-bold
                                            text-gray-900
                                        ">
                                            ₹{ride.estimatedFare}
                                        </p>

                                    </div>

                                </div>

                            </section>

                        )}


                        {/* ================================================= */}
                        {/* DRIVER LOCATION */}
                        {/* ================================================= */}

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
                                            text-xs
                                            text-green-700
                                        ">
                                            Your driver is shown on
                                            the map.
                                        </p>

                                    </div>

                                </div>

                            </section>

                        )}


                        {/* ================================================= */}
                        {/* CANCEL */}
                        {/* ================================================= */}

                        {canCancelRide && (

                            <button

                                type="button"

                                onClick={
                                    handleCancelRide
                                }

                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-red-200
                                    bg-white
                                    px-5
                                    py-3
                                    text-sm
                                    font-bold
                                    text-red-600
                                    hover:bg-red-50
                                "
                            >

                                Cancel Ride

                            </button>

                        )}


                        {/* ================================================= */}
                        {/* PAYMENT */}
                        {/* ================================================= */}

                        {ride?.status ===
                            "COMPLETED" && (

                            <section className="
                                rounded-2xl
                                border
                                border-gray-200
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
                                            text-xs
                                            text-gray-400
                                        ">
                                            Final fare
                                        </p>


                                        <p className="
                                            text-2xl
                                            font-black
                                            text-gray-900
                                        ">
                                            ₹{ride.finalFare}
                                        </p>

                                    </div>


                                    {paymentCompleted ? (

                                        <span className="
                                            rounded-full
                                            bg-green-100
                                            px-3
                                            py-2
                                            text-xs
                                            font-bold
                                            text-green-700
                                        ">
                                            ✓ Paid
                                        </span>

                                    ) : (

                                        <button

                                            type="button"

                                            onClick={
                                                handlePayment
                                            }

                                            disabled={
                                                paymentLoading
                                            }

                                            className="
                                                rounded-xl
                                                bg-blue-600
                                                px-4
                                                py-3
                                                text-sm
                                                font-bold
                                                text-white
                                                disabled:bg-gray-300
                                            "
                                        >

                                            {paymentLoading

                                                ? "Processing..."

                                                : "💳 Pay Now"

                                            }

                                        </button>

                                    )}

                                </div>

                            </section>

                        )}


                        {/* ================================================= */}
                        {/* REVIEWS */}
                        {/* ================================================= */}

                        {ride?.status ===
                            "COMPLETED" &&

                         ride?.driverId && (

                            <section className="
                                rounded-2xl
                                border
                                border-gray-200
                                bg-white
                                p-5
                                shadow-sm
                            ">

                                <h3 className="
                                    mb-3
                                    font-bold
                                    text-gray-900
                                ">
                                    ⭐ Driver Reviews
                                </h3>


                                <DriverReviews

                                    driverId={
                                        ride.driverId
                                    }

                                />

                            </section>

                        )}


                        {/* ================================================= */}
                        {/* ERROR */}
                        {/* ================================================= */}

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


                        {/* DASHBOARD */}

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
                                border-gray-200
                                bg-white
                                px-5
                                py-3.5
                                text-sm
                                font-bold
                                text-gray-700
                                shadow-sm
                            "
                        >

                            ← Back to Dashboard

                        </button>

                    </aside>

                </div>

            </main>

        </div>

    );

}


export default BookRide;