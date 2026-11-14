import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getCurrentRide,
    driverArriving,
    startRide,
    completeRide,
    cancelRide
} from "../../api/driverRideApi";

import {
    startDriverLocationTracking,
    stopDriverLocationTracking
} from "../../api/driverLocation";

import RideMap from "../../components/ride/RideMap";


function CurrentRide() {

    const navigate = useNavigate();

    const [ride, setRide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ==========================================
    // LOAD CURRENT RIDE
    // ==========================================

    useEffect(() => {

        loadCurrentRide();

        return () => {
            stopDriverLocationTracking();
        };

    }, []);


    // ==========================================
    // AUTO REFRESH
    // ==========================================

    useEffect(() => {

        const interval = setInterval(() => {
            loadCurrentRide();
        }, 5000);

        return () => {
            clearInterval(interval);
        };

    }, []);


    // ==========================================
    // LOAD RIDE
    // ==========================================

    const loadCurrentRide = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const data =
                await getCurrentRide(token);

            setRide(data);

            if (data) {

                const rideId =
                    getRideId(data);

                if (rideId) {

                    startDriverLocationTracking(
                        rideId
                    );

                }

            }

        }
        catch (err) {

            console.error(
                "Current ride error:",
                err
            );

            setError(
                err.message ||
                "Unable to load current ride"
            );

        }
        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // RIDE ID
    // ==========================================

    const getRideId = (rideData = ride) => {

        return (
            rideData?.id ||
            rideData?._id ||
            rideData?.rideId
        );

    };


    // ==========================================
    // LOCATION NORMALIZER
    // ==========================================

    const normalizeLocation = (location) => {

        if (!location) {
            return null;
        }

        if (typeof location === "string") {

            return {
                address: location,
                latitude: null,
                longitude: null
            };

        }

        return {

            address:
                location.address ||
                location.location ||
                location.name ||
                "Address unavailable",

            latitude:
                location.latitude ??
                location.lat ??
                null,

            longitude:
                location.longitude ??
                location.lng ??
                null

        };

    };


    // ==========================================
    // PICKUP
    // ==========================================

    const pickup =
        normalizeLocation(
            ride?.pickupLocation ||
            ride?.pickup ||
            ride?.pickupAddress
        );


    // ==========================================
    // DESTINATION
    // ==========================================

    const destination =
        normalizeLocation(
            ride?.dropLocation ||
            ride?.destination ||
            ride?.destinationLocation ||
            ride?.destinationAddress
        );


    // ==========================================
    // DRIVER LOCATION
    // ==========================================

    const driverLocation =
        normalizeLocation(
            ride?.driverLocation ||
            ride?.currentDriverLocation
        );


    // ==========================================
    // STATUS
    // ==========================================

    const status =
        String(
            ride?.status ||
            "UNKNOWN"
        ).toUpperCase();


    // ==========================================
    // ARRIVING
    // ==========================================

    const handleArriving = async () => {

        try {

            setProcessing(true);
            setError("");
            setSuccess("");

            const data =
                await driverArriving(
                    getRideId(),
                    localStorage.getItem("token")
                );

            setRide(data);

            setSuccess(
                "Customer has been notified that you are arriving."
            );

        }
        catch (err) {

            setError(
                err.message ||
                "Unable to update ride"
            );

        }
        finally {

            setProcessing(false);

        }

    };


    // ==========================================
    // START RIDE
    // ==========================================

    const handleStart = async () => {

        try {

            setProcessing(true);
            setError("");
            setSuccess("");

            const data =
                await startRide(
                    getRideId(),
                    localStorage.getItem("token")
                );

            setRide(data);

            setSuccess(
                "Ride started successfully."
            );

        }
        catch (err) {

            setError(
                err.message ||
                "Unable to start ride"
            );

        }
        finally {

            setProcessing(false);

        }

    };


    // ==========================================
    // COMPLETE RIDE
    // ==========================================

    const handleComplete = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to complete this ride?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setProcessing(true);
            setError("");
            setSuccess("");

            const data =
                await completeRide(
                    getRideId(),
                    localStorage.getItem("token")
                );

            setRide(data);

            stopDriverLocationTracking();

            setSuccess(
                "Ride completed successfully."
            );

            setTimeout(() => {

                navigate(
                    "/driver/rides",
                    {
                        replace: true
                    }
                );

            }, 1000);

        }
        catch (err) {

            console.error(
                "Complete ride error:",
                err
            );

            setError(
                err.message ||
                "Unable to complete ride"
            );

        }
        finally {

            setProcessing(false);

        }

    };


    // ==========================================
    // CANCEL RIDE
    // ==========================================

    const handleCancel = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this ride?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setProcessing(true);
            setError("");
            setSuccess("");

            const data =
                await cancelRide(
                    getRideId(),
                    localStorage.getItem("token")
                );

            setRide(data);

            stopDriverLocationTracking();

            setSuccess(
                "Ride cancelled successfully."
            );

            setTimeout(() => {

                navigate(
                    "/driver/rides",
                    {
                        replace: true
                    }
                );

            }, 1000);

        }
        catch (err) {

            console.error(
                "Cancel ride error:",
                err
            );

            setError(
                err.message ||
                "Unable to cancel ride"
            );

        }
        finally {

            setProcessing(false);

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div style={styles.center}>

                <h2>
                    Loading Current Ride...
                </h2>

            </div>

        );

    }


    // ==========================================
    // NO RIDE
    // ==========================================

    if (!ride) {

        return (

            <div style={styles.page}>

                <Header navigate={navigate} />

                <main style={styles.container}>

                    <div style={styles.emptyCard}>

                        <div style={styles.bigIcon}>
                            🚕
                        </div>

                        <h1>
                            No Current Ride
                        </h1>

                        <p style={styles.muted}>
                            You currently don't have
                            an active ride.
                        </p>

                        <div style={styles.emptyActions}>

                            <button
                                style={styles.primaryButton}
                                onClick={() =>
                                    navigate(
                                        "/driver/rides"
                                    )
                                }
                            >
                                🚕 Find Available Rides
                            </button>

                            <button
                                style={styles.secondaryButton}
                                onClick={() =>
                                    navigate(
                                        "/driver"
                                    )
                                }
                            >
                                Dashboard
                            </button>

                        </div>

                    </div>

                </main>

            </div>

        );

    }


    // ==========================================
    // MAIN
    // ==========================================

    return (

        <div style={styles.page}>

            <Header navigate={navigate} />

            <main style={styles.container}>

                {/* ================================= */}
                {/* TITLE */}
                {/* ================================= */}

                <div style={styles.titleRow}>

                    <div>

                        <span style={styles.smallLabel}>
                            ACTIVE RIDE
                        </span>

                        <h1>
                            🚕 Current Ride
                        </h1>

                        <p style={styles.muted}>
                            Ride #{getRideId()}
                        </p>

                    </div>

                    <span
                        style={
                            getStatusStyle(status)
                        }
                    >
                        {status}
                    </span>

                </div>


                {/* ================================= */}
                {/* MESSAGES */}
                {/* ================================= */}

                {error && (

                    <div style={styles.error}>
                        ❌ {error}
                    </div>

                )}

                {success && (

                    <div style={styles.success}>
                        ✓ {success}
                    </div>

                )}


                {/* ================================= */}
                {/* MAP */}
                {/* ================================= */}

                <section style={styles.mapCard}>

                    <div style={styles.cardHeader}>

                        <div>

                            <h2>
                                🗺️ Live Ride Map
                            </h2>

                            <p style={styles.muted}>
                                Track pickup, destination
                                and your current location.
                            </p>

                        </div>

                        <span style={styles.liveBadge}>
                            ● LIVE
                        </span>

                    </div>


                    <RideMap

                        pickup={pickup}

                        destination={destination}

                        driverLocation={
                            driverLocation
                        }

                    />

                </section>


                {/* ================================= */}
                {/* LOCATIONS */}
                {/* ================================= */}

                <section style={styles.infoGrid}>

                    <LocationCard
                        icon="📍"
                        title="Pickup"
                        location={pickup}
                    />

                    <LocationCard
                        icon="🏁"
                        title="Destination"
                        location={destination}
                    />

                </section>


                {/* ================================= */}
                {/* RIDE DETAILS */}
                {/* ================================= */}

                <section style={styles.card}>

                    <div style={styles.cardHeader}>

                        <div>

                            <h2>
                                💰 Ride Details
                            </h2>

                            <p style={styles.muted}>
                                Trip information
                            </p>

                        </div>

                    </div>


                    <div style={styles.detailsGrid}>

                        <Detail
                            label="Distance"
                            value={
                                ride.distance ??
                                ride.distanceKm ??
                                "N/A"
                            }
                            suffix=" km"
                        />

                        <Detail
                            label="Duration"
                            value={
                                ride.duration ??
                                ride.durationMinutes ??
                                "N/A"
                            }
                            suffix=" min"
                        />

                        <Detail
                            label="Fare"
                            value={
                                ride.fare ??
                                ride.totalFare ??
                                ride.estimatedFare ??
                                "N/A"
                            }
                            prefix="₹"
                        />

                        <Detail
                            label="Ride Status"
                            value={status}
                        />

                    </div>

                </section>


                {/* ================================= */}
                {/* LOCATION TRACKING */}
                {/* ================================= */}

                <section style={styles.trackingCard}>

                    <div>

                        <h2>
                            📡 Location Tracking
                        </h2>

                        <p style={styles.muted}>
                            Your live location is being
                            shared for this ride.
                        </p>

                    </div>

                    <span style={styles.trackingBadge}>
                        ● TRACKING
                    </span>

                </section>


                {/* ================================= */}
                {/* RIDE ACTIONS */}
                {/* ================================= */}

                <section style={styles.actionCard}>

                    <h2>
                        Ride Actions
                    </h2>

                    <p style={styles.muted}>
                        Update the ride status as you
                        progress.
                    </p>


                    {/* ACCEPTED */}

                    {status === "ACCEPTED" && (

                        <div style={styles.actionGroup}>

                            <button
                                onClick={
                                    handleArriving
                                }
                                disabled={processing}
                                style={
                                    styles.blueButton
                                }
                            >
                                🚗 I'm Arriving
                            </button>

                            <button
                                onClick={
                                    handleCancel
                                }
                                disabled={processing}
                                style={
                                    styles.cancelButton
                                }
                            >
                                ✕ Cancel Ride
                            </button>

                        </div>

                    )}


                    {/* DRIVER ARRIVING */}

                    {(
                        status === "DRIVER_ARRIVING" ||
                        status === "ARRIVING"
                    ) && (

                        <div style={styles.actionGroup}>

                            <button
                                onClick={
                                    handleStart
                                }
                                disabled={processing}
                                style={
                                    styles.greenButton
                                }
                            >
                                ▶ Start Ride
                            </button>

                            <button
                                onClick={
                                    handleCancel
                                }
                                disabled={processing}
                                style={
                                    styles.cancelButton
                                }
                            >
                                ✕ Cancel Ride
                            </button>

                        </div>

                    )}


                    {/* STARTED */}

                    {status === "STARTED" && (

                        <div style={styles.actionGroup}>

                            <button
                                onClick={
                                    handleComplete
                                }
                                disabled={processing}
                                style={
                                    styles.completeButton
                                }
                            >
                                {processing
                                    ? "Completing..."
                                    : "✓ Complete Ride"
                                }
                            </button>

                            <button
                                onClick={
                                    handleCancel
                                }
                                disabled={processing}
                                style={
                                    styles.cancelButton
                                }
                            >
                                ✕ Cancel Ride
                            </button>

                        </div>

                    )}


                    {/* IN PROGRESS */}

                    {status === "IN_PROGRESS" && (

                        <div style={styles.actionGroup}>

                            <button
                                onClick={
                                    handleComplete
                                }
                                disabled={processing}
                                style={
                                    styles.completeButton
                                }
                            >
                                {processing
                                    ? "Completing..."
                                    : "✓ Complete Ride"
                                }
                            </button>

                            <button
                                onClick={
                                    handleCancel
                                }
                                disabled={processing}
                                style={
                                    styles.cancelButton
                                }
                            >
                                ✕ Cancel Ride
                            </button>

                        </div>

                    )}


                    {/* OTHER STATUS */}

                    {![
                        "ACCEPTED",
                        "DRIVER_ARRIVING",
                        "ARRIVING",
                        "STARTED",
                        "IN_PROGRESS"
                    ].includes(status) && (

                        <div style={styles.warning}>

                            ⚠️ Ride is currently in
                            <strong> {status} </strong>
                            status.

                        </div>

                    )}


                    {processing && (

                        <p style={styles.processingText}>
                            Updating ride status...
                        </p>

                    )}

                </section>

            </main>

        </div>

    );

}


// ==========================================
// HEADER
// ==========================================

function Header({ navigate }) {

    return (

        <header style={styles.navbar}>

            <div>

                <h2 style={styles.logo}>
                    🚗 SmartRide
                </h2>

                <span style={styles.driverPortal}>
                    Driver Portal
                </span>

            </div>


            <div style={styles.navButtons}>

                <button
                    style={styles.navButton}
                    onClick={() =>
                        navigate(
                            "/driver/rides"
                        )
                    }
                >
                    Available Rides
                </button>

                <button
                    style={styles.navButton}
                    onClick={() =>
                        navigate(
                            "/driver"
                        )
                    }
                >
                    Dashboard
                </button>

            </div>

        </header>

    );

}


// ==========================================
// LOCATION CARD
// ==========================================

function LocationCard({
    icon,
    title,
    location
}) {

    return (

        <div style={styles.locationCard}>

            <h3>
                {icon} {title}
            </h3>

            <p style={styles.address}>

                {location?.address ||
                    "Address unavailable"}

            </p>


            {location?.latitude != null &&
            location?.longitude != null && (

                <small style={styles.coordinates}>

                    {Number(
                        location.latitude
                    ).toFixed(6)}

                    {" , "}

                    {Number(
                        location.longitude
                    ).toFixed(6)}

                </small>

            )}

        </div>

    );

}


// ==========================================
// DETAIL
// ==========================================

function Detail({
    label,
    value,
    prefix = "",
    suffix = ""
}) {

    const hasValue =
        value !== "N/A" &&
        value !== null &&
        value !== undefined;

    return (

        <div style={styles.detail}>

            <span>
                {label}
            </span>

            <strong>

                {prefix}
                {value}

                {hasValue && suffix}

            </strong>

        </div>

    );

}


// ==========================================
// STATUS STYLE
// ==========================================

function getStatusStyle(status) {

    if (
        status === "STARTED" ||
        status === "IN_PROGRESS"
    ) {

        return {
            ...styles.status,
            background: "#dcfce7",
            color: "#166534"
        };

    }


    if (
        status === "DRIVER_ARRIVING" ||
        status === "ARRIVING"
    ) {

        return {
            ...styles.status,
            background: "#dbeafe",
            color: "#1d4ed8"
        };

    }


    if (status === "ACCEPTED") {

        return {
            ...styles.status,
            background: "#fef3c7",
            color: "#92400e"
        };

    }


    return styles.status;

}


// ==========================================
// STYLES
// ==========================================

const styles = {

    page: {
        minHeight: "100vh",
        background: "#f3f4f6"
    },

    navbar: {
        minHeight: "70px",
        background: "#111827",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 35px",
        gap: "20px"
    },

    logo: {
        margin: 0
    },

    driverPortal: {
        fontSize: "12px",
        color: "#9ca3af"
    },

    navButtons: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap"
    },

    navButton: {
        border: "none",
        padding: "9px 15px",
        borderRadius: "7px",
        cursor: "pointer"
    },

    container: {
        maxWidth: "1100px",
        margin: "auto",
        padding: "35px 20px"
    },

    titleRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap"
    },

    smallLabel: {
        color: "#6b7280",
        fontSize: "12px",
        fontWeight: "bold"
    },

    muted: {
        color: "#6b7280"
    },

    status: {
        background: "#fef3c7",
        color: "#92400e",
        padding: "9px 15px",
        borderRadius: "20px",
        fontWeight: "bold",
        fontSize: "13px"
    },

    liveBadge: {
        background: "#dcfce7",
        color: "#15803d",
        padding: "7px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold"
    },

    mapCard: {
        marginTop: "25px",
        background: "white",
        padding: "25px",
        borderRadius: "15px",
        boxShadow:
            "0 4px 15px rgba(0,0,0,0.07)"
    },

    card: {
        marginTop: "25px",
        background: "white",
        padding: "25px",
        borderRadius: "15px",
        boxShadow:
            "0 4px 15px rgba(0,0,0,0.07)"
    },

    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
        marginBottom: "20px"
    },

    infoGrid: {
        marginTop: "25px",
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
        gap: "20px"
    },

    locationCard: {
        background: "white",
        padding: "22px",
        borderRadius: "14px",
        boxShadow:
            "0 4px 15px rgba(0,0,0,0.06)"
    },

    address: {
        lineHeight: "1.6"
    },

    coordinates: {
        color: "#6b7280"
    },

    detailsGrid: {
        marginTop: "20px",
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
        gap: "15px"
    },

    detail: {
        background: "#f9fafb",
        padding: "18px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },

    trackingCard: {
        marginTop: "25px",
        background: "white",
        padding: "22px",
        borderRadius: "15px",
        boxShadow:
            "0 4px 15px rgba(0,0,0,0.07)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px"
    },

    trackingBadge: {
        background: "#dcfce7",
        color: "#15803d",
        padding: "8px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
        whiteSpace: "nowrap"
    },

    actionCard: {
        marginTop: "25px",
        background: "white",
        padding: "25px",
        borderRadius: "15px",
        boxShadow:
            "0 4px 15px rgba(0,0,0,0.07)"
    },

    actionGroup: {
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        marginTop: "20px"
    },

    blueButton: {
        border: "none",
        background: "#2563eb",
        color: "white",
        padding: "14px 24px",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    greenButton: {
        border: "none",
        background: "#16a34a",
        color: "white",
        padding: "14px 24px",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    completeButton: {
        border: "none",
        background: "#7c3aed",
        color: "white",
        padding: "14px 24px",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    cancelButton: {
        border: "none",
        background: "#dc2626",
        color: "white",
        padding: "14px 24px",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    processingText: {
        marginTop: "15px",
        color: "#6b7280"
    },

    warning: {
        marginTop: "20px",
        padding: "14px",
        background: "#fef3c7",
        color: "#92400e",
        borderRadius: "8px"
    },

    error: {
        marginTop: "20px",
        padding: "14px",
        background: "#fee2e2",
        color: "#b91c1c",
        borderRadius: "8px"
    },

    success: {
        marginTop: "20px",
        padding: "14px",
        background: "#dcfce7",
        color: "#166534",
        borderRadius: "8px"
    },

    emptyCard: {
        background: "white",
        padding: "60px 30px",
        borderRadius: "15px",
        textAlign: "center",
        boxShadow:
            "0 4px 15px rgba(0,0,0,0.07)"
    },

    emptyActions: {
        marginTop: "25px",
        display: "flex",
        justifyContent: "center",
        gap: "12px",
        flexWrap: "wrap"
    },

    primaryButton: {
        border: "none",
        background: "#2563eb",
        color: "white",
        padding: "13px 20px",
        borderRadius: "8px",
        cursor: "pointer"
    },

    secondaryButton: {
        border: "none",
        background: "#e5e7eb",
        padding: "13px 20px",
        borderRadius: "8px",
        cursor: "pointer"
    },

    bigIcon: {
        fontSize: "60px"
    },

    center: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }

};


export default CurrentRide;