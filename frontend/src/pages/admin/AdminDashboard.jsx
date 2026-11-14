import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    UserRound,
    Car,
    Star,
    LogOut,
    Menu,
    X,
    RefreshCw,
    ShieldCheck,
    Clock,
    Wifi,
    CheckCircle,
    IndianRupee,
    AlertCircle,
    TrendingUp
} from "lucide-react";

import {
    getAdminDashboardStats
} from "../../api/adminApi";


// =====================================================
// ADMIN DASHBOARD
// =====================================================

function AdminDashboard() {

    const navigate =
        useNavigate();


    // =================================================
    // USER
    // =================================================

    const [user, setUser] =
        useState(null);


    // =================================================
    // UI STATE
    // =================================================

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =================================================
    // DASHBOARD DATA
    // =================================================

    const [stats, setStats] = useState({

        totalDrivers: 0,

        pendingDrivers: 0,

        onlineDrivers: 0,

        totalCustomers: 0,

        totalRides: 0,

        completedRides: 0,

        totalRevenue: 0

    });


    // =================================================
    // LOAD USER
    // =================================================

    useEffect(() => {

        const savedUser =
            localStorage.getItem("user");


        if (!savedUser) {

            return;

        }


        try {

            const parsedUser =
                JSON.parse(savedUser);

            setUser(
                parsedUser
            );

        }
        catch (err) {

            console.error(
                "Failed to parse user:",
                err
            );

        }

    }, []);


    // =================================================
    // LOAD DASHBOARD
    // =================================================

    const loadDashboard =
        async () => {

            setLoading(true);

            setError("");


            try {

                const response =
                    await getAdminDashboardStats();


                console.log(
                    "Admin dashboard response:",
                    response
                );


                setStats({

                    totalDrivers:
                        response?.totalDrivers ?? 0,

                    pendingDrivers:
                        response?.pendingDrivers ?? 0,

                    onlineDrivers:
                        response?.onlineDrivers ?? 0,

                    totalCustomers:
                        response?.totalCustomers ?? 0,

                    totalRides:
                        response?.totalRides ?? 0,

                    completedRides:
                        response?.completedRides ?? 0,

                    totalRevenue:
                        response?.totalRevenue ?? 0

                });

            }
            catch (err) {

                console.error(
                    "Dashboard error:",
                    err
                );


                setError(
                    err?.message ||
                    "Unable to load dashboard data."
                );

            }
            finally {

                setLoading(false);

            }

        };


    // =================================================
    // INITIAL LOAD
    // =================================================

    useEffect(() => {

        loadDashboard();

    }, []);


    // =================================================
    // LOGOUT
    // =================================================

    const handleLogout =
        () => {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "driver"
            );


            navigate(
                "/login"
            );

        };


    // =================================================
    // NAVIGATION
    // =================================================

    const goTo =
        (path) => {

            navigate(
                path
            );

            setSidebarOpen(
                false
            );

        };


    // =================================================
    // COMPLETION PERCENTAGE
    // =================================================

    const rideCompletion =
        stats.totalRides > 0

            ? Math.round(
                (
                    stats.completedRides /
                    stats.totalRides
                ) * 100
            )

            : 0;


    // =================================================
    // DRIVER VERIFICATION
    // =================================================

    const driverVerification =
        stats.totalDrivers > 0

            ? Math.round(
                (
                    (
                        stats.totalDrivers -
                        stats.pendingDrivers
                    ) /
                    stats.totalDrivers
                ) * 100
            )

            : 0;


    // =================================================
    // STAT CARD
    // =================================================

    const StatCard = ({
        title,
        value,
        description,
        icon: Icon,
        iconClass
    }) => {

        return (

            <div
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

                <div
                    className="
                        flex
                        items-start
                        justify-between
                    "
                >

                    <div>

                        <p
                            className="
                                text-sm
                                font-medium
                                text-slate-500
                            "
                        >

                            {title}

                        </p>


                        <h3
                            className="
                                mt-2
                                text-3xl
                                font-bold
                                text-slate-800
                            "
                        >

                            {loading
                                ? "..."
                                : value
                            }

                        </h3>


                        <p
                            className="
                                mt-2
                                text-xs
                                text-slate-500
                            "
                        >

                            {description}

                        </p>

                    </div>


                    <div
                        className={`
                            p-3
                            rounded-xl
                            ${iconClass}
                        `}
                    >

                        <Icon
                            size={24}
                        />

                    </div>

                </div>

            </div>

        );

    };


    // =================================================
    // SIDEBAR ITEM
    // =================================================

    const SidebarItem = ({
        icon: Icon,
        label,
        path
    }) => {

        const active =
            window.location.pathname === path;


        return (

            <button
                onClick={() =>
                    goTo(path)
                }
                className={`
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    text-sm
                    font-medium
                    transition

                    ${
                        active
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-slate-600 hover:bg-slate-100"
                    }
                `}
            >

                <Icon
                    size={19}
                />

                <span>

                    {label}

                </span>

            </button>

        );

    };


    // =================================================
    // RENDER
    // =================================================

    return (

        <div
            className="
                min-h-screen
                bg-slate-100
                flex
            "
        >

            {/* ================================================= */}
            {/* MOBILE OVERLAY */}
            {/* ================================================= */}

            {sidebarOpen && (

                <div
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                    className="
                        fixed
                        inset-0
                        bg-black/40
                        z-30
                        lg:hidden
                    "
                />

            )}


            {/* ================================================= */}
            {/* SIDEBAR */}
            {/* ================================================= */}

            <aside
                className={`
                    fixed
                    lg:static
                    z-40
                    top-0
                    left-0
                    h-screen
                    w-72
                    bg-white
                    border-r
                    border-slate-200
                    flex
                    flex-col
                    transition-transform
                    duration-300

                    ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                    }
                `}
            >

                {/* LOGO */}

                <div
                    className="
                        px-6
                        py-6
                        border-b
                        border-slate-200
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-blue-600
                                flex
                                items-center
                                justify-center
                                text-white
                                shadow-md
                            "
                        >

                            <Car
                                size={25}
                            />

                        </div>


                        <div>

                            <h1
                                className="
                                    text-lg
                                    font-bold
                                    text-slate-800
                                "
                            >

                                SmartRide

                            </h1>


                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                "
                            >

                                ADMIN PANEL

                            </p>

                        </div>

                    </div>

                </div>


                {/* CLOSE MOBILE */}

                <button
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                    className="
                        absolute
                        right-4
                        top-5
                        lg:hidden
                        text-slate-500
                    "
                >

                    <X
                        size={22}
                    />

                </button>


                {/* MENU */}

                <div
                    className="
                        flex-1
                        px-4
                        py-6
                        overflow-y-auto
                    "
                >

                    <p
                        className="
                            px-4
                            mb-3
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wider
                            text-slate-400
                        "
                    >

                        Main Menu

                    </p>


                    <div
                        className="
                            space-y-1
                        "
                    >

                        <SidebarItem
                            icon={LayoutDashboard}
                            label="Dashboard"
                            path="/admin/dashboard"
                        />


                        <SidebarItem
                            icon={Users}
                            label="Drivers"
                            path="/admin/drivers"
                        />


                        <SidebarItem
                            icon={UserRound}
                            label="Customers"
                            path="/admin/customers"
                        />


                        <SidebarItem
                            icon={Star}
                            label="Ratings"
                            path="/admin/ratings"
                        />

                    </div>

                </div>


                {/* SYSTEM STATUS */}

                <div
                    className="
                        px-5
                        pb-5
                    "
                >

                    <div
                        className="
                            bg-green-50
                            border
                            border-green-200
                            rounded-xl
                            p-4
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <span
                                className="
                                    w-2.5
                                    h-2.5
                                    rounded-full
                                    bg-green-500
                                "
                            />


                            <span
                                className="
                                    text-sm
                                    font-semibold
                                    text-green-700
                                "
                            >

                                System Online

                            </span>

                        </div>


                        <p
                            className="
                                mt-1
                                text-xs
                                text-green-600
                            "
                        >

                            System Operational

                        </p>

                    </div>

                </div>

            </aside>


            {/* ================================================= */}
            {/* MAIN */}
            {/* ================================================= */}

            <main
                className="
                    flex-1
                    min-w-0
                "
            >

                {/* ================================================= */}
                {/* TOP HEADER */}
                {/* ================================================= */}

                <header
                    className="
                        h-20
                        bg-white
                        border-b
                        border-slate-200
                        px-4
                        sm:px-6
                        lg:px-8
                        flex
                        items-center
                        justify-between
                    "
                >

                    {/* MOBILE MENU */}

                    <button
                        onClick={() =>
                            setSidebarOpen(true)
                        }
                        className="
                            lg:hidden
                            p-2
                            rounded-lg
                            hover:bg-slate-100
                        "
                    >

                        <Menu
                            size={24}
                        />

                    </button>


                    {/* TITLE */}

                    <div
                        className="
                            hidden
                            sm:block
                        "
                    >

                        <h2
                            className="
                                text-lg
                                font-bold
                                text-slate-800
                            "
                        >

                            SmartRide Admin

                        </h2>


                        <p
                            className="
                                text-xs
                                text-slate-500
                            "
                        >

                            ADMIN

                        </p>

                    </div>


                    {/* USER */}

                    <div
                        className="
                            flex
                            items-center
                            gap-4
                        "
                    >

                        <div
                            className="
                                hidden
                                sm:block
                                text-right
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                            >

                                {user?.name ||
                                    "SmartRide Admin"}

                            </p>


                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                "
                            >

                                {user?.role ||
                                    "ADMIN"}

                            </p>

                        </div>


                        <div
                            className="
                                w-10
                                h-10
                                rounded-full
                                bg-blue-100
                                text-blue-700
                                flex
                                items-center
                                justify-center
                                font-bold
                            "
                        >

                            {(
                                user?.name ||
                                "S"
                            )
                                .charAt(0)
                                .toUpperCase()}

                        </div>


                        <button
                            onClick={
                                handleLogout
                            }
                            title="Logout"
                            className="
                                p-2
                                rounded-lg
                                text-slate-500
                                hover:bg-red-50
                                hover:text-red-600
                                transition
                            "
                        >

                            <LogOut
                                size={20}
                            />

                        </button>

                    </div>

                </header>


                {/* ================================================= */}
                {/* CONTENT */}
                {/* ================================================= */}

                <div
                    className="
                        p-4
                        sm:p-6
                        lg:p-8
                    "
                >

                    {/* PAGE HEADER */}

                    <div
                        className="
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            gap-4
                            mb-8
                        "
                    >

                        <div>

                            <h1
                                className="
                                    text-2xl
                                    sm:text-3xl
                                    font-bold
                                    text-slate-800
                                "
                            >

                                Dashboard

                            </h1>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                "
                            >

                                Welcome back,{" "}

                                <span
                                    className="
                                        font-semibold
                                        text-slate-700
                                    "
                                >

                                    {user?.name ||
                                        "SmartRide Admin"}

                                </span>

                                {" "}👋

                            </p>

                        </div>


                        {/* REFRESH */}

                        <button
                            onClick={
                                loadDashboard
                            }
                            disabled={
                                loading
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                px-4
                                py-2.5
                                rounded-xl
                                bg-white
                                border
                                border-slate-200
                                text-sm
                                font-medium
                                text-slate-700
                                hover:bg-slate-50
                                transition
                                disabled:opacity-50
                            "
                        >

                            <RefreshCw
                                size={17}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Refresh

                        </button>

                    </div>


                    {/* ================================================= */}
                    {/* ERROR */}
                    {/* ================================================= */}

                    {error && (

                        <div
                            className="
                                mb-6
                                bg-red-50
                                border
                                border-red-200
                                rounded-xl
                                p-4
                                flex
                                items-start
                                gap-3
                            "
                        >

                            <AlertCircle
                                className="
                                    text-red-600
                                    mt-0.5
                                    shrink-0
                                "
                                size={20}
                            />


                            <div>

                                <p
                                    className="
                                        font-semibold
                                        text-red-700
                                    "
                                >

                                    Unable to load dashboard data

                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-red-600
                                    "
                                >

                                    {error}

                                </p>

                            </div>

                        </div>

                    )}


                    {/* ================================================= */}
                    {/* STATS */}
                    {/* ================================================= */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            xl:grid-cols-4
                            gap-5
                        "
                    >

                        <StatCard
                            title="Total Drivers"
                            value={
                                stats.totalDrivers
                            }
                            description="Registered drivers"
                            icon={Users}
                            iconClass="
                                bg-blue-50
                                text-blue-600
                            "
                        />


                        <StatCard
                            title="Pending Drivers"
                            value={
                                stats.pendingDrivers
                            }
                            description="Waiting for verification"
                            icon={Clock}
                            iconClass="
                                bg-amber-50
                                text-amber-600
                            "
                        />


                        <StatCard
                            title="Online Drivers"
                            value={
                                stats.onlineDrivers
                            }
                            description="Currently available"
                            icon={Wifi}
                            iconClass="
                                bg-green-50
                                text-green-600
                            "
                        />


                        <StatCard
                            title="Customers"
                            value={
                                stats.totalCustomers
                            }
                            description="Registered customers"
                            icon={UserRound}
                            iconClass="
                                bg-purple-50
                                text-purple-600
                            "
                        />


                        <StatCard
                            title="Total Rides"
                            value={
                                stats.totalRides
                            }
                            description="All ride requests"
                            icon={Car}
                            iconClass="
                                bg-indigo-50
                                text-indigo-600
                            "
                        />


                        <StatCard
                            title="Completed Rides"
                            value={
                                stats.completedRides
                            }
                            description="Successfully completed"
                            icon={CheckCircle}
                            iconClass="
                                bg-emerald-50
                                text-emerald-600
                            "
                        />


                        <StatCard
                            title="Total Revenue"
                            value={
                                `₹${Number(
                                    stats.totalRevenue || 0
                                ).toLocaleString("en-IN")}`
                            }
                            description="Platform ride revenue"
                            icon={IndianRupee}
                            iconClass="
                                bg-yellow-50
                                text-yellow-600
                            "
                        />


                        <StatCard
                            title="Ride Completion"
                            value={
                                `${rideCompletion}%`
                            }
                            description="Completed vs total rides"
                            icon={TrendingUp}
                            iconClass="
                                bg-cyan-50
                                text-cyan-600
                            "
                        />

                    </div>


                    {/* ================================================= */}
                    {/* QUICK ACTIONS */}
                    {/* ================================================= */}

                    <div
                        className="
                            mt-8
                            bg-white
                            border
                            border-slate-200
                            rounded-2xl
                            p-6
                            shadow-sm
                        "
                    >

                        <h2
                            className="
                                text-lg
                                font-bold
                                text-slate-800
                            "
                        >

                            ⚡ Quick Actions

                        </h2>


                        <div
                            className="
                                mt-5
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-3
                                gap-4
                            "
                        >

                            <button
                                onClick={() =>
                                    goTo(
                                        "/admin/drivers"
                                    )
                                }
                                className="
                                    p-4
                                    rounded-xl
                                    border
                                    border-slate-200
                                    hover:border-blue-300
                                    hover:bg-blue-50
                                    transition
                                    text-left
                                "
                            >

                                <Users
                                    className="
                                        text-blue-600
                                        mb-3
                                    "
                                    size={23}
                                />

                                <p
                                    className="
                                        font-semibold
                                        text-slate-700
                                    "
                                >

                                    Manage Drivers

                                </p>


                                <p
                                    className="
                                        text-xs
                                        text-slate-500
                                        mt-1
                                    "
                                >

                                    Verify and manage drivers

                                </p>

                            </button>


                            <button
                                onClick={() =>
                                    goTo(
                                        "/admin/customers"
                                    )
                                }
                                className="
                                    p-4
                                    rounded-xl
                                    border
                                    border-slate-200
                                    hover:border-purple-300
                                    hover:bg-purple-50
                                    transition
                                    text-left
                                "
                            >

                                <UserRound
                                    className="
                                        text-purple-600
                                        mb-3
                                    "
                                    size={23}
                                />

                                <p
                                    className="
                                        font-semibold
                                        text-slate-700
                                    "
                                >

                                    Manage Customers

                                </p>


                                <p
                                    className="
                                        text-xs
                                        text-slate-500
                                        mt-1
                                    "
                                >

                                    View registered customers

                                </p>

                            </button>


                            <button
                                onClick={() =>
                                    goTo(
                                        "/admin/ratings"
                                    )
                                }
                                className="
                                    p-4
                                    rounded-xl
                                    border
                                    border-slate-200
                                    hover:border-yellow-300
                                    hover:bg-yellow-50
                                    transition
                                    text-left
                                "
                            >

                                <Star
                                    className="
                                        text-yellow-500
                                        mb-3
                                    "
                                    size={23}
                                />

                                <p
                                    className="
                                        font-semibold
                                        text-slate-700
                                    "
                                >

                                    View Ratings

                                </p>


                                <p
                                    className="
                                        text-xs
                                        text-slate-500
                                        mt-1
                                    "
                                >

                                    Review customer feedback

                                </p>

                            </button>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* SYSTEM OVERVIEW */}
                    {/* ================================================= */}

                    <div
                        className="
                            mt-6
                            grid
                            grid-cols-1
                            lg:grid-cols-2
                            gap-6
                        "
                    >

                        {/* DRIVER VERIFICATION */}

                        <div
                            className="
                                bg-white
                                border
                                border-slate-200
                                rounded-2xl
                                p-6
                                shadow-sm
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <div>

                                    <h2
                                        className="
                                            font-bold
                                            text-slate-800
                                        "
                                    >

                                        Driver Verification

                                    </h2>


                                    <p
                                        className="
                                            text-sm
                                            text-slate-500
                                            mt-1
                                        "
                                    >

                                        Approved drivers

                                    </p>

                                </div>


                                <ShieldCheck
                                    className="
                                        text-blue-600
                                    "
                                    size={26}
                                />

                            </div>


                            <div
                                className="
                                    mt-6
                                    h-3
                                    bg-slate-100
                                    rounded-full
                                    overflow-hidden
                                "
                            >

                                <div
                                    className="
                                        h-full
                                        bg-blue-600
                                        rounded-full
                                        transition-all
                                        duration-500
                                    "
                                    style={{
                                        width:
                                            `${driverVerification}%`
                                    }}
                                />

                            </div>


                            <div
                                className="
                                    mt-3
                                    flex
                                    justify-between
                                    text-sm
                                "
                            >

                                <span
                                    className="
                                        text-slate-500
                                    "
                                >

                                    Verification

                                </span>


                                <span
                                    className="
                                        font-bold
                                        text-slate-700
                                    "
                                >

                                    {driverVerification}%

                                </span>

                            </div>

                        </div>


                        {/* RIDE COMPLETION */}

                        <div
                            className="
                                bg-white
                                border
                                border-slate-200
                                rounded-2xl
                                p-6
                                shadow-sm
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <div>

                                    <h2
                                        className="
                                            font-bold
                                            text-slate-800
                                        "
                                    >

                                        Ride Completion

                                    </h2>


                                    <p
                                        className="
                                            text-sm
                                            text-slate-500
                                            mt-1
                                        "
                                    >

                                        Successfully completed rides

                                    </p>

                                </div>


                                <TrendingUp
                                    className="
                                        text-green-600
                                    "
                                    size={26}
                                />

                            </div>


                            <div
                                className="
                                    mt-6
                                    h-3
                                    bg-slate-100
                                    rounded-full
                                    overflow-hidden
                                "
                            >

                                <div
                                    className="
                                        h-full
                                        bg-green-500
                                        rounded-full
                                        transition-all
                                        duration-500
                                    "
                                    style={{
                                        width:
                                            `${rideCompletion}%`
                                    }}
                                />

                            </div>


                            <div
                                className="
                                    mt-3
                                    flex
                                    justify-between
                                    text-sm
                                "
                            >

                                <span
                                    className="
                                        text-slate-500
                                    "
                                >

                                    Completion

                                </span>


                                <span
                                    className="
                                        font-bold
                                        text-slate-700
                                    "
                                >

                                    {rideCompletion}%

                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>

    );

}


export default AdminDashboard;