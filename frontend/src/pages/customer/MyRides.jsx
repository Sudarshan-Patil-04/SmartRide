import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    getCustomerRides,
    deleteCustomerRide
} from "../../api/rideApi";


export default function MyRides() {

    const navigate =
        useNavigate();

    const [rides, setRides] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [filter, setFilter] =
        useState("ALL");

    const [deleting, setDeleting] =
        useState(null);


    // ==========================================
    // LOAD RIDES
    // ==========================================

    const loadRides = async () => {

        try {

            setLoading(true);

            setError("");

            const data =
                await getCustomerRides();

            setRides(
                Array.isArray(data)
                    ? data
                    : []
            );

        }
        catch (err) {

            setError(
                err.message ||
                "Unable to load rides"
            );

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadRides();

    }, []);


    // ==========================================
    // DELETE RIDE
    // ==========================================

    const handleDelete =
        async (rideId) => {

        const confirmed =
            window.confirm(
                "Delete this ride from your history?"
            );

        if (!confirmed) {

            return;

        }


        try {

            setDeleting(rideId);

            await deleteCustomerRide(
                rideId
            );


            setRides(
                previous =>
                    previous.filter(
                        ride =>
                            ride.id !== rideId
                    )
            );

        }
        catch (err) {

            setError(
                err.message ||
                "Unable to delete ride"
            );

        }
        finally {

            setDeleting(null);

        }

    };


    const filteredRides =
        filter === "ALL"
            ? rides
            : rides.filter(
                ride =>
                    ride.status === filter
            );


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
                    w-10
                    h-10
                    border-4
                    border-slate-200
                    border-t-blue-600
                    rounded-full
                    animate-spin
                " />

            </div>

        );

    }


    return (

        <div className="
            min-h-screen
            bg-slate-50
        ">


            {/* HEADER */}

            <header className="
                bg-white
                border-b
                border-slate-200
            ">

                <div className="
                    max-w-6xl
                    mx-auto
                    px-4
                    py-5
                    flex
                    items-center
                    justify-between
                ">

                    <div>

                        <button
                            onClick={() =>
                                navigate(
                                    "/customer/dashboard"
                                )
                            }
                            className="
                                text-sm
                                text-slate-500
                                hover:text-blue-600
                                mb-2
                            "
                        >
                            ← Dashboard
                        </button>

                        <h1 className="
                            text-2xl
                            font-bold
                        ">
                            My Rides
                        </h1>

                    </div>


                    <button
                        onClick={() =>
                            navigate(
                                "/book-ride"
                            )
                        }
                        className="
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            px-5
                            py-2.5
                            rounded-xl
                            font-semibold
                        "
                    >
                        + Book Ride
                    </button>

                </div>

            </header>



            <main className="
                max-w-6xl
                mx-auto
                px-4
                py-8
            ">


                {/* FILTER */}

                <div className="
                    flex
                    gap-2
                    overflow-x-auto
                    mb-6
                ">

                    {[
                        "ALL",
                        "COMPLETED",
                        "CANCELLED",
                        "REQUESTED",
                        "ACCEPTED",
                        "STARTED"
                    ].map(
                        status => (

                            <button
                                key={status}
                                onClick={() =>
                                    setFilter(
                                        status
                                    )
                                }
                                className={`
                                    px-4
                                    py-2
                                    rounded-xl
                                    text-sm
                                    font-semibold
                                    whitespace-nowrap
                                    ${
                                        filter === status
                                            ? "bg-slate-900 text-white"
                                            : "bg-white text-slate-600 border border-slate-200"
                                    }
                                `}
                            >
                                {status === "ALL"
                                    ? "All Rides"
                                    : status
                                }
                            </button>

                        )
                    )}

                </div>



                {/* ERROR */}

                {error && (

                    <div className="
                        mb-5
                        bg-red-50
                        border
                        border-red-200
                        text-red-700
                        rounded-xl
                        p-4
                    ">
                        {error}
                    </div>

                )}



                {/* RIDES */}

                <div className="
                    space-y-4
                ">

                    {filteredRides
                        .slice()
                        .reverse()
                        .map(
                            ride => (

                                <div
                                    key={ride.id}
                                    className="
                                        bg-white
                                        border
                                        border-slate-200
                                        rounded-2xl
                                        p-5
                                        shadow-sm
                                        hover:shadow-md
                                        transition
                                    "
                                >

                                    <div className="
                                        flex
                                        flex-col
                                        md:flex-row
                                        md:items-center
                                        justify-between
                                        gap-5
                                    ">


                                        {/* LEFT */}

                                        <div className="
                                            flex
                                            gap-4
                                        ">

                                            <div className="
                                                w-12
                                                h-12
                                                bg-blue-50
                                                rounded-xl
                                                flex
                                                items-center
                                                justify-center
                                                text-xl
                                            ">
                                                🚕
                                            </div>


                                            <div>

                                                <h3 className="
                                                    font-bold
                                                ">
                                                    Ride #
                                                    {ride.id}
                                                </h3>


                                                <p className="
                                                    text-sm
                                                    text-slate-500
                                                    mt-1
                                                ">
                                                    Distance:{" "}
                                                    {Number(
                                                        ride.distance || 0
                                                    ).toFixed(2)}
                                                    {" "}km
                                                </p>


                                                <span className="
                                                    inline-block
                                                    mt-2
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    bg-slate-100
                                                    text-slate-700
                                                    text-xs
                                                    font-bold
                                                ">
                                                    {ride.status}
                                                </span>

                                            </div>

                                        </div>



                                        {/* RIGHT */}

                                        <div className="
                                            flex
                                            items-center
                                            gap-3
                                        ">

                                            <div className="
                                                mr-2
                                            ">

                                                <p className="
                                                    text-xs
                                                    text-slate-400
                                                ">
                                                    Fare
                                                </p>

                                                <p className="
                                                    text-lg
                                                    font-bold
                                                ">
                                                    ₹
                                                    {Number(
                                                        ride.finalFare ||
                                                        ride.estimatedFare ||
                                                        0
                                                    ).toFixed(2)}
                                                </p>

                                            </div>


                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/customer/rides/${ride.id}`
                                                    )
                                                }
                                                className="
                                                    px-4
                                                    py-2.5
                                                    rounded-xl
                                                    bg-slate-900
                                                    text-white
                                                    text-sm
                                                    font-semibold
                                                    hover:bg-slate-800
                                                "
                                            >
                                                View
                                            </button>


                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        ride.id
                                                    )
                                                }
                                                disabled={
                                                    deleting ===
                                                    ride.id
                                                }
                                                className="
                                                    px-4
                                                    py-2.5
                                                    rounded-xl
                                                    bg-red-50
                                                    text-red-600
                                                    text-sm
                                                    font-semibold
                                                    hover:bg-red-100
                                                    disabled:opacity-50
                                                "
                                            >
                                                {deleting ===
                                                 ride.id
                                                    ? "Deleting..."
                                                    : "Delete"
                                                }
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}


                    {filteredRides.length === 0 && (

                        <div className="
                            bg-white
                            rounded-2xl
                            border
                            border-slate-200
                            p-12
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
                                No rides found
                            </h2>

                            <p className="
                                text-slate-500
                                mt-2
                                mb-5
                            ">
                                Your ride history will
                                appear here.
                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/book-ride"
                                    )
                                }
                                className="
                                    bg-blue-600
                                    text-white
                                    px-5
                                    py-3
                                    rounded-xl
                                    font-semibold
                                "
                            >
                                Book your first ride
                            </button>

                        </div>

                    )}

                </div>

            </main>

        </div>

    );

}