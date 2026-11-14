import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    getCustomerRides
} from "../../api/rideApi";


export default function CustomerDashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [rides, setRides] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [filter, setFilter] = useState("ALL");


    // ==========================================
    // LOAD USER
    // ==========================================

    useEffect(() => {

        const savedUser =
            localStorage.getItem("user");

        if (!savedUser) {

            navigate("/login");

            return;
        }

        try {

            const userData =
                JSON.parse(savedUser);

            setUser(userData);

            loadRides();

        }
        catch (err) {

            console.error(err);

            localStorage.removeItem("user");
            localStorage.removeItem("token");

            navigate("/login");

        }

    }, []);


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

            console.error(err);

            setError(
                err.message ||
                "Unable to load rides"
            );

        }
        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/login");

    };


    // ==========================================
    // ACTIVE RIDE
    // ==========================================

    const activeRide =
        rides.find(
            ride =>
                ride.status === "REQUESTED" ||
                ride.status === "ACCEPTED" ||
                ride.status === "DRIVER_ARRIVING" ||
                ride.status === "STARTED"
        );


    // ==========================================
    // FILTER RIDES
    // ==========================================

    const filteredRides =
        useMemo(() => {

            if (filter === "ALL") {

                return rides;

            }

            return rides.filter(
                ride =>
                    ride.status === filter
            );

        }, [rides, filter]);


    // ==========================================
    // STATISTICS
    // ==========================================

    const completedRides =
        rides.filter(
            ride =>
                ride.status === "COMPLETED"
        ).length;


    const cancelledRides =
        rides.filter(
            ride =>
                ride.status === "CANCELLED"
        ).length;


    const totalSpent =
        rides
            .filter(
                ride =>
                    ride.status === "COMPLETED"
            )
            .reduce(
                (total, ride) =>
                    total +
                    Number(
                        ride.finalFare ||
                        ride.estimatedFare ||
                        0
                    ),
                0
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
                    text-center
                ">

                    <div className="
                        w-12
                        h-12
                        border-4
                        border-slate-200
                        border-t-blue-600
                        rounded-full
                        animate-spin
                        mx-auto
                        mb-4
                    " />

                    <p className="
                        text-slate-500
                        font-medium
                    ">
                        Loading SmartRide...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="
            min-h-screen
            bg-slate-50
            text-slate-900
        ">


            {/* ================================= */}
            {/* NAVBAR */}
            {/* ================================= */}

            <header className="
                sticky
                top-0
                z-50
                bg-white
                border-b
                border-slate-200
                shadow-sm
            ">

                <div className="
                    max-w-7xl
                    mx-auto
                    px-4
                    sm:px-6
                    lg:px-8
                    h-16
                    flex
                    items-center
                    justify-between
                ">


                    {/* LOGO */}

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            cursor-pointer
                        "
                        onClick={() =>
                            navigate(
                                "/customer/dashboard"
                            )
                        }
                    >

                        <div className="
                            w-10
                            h-10
                            rounded-xl
                            bg-blue-600
                            flex
                            items-center
                            justify-center
                            text-white
                            text-xl
                            shadow-md
                        ">
                            🚕
                        </div>

                        <div>

                            <h1 className="
                                font-bold
                                text-xl
                            ">
                                SmartRide
                            </h1>

                            <p className="
                                text-[10px]
                                text-slate-400
                                uppercase
                                tracking-widest
                            ">
                                Move smarter
                            </p>

                        </div>

                    </div>


                    {/* NAV */}

                    <div className="
                        flex
                        items-center
                        gap-2
                    ">

                        <button
                            onClick={() =>
                                navigate(
                                    "/customer/rides"
                                )
                            }
                            className="
                                hidden
                                sm:block
                                px-4
                                py-2
                                rounded-lg
                                text-sm
                                font-medium
                                text-slate-600
                                hover:bg-slate-100
                            "
                        >
                            My Rides
                        </button>


                        <button
                            onClick={() =>
                                navigate(
                                    "/customer/profile"
                                )
                            }
                            className="
                                px-4
                                py-2
                                rounded-lg
                                bg-slate-100
                                hover:bg-slate-200
                                text-sm
                                font-medium
                            "
                        >
                            👤
                            <span className="hidden sm:inline ml-2">
                                Profile
                            </span>
                        </button>


                        <button
                            onClick={handleLogout}
                            className="
                                px-4
                                py-2
                                rounded-lg
                                text-red-600
                                hover:bg-red-50
                                text-sm
                                font-medium
                            "
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </header>



            {/* ================================= */}
            {/* MAIN */}
            {/* ================================= */}

            <main className="
                max-w-7xl
                mx-auto
                px-4
                sm:px-6
                lg:px-8
                py-8
            ">


                {/* ================================= */}
                {/* HERO */}
                {/* ================================= */}

                <section className="
                    relative
                    overflow-hidden
                    rounded-3xl
                    bg-slate-900
                    text-white
                    p-8
                    md:p-12
                    mb-8
                    shadow-xl
                ">

                    <div className="
                        absolute
                        -right-20
                        -top-20
                        w-72
                        h-72
                        bg-blue-600
                        rounded-full
                        opacity-30
                        blur-3xl
                    " />

                    <div className="
                        absolute
                        -left-20
                        -bottom-20
                        w-72
                        h-72
                        bg-indigo-600
                        rounded-full
                        opacity-20
                        blur-3xl
                    " />


                    <div className="
                        relative
                        z-10
                        max-w-2xl
                    ">

                        <p className="
                            text-blue-400
                            font-semibold
                            text-sm
                            uppercase
                            tracking-wider
                            mb-3
                        ">
                            Smart travel starts here
                        </p>


                        <h2 className="
                            text-3xl
                            md:text-5xl
                            font-bold
                            leading-tight
                            mb-4
                        ">

                            Where are you
                            <span className="
                                text-blue-400
                            ">
                                {" "}going?
                            </span>

                        </h2>


                        <p className="
                            text-slate-300
                            mb-7
                            text-lg
                        ">
                            Book a comfortable ride
                            and get there safely.
                        </p>


                        <button
                            onClick={() =>
                                navigate(
                                    "/book-ride"
                                )
                            }
                            className="
                                bg-blue-600
                                hover:bg-blue-700
                                px-7
                                py-3.5
                                rounded-xl
                                font-semibold
                                shadow-lg
                                shadow-blue-600/20
                                transition
                                hover:-translate-y-0.5
                            "
                        >
                            🚕 Book a Ride
                        </button>

                    </div>

                </section>



                {/* ================================= */}
                {/* ACTIVE RIDE */}
                {/* ================================= */}

                {activeRide && (

                    <section className="
                        mb-8
                        rounded-2xl
                        bg-white
                        border
                        border-blue-100
                        shadow-sm
                        overflow-hidden
                    ">

                        <div className="
                            bg-blue-50
                            px-6
                            py-4
                            flex
                            items-center
                            justify-between
                        ">

                            <div className="
                                flex
                                items-center
                                gap-3
                            ">

                                <span className="
                                    w-10
                                    h-10
                                    rounded-full
                                    bg-blue-600
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                ">
                                    🚕
                                </span>

                                <div>

                                    <h3 className="
                                        font-bold
                                        text-slate-900
                                    ">
                                        Active Ride
                                    </h3>

                                    <p className="
                                        text-xs
                                        text-slate-500
                                    ">
                                        Ride is currently
                                        in progress
                                    </p>

                                </div>

                            </div>


                            <span className="
                                px-3
                                py-1.5
                                rounded-full
                                bg-blue-100
                                text-blue-700
                                text-xs
                                font-bold
                            ">
                                {activeRide.status}
                            </span>

                        </div>


                        <div className="
                            p-6
                            grid
                            grid-cols-1
                            sm:grid-cols-3
                            gap-6
                            items-center
                        ">

                            <div>

                                <p className="
                                    text-xs
                                    text-slate-400
                                    uppercase
                                    tracking-wide
                                ">
                                    Distance
                                </p>

                                <p className="
                                    text-xl
                                    font-bold
                                ">
                                    {Number(
                                        activeRide.distance || 0
                                    ).toFixed(2)} km
                                </p>

                            </div>


                            <div>

                                <p className="
                                    text-xs
                                    text-slate-400
                                    uppercase
                                    tracking-wide
                                ">
                                    Estimated Fare
                                </p>

                                <p className="
                                    text-xl
                                    font-bold
                                ">
                                    ₹
                                    {Number(
                                        activeRide.finalFare ||
                                        activeRide.estimatedFare ||
                                        0
                                    ).toFixed(2)}
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    navigate(
                                        `/customer/rides/${activeRide.id}`
                                    )
                                }
                                className="
                                    bg-slate-900
                                    hover:bg-slate-800
                                    text-white
                                    px-5
                                    py-3
                                    rounded-xl
                                    font-semibold
                                    transition
                                "
                            >
                                Track Ride →
                            </button>

                        </div>

                    </section>

                )}



                {/* ================================= */}
                {/* STATS */}
                {/* ================================= */}

                <section className="
                    grid
                    grid-cols-2
                    lg:grid-cols-4
                    gap-4
                    mb-8
                ">


                    <StatCard
                        icon="🚕"
                        title="Total Rides"
                        value={rides.length}
                    />


                    <StatCard
                        icon="✓"
                        title="Completed"
                        value={completedRides}
                    />


                    <StatCard
                        icon="✕"
                        title="Cancelled"
                        value={cancelledRides}
                    />


                    <StatCard
                        icon="₹"
                        title="Total Spent"
                        value={
                            `₹${totalSpent.toFixed(0)}`
                        }
                    />

                </section>



                {/* ================================= */}
                {/* CONTENT GRID */}
                {/* ================================= */}

                <section className="
                    grid
                    lg:grid-cols-3
                    gap-8
                ">


                    {/* ================================= */}
                    {/* RECENT RIDES */}
                    {/* ================================= */}

                    <div className="
                        lg:col-span-2
                        bg-white
                        rounded-2xl
                        border
                        border-slate-200
                        shadow-sm
                    ">


                        <div className="
                            p-6
                            border-b
                            border-slate-100
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center
                            justify-between
                            gap-4
                        ">

                            <div>

                                <h2 className="
                                    text-xl
                                    font-bold
                                ">
                                    Recent Rides
                                </h2>

                                <p className="
                                    text-sm
                                    text-slate-400
                                ">
                                    Your recent travel history
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    navigate(
                                        "/customer/rides"
                                    )
                                }
                                className="
                                    text-blue-600
                                    hover:text-blue-700
                                    text-sm
                                    font-semibold
                                "
                            >
                                View all →
                            </button>

                        </div>



                        {/* FILTERS */}

                        <div className="
                            px-6
                            py-4
                            flex
                            gap-2
                            overflow-x-auto
                        ">

                            {[
                                "ALL",
                                "COMPLETED",
                                "CANCELLED",
                                "REQUESTED"
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
                                            whitespace-nowrap
                                            px-3
                                            py-1.5
                                            rounded-lg
                                            text-xs
                                            font-semibold
                                            transition
                                            ${
                                                filter === status
                                                    ? "bg-slate-900 text-white"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }
                                        `}
                                    >
                                        {status === "ALL"
                                            ? "All"
                                            : status
                                        }
                                    </button>

                                )
                            )}

                        </div>



                        {/* RIDES */}

                        <div className="
                            divide-y
                            divide-slate-100
                        ">

                            {filteredRides
                                .slice()
                                .reverse()
                                .slice(0, 6)
                                .map(
                                    ride => (

                                        <RideRow
                                            key={
                                                ride.id
                                            }
                                            ride={
                                                ride
                                            }
                                            onClick={() =>
                                                navigate(
                                                    `/customer/rides/${ride.id}`
                                                )
                                            }
                                        />

                                    )
                                )}


                            {filteredRides.length === 0 && (

                                <div className="
                                    p-10
                                    text-center
                                ">

                                    <div className="
                                        text-4xl
                                        mb-3
                                    ">
                                        🚕
                                    </div>

                                    <p className="
                                        font-semibold
                                        text-slate-700
                                    ">
                                        No rides found
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>



                    {/* ================================= */}
                    {/* SIDE PANEL */}
                    {/* ================================= */}

                    <div className="
                        space-y-6
                    ">


                        {/* BOOK CARD */}

                        <div className="
                            bg-white
                            rounded-2xl
                            border
                            border-slate-200
                            p-6
                            shadow-sm
                        ">

                            <div className="
                                w-12
                                h-12
                                bg-blue-100
                                rounded-xl
                                flex
                                items-center
                                justify-center
                                text-2xl
                                mb-4
                            ">
                                📍
                            </div>


                            <h3 className="
                                text-lg
                                font-bold
                                mb-2
                            ">
                                Plan your next trip
                            </h3>


                            <p className="
                                text-sm
                                text-slate-500
                                mb-5
                            ">
                                Choose your pickup and
                                destination and we'll
                                handle the rest.
                            </p>


                            <button
                                onClick={() =>
                                    navigate(
                                        "/book-ride"
                                    )
                                }
                                className="
                                    w-full
                                    bg-blue-600
                                    hover:bg-blue-700
                                    text-white
                                    py-3
                                    rounded-xl
                                    font-semibold
                                "
                            >
                                Book Ride
                            </button>

                        </div>



                        {/* PROFILE CARD */}

                        <div className="
                            bg-slate-900
                            text-white
                            rounded-2xl
                            p-6
                        ">

                            <div className="
                                flex
                                items-center
                                gap-4
                                mb-5
                            ">

                                <div className="
                                    w-12
                                    h-12
                                    rounded-full
                                    bg-blue-600
                                    flex
                                    items-center
                                    justify-center
                                    text-xl
                                ">
                                    👤
                                </div>

                                <div>

                                    <h3 className="
                                        font-bold
                                    ">
                                        {user?.name ||
                                         "Customer"}
                                    </h3>

                                    <p className="
                                        text-xs
                                        text-slate-400
                                    ">
                                        {user?.email}
                                    </p>

                                </div>

                            </div>


                            <button
                                onClick={() =>
                                    navigate(
                                        "/customer/profile"
                                    )
                                }
                                className="
                                    w-full
                                    border
                                    border-slate-700
                                    hover:bg-slate-800
                                    py-2.5
                                    rounded-xl
                                    text-sm
                                    font-medium
                                "
                            >
                                Manage Profile
                            </button>

                        </div>

                    </div>

                </section>



                {/* ERROR */}

                {error && (

                    <div className="
                        mt-6
                        p-4
                        rounded-xl
                        bg-red-50
                        border
                        border-red-200
                        text-red-700
                        text-sm
                    ">
                        {error}
                    </div>

                )}

            </main>

        </div>

    );
}



// ==========================================
// STAT CARD
// ==========================================

function StatCard({
    icon,
    title,
    value
}) {

    return (

        <div className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            p-5
            shadow-sm
        ">

            <div className="
                flex
                items-center
                justify-between
                mb-4
            ">

                <span className="
                    w-10
                    h-10
                    rounded-xl
                    bg-slate-100
                    flex
                    items-center
                    justify-center
                    font-bold
                ">
                    {icon}
                </span>

            </div>


            <p className="
                text-xs
                text-slate-400
                uppercase
                tracking-wide
            ">
                {title}
            </p>


            <p className="
                text-2xl
                font-bold
                mt-1
            ">
                {value}
            </p>

        </div>

    );

}



// ==========================================
// RIDE ROW
// ==========================================

function RideRow({
    ride,
    onClick
}) {

    const statusStyle = {

        COMPLETED:
            "bg-emerald-50 text-emerald-700",

        CANCELLED:
            "bg-red-50 text-red-700",

        REQUESTED:
            "bg-amber-50 text-amber-700",

        ACCEPTED:
            "bg-blue-50 text-blue-700",

        STARTED:
            "bg-indigo-50 text-indigo-700",

        DRIVER_ARRIVING:
            "bg-purple-50 text-purple-700"

    };


    return (

        <div
            onClick={onClick}
            className="
                px-6
                py-5
                flex
                items-center
                justify-between
                gap-4
                cursor-pointer
                hover:bg-slate-50
                transition
            "
        >

            <div className="
                flex
                items-center
                gap-4
                min-w-0
            ">

                <div className="
                    w-11
                    h-11
                    rounded-xl
                    bg-slate-100
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                ">
                    🚕
                </div>


                <div className="min-w-0">

                    <p className="
                        font-semibold
                        truncate
                    ">
                        Ride #{ride.id}
                    </p>

                    <p className="
                        text-xs
                        text-slate-400
                        mt-1
                    ">
                        {Number(
                            ride.distance || 0
                        ).toFixed(2)} km
                    </p>

                </div>

            </div>


            <div className="
                text-right
                flex-shrink-0
            ">

                <p className="
                    font-bold
                ">
                    ₹
                    {Number(
                        ride.finalFare ||
                        ride.estimatedFare ||
                        0
                    ).toFixed(2)}
                </p>


                <span className={`
                    inline-block
                    mt-1
                    px-2.5
                    py-1
                    rounded-full
                    text-[10px]
                    font-bold
                    ${
                        statusStyle[
                            ride.status
                        ] ||
                        "bg-slate-100 text-slate-600"
                    }
                `}>
                    {ride.status}
                </span>

            </div>

        </div>

    );

}