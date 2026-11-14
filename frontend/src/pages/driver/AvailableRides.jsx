import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    getAvailableRides,
    acceptRide
} from "../../api/driverRideApi";


function AvailableRides() {

    const navigate = useNavigate();


    // ==========================================
    // STATE
    // ==========================================

    const [rides, setRides] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [acceptingRideId, setAcceptingRideId] =
        useState(null);

    const [decliningRideId, setDecliningRideId] =
        useState(null);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // GET RIDE ID
    // ==========================================

    const getRideId = (ride) => {

        return (
            ride?.id ||
            ride?._id ||
            ride?.rideId
        );

    };


    // ==========================================
    // GET LOCATION
    // ==========================================

    const getLocation = (location) => {

        if (!location) {

            return {
                address: "Location unavailable",
                latitude: null,
                longitude: null
            };

        }


        if (typeof location === "string") {

            return {
                address: location,
                latitude: null,
                longitude: null
            };

        }


        if (typeof location === "object") {

            return {

                address:
                    location.address ||
                    location.location ||
                    location.name ||
                    "Location unavailable",

                latitude:
                    location.latitude ??
                    null,

                longitude:
                    location.longitude ??
                    null

            };

        }


        return {
            address: "Location unavailable",
            latitude: null,
            longitude: null
        };

    };


    // ==========================================
    // FORMAT NUMBER
    // ==========================================

    const formatNumber = (
        value,
        suffix = ""
    ) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "N/A";

        }


        return `${value}${suffix}`;

    };


    // ==========================================
    // CLEAR MESSAGES
    // ==========================================

    const clearMessages = () => {

        setError("");
        setSuccess("");

    };


    // ==========================================
    // LOAD RIDES
    // ==========================================

    const loadAvailableRides =
        useCallback(
            async (isRefresh = false) => {

                try {

                    if (isRefresh) {

                        setRefreshing(true);

                    }
                    else {

                        setLoading(true);

                    }


                    setError("");


                    const token =
                        localStorage.getItem(
                            "token"
                        );


                    const data =
                        await getAvailableRides(
                            token
                        );


                    let availableRides = [];


                    if (
                        Array.isArray(data)
                    ) {

                        availableRides =
                            data;

                    }
                    else if (
                        Array.isArray(
                            data?.content
                        )
                    ) {

                        availableRides =
                            data.content;

                    }


                    setRides(
                        availableRides
                    );

                }
                catch (error) {

                    console.error(
                        "Available rides error:",
                        error
                    );


                    setError(
                        error.message ||
                        "Unable to load available rides"
                    );

                }
                finally {

                    setLoading(false);
                    setRefreshing(false);

                }

            },
            []
        );


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        loadAvailableRides();

    }, [loadAvailableRides]);


    // ==========================================
    // AUTO REFRESH
    // ==========================================

    useEffect(() => {

        const interval =
            setInterval(() => {

                loadAvailableRides(true);

            }, 10000);


        return () => {

            clearInterval(
                interval
            );

        };

    }, [loadAvailableRides]);


    // ==========================================
    // ACCEPT RIDE
    // ==========================================

    const handleAcceptRide =
        async (rideId) => {

            const confirmed =
                window.confirm(
                    "Accept this ride?"
                );


            if (!confirmed) {

                return;

            }


            try {

                setAcceptingRideId(
                    rideId
                );

                clearMessages();


                const token =
                    localStorage.getItem(
                        "token"
                    );


                await acceptRide(
                    rideId,
                    token
                );


                setSuccess(
                    "Ride accepted successfully."
                );


                /*
                 * Remove ride from list.
                 */

                setRides(
                    previous =>
                        previous.filter(
                            ride =>
                                getRideId(ride) !==
                                rideId
                        )
                );


                /*
                 * Open current ride.
                 */

                navigate(
                    "/driver/current-ride"
                );

            }
            catch (error) {

                console.error(
                    "Accept ride error:",
                    error
                );


                setError(
                    error.message ||
                    "Unable to accept ride"
                );

            }
            finally {

                setAcceptingRideId(
                    null
                );

            }

        };


    // ==========================================
    // DECLINE / REMOVE RIDE
    // ==========================================

    const handleDeclineRide =
        (rideId) => {

            const confirmed =
                window.confirm(
                    "Remove this ride from your available list?"
                );


            if (!confirmed) {

                return;

            }


            setDecliningRideId(
                rideId
            );

            clearMessages();


            /*
             * Currently this only removes
             * the ride from frontend list.
             *
             * Backend decline endpoint can
             * be connected later.
             */

            setRides(
                previous =>
                    previous.filter(
                        ride =>
                            getRideId(ride) !==
                            rideId
                    )
            );


            setSuccess(
                "Ride removed from your list."
            );


            setDecliningRideId(
                null
            );

        };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div style={styles.loadingPage}>

                <div style={styles.loadingCard}>

                    <div style={styles.loadingIcon}>
                        🚕
                    </div>

                    <h2>
                        Finding available rides...
                    </h2>

                    <p style={styles.muted}>
                        Connecting to SmartRide.
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <div style={styles.page}>


            {/* ================================= */}
            {/* NAVBAR */}
            {/* ================================= */}

            <header style={styles.navbar}>

                <div style={styles.brand}>

                    <div style={styles.logoIcon}>
                        🚗
                    </div>

                    <div>

                        <h2 style={styles.logo}>
                            SmartRide
                        </h2>

                        <span
                            style={
                                styles.driverPortal
                            }
                        >
                            Driver Portal
                        </span>

                    </div>

                </div>


                <div style={styles.navButtons}>

                    <button
                        onClick={() =>
                            navigate(
                                "/driver"
                            )
                        }
                        style={
                            styles.navButton
                        }
                    >
                        🏠 Dashboard
                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/driver/current-ride"
                            )
                        }
                        style={
                            styles.navButton
                        }
                    >
                        🚗 Current Ride
                    </button>

                </div>

            </header>


            {/* ================================= */}
            {/* MAIN */}
            {/* ================================= */}

            <main style={styles.container}>


                {/* ================================= */}
                {/* PAGE HEADER */}
                {/* ================================= */}

                <section style={styles.pageHeader}>

                    <div>

                        <div style={styles.titleRow}>

                            <h1 style={styles.title}>
                                🚕 Available Rides
                            </h1>


                            <span
                                style={
                                    styles.countBadge
                                }
                            >
                                {rides.length}{" "}
                                {rides.length === 1
                                    ? "Ride"
                                    : "Rides"}
                            </span>

                        </div>


                        <p style={styles.subtitle}>
                            Choose a nearby customer ride
                            and start earning.
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            loadAvailableRides(
                                true
                            )
                        }
                        disabled={
                            refreshing
                        }
                        style={
                            styles.refreshButton
                        }
                    >

                        {refreshing
                            ? "⏳ Refreshing..."
                            : "🔄 Refresh"}

                    </button>

                </section>


                {/* ================================= */}
                {/* MESSAGES */}
                {/* ================================= */}

                {error && (

                    <div style={styles.error}>

                        <span>
                            ❌
                        </span>

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={() =>
                                setError("")
                            }
                            style={
                                styles.closeMessage
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                {success && (

                    <div style={styles.success}>

                        <span>
                            ✓
                        </span>

                        <span>
                            {success}
                        </span>

                        <button
                            onClick={() =>
                                setSuccess("")
                            }
                            style={
                                styles.closeMessage
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                {/* ================================= */}
                {/* ONLINE INFO */}
                {/* ================================= */}

                <div style={styles.onlineBanner}>

                    <div style={styles.onlineDot}>
                        ●
                    </div>

                    <div>

                        <strong>
                            You are online
                        </strong>

                        <p>
                            New customer requests are
                            automatically refreshed.
                        </p>

                    </div>

                    <span
                        style={
                            styles.liveBadge
                        }
                    >
                        LIVE
                    </span>

                </div>


                {/* ================================= */}
                {/* EMPTY STATE */}
                {/* ================================= */}

                {rides.length === 0 ? (

                    <section
                        style={
                            styles.emptyCard
                        }
                    >

                        <div
                            style={
                                styles.emptyIcon
                            }
                        >
                            🚕
                        </div>


                        <h2>
                            No rides available
                        </h2>


                        <p
                            style={
                                styles.muted
                            }
                        >
                            There are currently no customer
                            requests near you.
                        </p>


                        <button
                            onClick={() =>
                                loadAvailableRides(
                                    true
                                )
                            }
                            style={
                                styles.primaryButton
                            }
                        >
                            🔄 Check Again
                        </button>

                    </section>

                ) : (


                    /* ================================= */
                    /* RIDES */
                    /* ================================= */

                    <section
                        style={
                            styles.ridesGrid
                        }
                    >

                        {rides.map(
                            (ride) => {

                                const rideId =
                                    getRideId(
                                        ride
                                    );


                                const pickup =
                                    getLocation(
                                        ride?.pickupLocation ||
                                        ride?.pickup
                                    );


                                const destination =
                                    getLocation(
                                        ride?.dropLocation ||
                                        ride?.destination
                                    );


                                const distance =
                                    ride?.distance ??
                                    ride?.distanceKm;


                                const duration =
                                    ride?.duration ??
                                    ride?.durationMinutes;


                                const fare =
                                    ride?.fare ??
                                    ride?.totalFare;


                                const isAccepting =
                                    acceptingRideId ===
                                    rideId;


                                const isDeclining =
                                    decliningRideId ===
                                    rideId;


                                return (

                                    <article
                                        key={rideId}
                                        style={
                                            styles.rideCard
                                        }
                                    >


                                        {/* ================= */}
                                        {/* CARD HEADER */}
                                        {/* ================= */}

                                        <div
                                            style={
                                                styles.rideHeader
                                            }
                                        >

                                            <div>

                                                <span
                                                    style={
                                                        styles.rideLabel
                                                    }
                                                >
                                                    RIDE REQUEST
                                                </span>

                                                <h2
                                                    style={
                                                        styles.rideId
                                                    }
                                                >
                                                    #
                                                    {rideId ||
                                                        "N/A"}
                                                </h2>

                                            </div>


                                            <span
                                                style={
                                                    styles.statusBadge
                                                }
                                            >
                                                {ride?.status ||
                                                    "REQUESTED"}
                                            </span>

                                        </div>


                                        {/* ================= */}
                                        {/* ROUTE */}
                                        {/* ================= */}

                                        <div
                                            style={
                                                styles.route
                                            }
                                        >


                                            {/* PICKUP */}

                                            <div
                                                style={
                                                    styles.routeRow
                                                }
                                            >

                                                <div
                                                    style={
                                                        styles.routeIconPickup
                                                    }
                                                >
                                                    📍
                                                </div>

                                                <div
                                                    style={
                                                        styles.routeContent
                                                    }
                                                >

                                                    <span
                                                        style={
                                                            styles.routeLabel
                                                        }
                                                    >
                                                        PICKUP
                                                    </span>

                                                    <strong>
                                                        {
                                                            pickup.address
                                                        }
                                                    </strong>

                                                </div>

                                            </div>


                                            <div
                                                style={
                                                    styles.routeLine
                                                }
                                            />


                                            {/* DESTINATION */}

                                            <div
                                                style={
                                                    styles.routeRow
                                                }
                                            >

                                                <div
                                                    style={
                                                        styles.routeIconDestination
                                                    }
                                                >
                                                    🏁
                                                </div>

                                                <div
                                                    style={
                                                        styles.routeContent
                                                    }
                                                >

                                                    <span
                                                        style={
                                                            styles.routeLabel
                                                        }
                                                    >
                                                        DESTINATION
                                                    </span>

                                                    <strong>
                                                        {
                                                            destination.address
                                                        }
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>


                                        {/* ================= */}
                                        {/* RIDE DETAILS */}
                                        {/* ================= */}

                                        <div
                                            style={
                                                styles.detailsGrid
                                            }
                                        >

                                            <div
                                                style={
                                                    styles.detailCard
                                                }
                                            >

                                                <span>
                                                    📏
                                                </span>

                                                <div>

                                                    <small>
                                                        Distance
                                                    </small>

                                                    <strong>
                                                        {formatNumber(
                                                            distance,
                                                            distance != null
                                                                ? " km"
                                                                : ""
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>


                                            <div
                                                style={
                                                    styles.detailCard
                                                }
                                            >

                                                <span>
                                                    ⏱️
                                                </span>

                                                <div>

                                                    <small>
                                                        Duration
                                                    </small>

                                                    <strong>
                                                        {formatNumber(
                                                            duration,
                                                            duration != null
                                                                ? " min"
                                                                : ""
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>


                                            <div
                                                style={
                                                    styles.detailCard
                                                }
                                            >

                                                <span>
                                                    💰
                                                </span>

                                                <div>

                                                    <small>
                                                        Estimated Fare
                                                    </small>

                                                    <strong
                                                        style={
                                                            styles.fareText
                                                        }
                                                    >
                                                        {fare != null
                                                            ? `₹${fare}`
                                                            : "N/A"}
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>


                                        {/* ================= */}
                                        {/* COORDINATES */}
                                        {/* ================= */}

                                        {(pickup.latitude !== null ||
                                        destination.latitude !== null) && (

                                            <details
                                                style={
                                                    styles.coordinates
                                                }
                                            >

                                                <summary>
                                                    📍 Location details
                                                </summary>


                                                <div
                                                    style={
                                                        styles.coordinateGrid
                                                    }
                                                >

                                                    <div>

                                                        <small>
                                                            Pickup
                                                        </small>

                                                        <p>
                                                            {pickup.latitude ??
                                                                "N/A"}
                                                            {" , "}
                                                            {pickup.longitude ??
                                                                "N/A"}
                                                        </p>

                                                    </div>


                                                    <div>

                                                        <small>
                                                            Destination
                                                        </small>

                                                        <p>
                                                            {destination.latitude ??
                                                                "N/A"}
                                                            {" , "}
                                                            {destination.longitude ??
                                                                "N/A"}
                                                        </p>

                                                    </div>

                                                </div>

                                            </details>

                                        )}


                                        {/* ================= */}
                                        {/* ACTIONS */}
                                        {/* ================= */}

                                        <div
                                            style={
                                                styles.actions
                                            }
                                        >

                                            <button
                                                onClick={() =>
                                                    handleAcceptRide(
                                                        rideId
                                                    )
                                                }
                                                disabled={
                                                    isAccepting ||
                                                    isDeclining
                                                }
                                                style={
                                                    styles.acceptButton
                                                }
                                            >

                                                {isAccepting

                                                    ? "⏳ Accepting..."

                                                    : "✓ Accept Ride"

                                                }

                                            </button>


                                            <button
                                                onClick={() =>
                                                    handleDeclineRide(
                                                        rideId
                                                    )
                                                }
                                                disabled={
                                                    isAccepting ||
                                                    isDeclining
                                                }
                                                style={
                                                    styles.declineButton
                                                }
                                            >

                                                {isDeclining

                                                    ? "Removing..."

                                                    : "✕ Decline"

                                                }

                                            </button>

                                        </div>

                                    </article>

                                );

                            }
                        )}

                    </section>

                )}


                {/* ================================= */}
                {/* FOOTER INFO */}
                {/* ================================= */}

                <section
                    style={
                        styles.infoCard
                    }
                >

                    <div>
                        🛡️
                    </div>

                    <div>

                        <strong>
                            Drive safely
                        </strong>

                        <p>
                            Only accept rides you can
                            safely complete. Customer
                            location details are shown
                            before accepting.
                        </p>

                    </div>

                </section>

            </main>

        </div>

    );

}


// ==========================================
// STYLES
// ==========================================

const styles = {

    page: {
        minHeight: "100vh",
        background: "#f3f4f6",
        color: "#111827"
    },


    // ======================================
    // NAVBAR
    // ======================================

    navbar: {
        minHeight: "72px",
        background: "#111827",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 35px",
        gap: "20px",
        flexWrap: "wrap"
    },


    brand: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },


    logoIcon: {
        fontSize: "32px"
    },


    logo: {
        margin: 0,
        fontSize: "21px"
    },


    driverPortal: {
        color: "#9ca3af",
        fontSize: "12px"
    },


    navButtons: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap"
    },


    navButton: {
        border: "none",
        background: "#374151",
        color: "white",
        padding: "10px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },


    // ======================================
    // CONTAINER
    // ======================================

    container: {
        maxWidth: "1250px",
        margin: "auto",
        padding: "35px 20px"
    },


    // ======================================
    // HEADER
    // ======================================

    pageHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap"
    },


    titleRow: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap"
    },


    title: {
        margin: 0,
        fontSize: "32px"
    },


    subtitle: {
        color: "#6b7280",
        marginTop: "8px"
    },


    countBadge: {
        background: "#dbeafe",
        color: "#1d4ed8",
        padding: "6px 11px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "700"
    },


    refreshButton: {
        border: "none",
        background: "#1f2937",
        color: "white",
        padding: "12px 18px",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: "600"
    },


    // ======================================
    // ONLINE BANNER
    // ======================================

    onlineBanner: {
        marginTop: "25px",
        background: "white",
        borderRadius: "12px",
        padding: "15px 18px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow:
            "0 3px 12px rgba(0,0,0,0.05)"
    },


    onlineDot: {
        color: "#16a34a",
        fontSize: "20px"
    },


    onlineBannerText: {
        flex: 1
    },


    onlineBannerParagraph: {
        margin: "3px 0 0",
        color: "#6b7280",
        fontSize: "13px"
    },


    liveBadge: {
        background: "#dcfce7",
        color: "#15803d",
        padding: "5px 9px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "800"
    },


    // ======================================
    // MESSAGES
    // ======================================

    error: {
        marginTop: "20px",
        padding: "14px",
        background: "#fee2e2",
        color: "#991b1b",
        borderRadius: "9px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },


    success: {
        marginTop: "20px",
        padding: "14px",
        background: "#dcfce7",
        color: "#166534",
        borderRadius: "9px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },


    closeMessage: {
        marginLeft: "auto",
        border: "none",
        background: "transparent",
        fontSize: "20px",
        cursor: "pointer"
    },


    // ======================================
    // RIDES GRID
    // ======================================

    ridesGrid: {
        marginTop: "25px",
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit,minmax(340px,1fr))",
        gap: "22px"
    },


    // ======================================
    // RIDE CARD
    // ======================================

    rideCard: {
        background: "white",
        padding: "24px",
        borderRadius: "16px",
        boxShadow:
            "0 5px 18px rgba(0,0,0,0.07)",
        border: "1px solid #e5e7eb"
    },


    rideHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "15px"
    },


    rideLabel: {
        display: "block",
        fontSize: "11px",
        color: "#6b7280",
        fontWeight: "700",
        letterSpacing: "0.5px"
    },


    rideId: {
        margin: "5px 0 0",
        fontSize: "22px"
    },


    statusBadge: {
        background: "#fef3c7",
        color: "#92400e",
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "800"
    },


    // ======================================
    // ROUTE
    // ======================================

    route: {
        marginTop: "22px",
        padding: "17px",
        background: "#f9fafb",
        borderRadius: "12px"
    },


    routeRow: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px"
    },


    routeIconPickup: {
        fontSize: "20px",
        width: "28px",
        textAlign: "center"
    },


    routeIconDestination: {
        fontSize: "20px",
        width: "28px",
        textAlign: "center"
    },


    routeContent: {
        flex: 1,
        minWidth: 0
    },


    routeLabel: {
        display: "block",
        fontSize: "10px",
        color: "#6b7280",
        fontWeight: "800",
        marginBottom: "4px"
    },


    routeContentStrong: {
        display: "block"
    },


    routeLine: {
        width: "2px",
        height: "22px",
        background: "#d1d5db",
        marginLeft: "13px"
    },


    // ======================================
    // DETAILS
    // ======================================

    detailsGrid: {
        marginTop: "18px",
        display: "grid",
        gridTemplateColumns:
            "repeat(3,1fr)",
        gap: "8px"
    },


    detailCard: {
        background: "#f9fafb",
        borderRadius: "9px",
        padding: "12px 8px",
        display: "flex",
        alignItems: "center",
        gap: "7px"
    },


    detailCardSmall: {
        display: "block",
        color: "#6b7280",
        fontSize: "10px"
    },


    detailCardStrong: {
        display: "block",
        marginTop: "3px"
    },


    fareText: {
        color: "#15803d"
    },


    // ======================================
    // COORDINATES
    // ======================================

    coordinates: {
        marginTop: "15px",
        color: "#374151",
        fontSize: "13px"
    },


    coordinateGrid: {
        marginTop: "10px",
        display: "grid",
        gridTemplateColumns:
            "1fr 1fr",
        gap: "10px"
    },


    // ======================================
    // ACTIONS
    // ======================================

    actions: {
        marginTop: "20px",
        display: "grid",
        gridTemplateColumns:
            "1fr auto",
        gap: "10px"
    },


    acceptButton: {
        border: "none",
        background: "#16a34a",
        color: "white",
        padding: "13px",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: "700"
    },


    declineButton: {
        border: "1px solid #fecaca",
        background: "#fff1f2",
        color: "#b91c1c",
        padding: "13px 16px",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: "600"
    },


    // ======================================
    // EMPTY
    // ======================================

    emptyCard: {
        marginTop: "30px",
        background: "white",
        padding: "65px 30px",
        borderRadius: "16px",
        textAlign: "center",
        boxShadow:
            "0 5px 18px rgba(0,0,0,0.06)"
    },


    emptyIcon: {
        fontSize: "65px"
    },


    primaryButton: {
        marginTop: "15px",
        border: "none",
        background: "#2563eb",
        color: "white",
        padding: "12px 20px",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: "600"
    },


    // ======================================
    // INFO
    // ======================================

    infoCard: {
        marginTop: "25px",
        background: "#eff6ff",
        color: "#1e3a8a",
        padding: "16px",
        borderRadius: "12px",
        display: "flex",
        gap: "12px"
    },


    // ======================================
    // LOADING
    // ======================================

    loadingPage: {
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },


    loadingCard: {
        background: "white",
        padding: "45px",
        borderRadius: "16px",
        textAlign: "center",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.08)"
    },


    loadingIcon: {
        fontSize: "55px"
    },


    muted: {
        color: "#6b7280"
    }

};


export default AvailableRides;