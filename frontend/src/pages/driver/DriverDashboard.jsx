import React, {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    getDriverProfile,
    goOnline,
    goOffline,
    updateDriverLocation
} from "../../api/driverApi";

import {
    getCurrentRide,
    completeRide,
    cancelRide
} from "../../api/driverRideApi";

import DriverMap
    from "../../components/driver/DriverMap";


function DriverDashboard() {

    const navigate = useNavigate();

    const [driver, setDriver] = useState(null);
    const [currentRide, setCurrentRide] = useState(null);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [rideProcessing, setRideProcessing] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [profileNotFound, setProfileNotFound] = useState(false);

    const watchId = useRef(null);
    const redirectTimer = useRef(null);

    const token = localStorage.getItem("token");


    // ==========================================
    // CLEANUP
    // ==========================================

    useEffect(() => {

        loadDashboard();

        return () => {

            stopLocationTracking();

            if (redirectTimer.current) {
                clearTimeout(redirectTimer.current);
            }

        };

    }, []);


    // ==========================================
    // LOAD DASHBOARD
    // ==========================================

    async function loadDashboard() {

        setLoading(true);
        setError("");

        try {

            const driverData =
                await loadDriver();

            if (!driverData) {
                return;
            }

            await loadCurrentRide();

        }
        catch (err) {

            console.error(
                "Dashboard loading error:",
                err
            );

            setError(
                err?.message ||
                "Unable to load driver dashboard."
            );

        }
        finally {

            setLoading(false);

        }

    }


    // ==========================================
    // LOAD DRIVER
    // ==========================================

    async function loadDriver() {

        try {

            const data =
                await getDriverProfile();


            if (!data) {

                setProfileNotFound(true);
                setDriver(null);

                return null;

            }


            saveDriver(data);

            setProfileNotFound(false);


            if (data.online) {

                startLocationTracking();

            }


            return data;

        }
        catch (err) {

            console.error(
                "Driver profile error:",
                err
            );


            if (
                err.message?.toLowerCase()
                    .includes("profile not found")
            ) {

                setProfileNotFound(true);
                setDriver(null);

                return null;

            }


            throw err;

        }

    }


    // ==========================================
    // SAVE DRIVER
    // ==========================================

    function saveDriver(data) {

        if (!data) {
            return;
        }

        setDriver(data);

        localStorage.setItem(
            "driver",
            JSON.stringify(data)
        );

    }


    // ==========================================
    // CURRENT RIDE
    // ==========================================

    async function loadCurrentRide() {

        try {

            const data =
                await getCurrentRide(token);

            setCurrentRide(
                data || null
            );

            return data;

        }
        catch (err) {

            console.error(
                "Current ride error:",
                err
            );

            setCurrentRide(null);

            return null;

        }

    }


    // ==========================================
    // AUTO REFRESH RIDE
    // ==========================================

    useEffect(() => {

        if (!driver) {
            return;
        }


        const interval =
            setInterval(
                loadCurrentRide,
                5000
            );


        return () => {
            clearInterval(interval);
        };

    }, [driver]);


    // ==========================================
    // LOCATION TRACKING
    // ==========================================

    function startLocationTracking() {

        if (!navigator.geolocation) {

            setError(
                "Geolocation is not supported by your browser."
            );

            return;

        }


        if (watchId.current !== null) {
            return;
        }


        watchId.current =
            navigator.geolocation.watchPosition(

                sendLocation,

                handleLocationError,

                {
                    enableHighAccuracy: true,
                    maximumAge: 5000,
                    timeout: 10000
                }

            );

    }


    function stopLocationTracking() {

        if (watchId.current !== null) {

            navigator.geolocation.clearWatch(
                watchId.current
            );

            watchId.current = null;

        }

    }


    // ==========================================
    // SEND LOCATION
    // ==========================================

    async function sendLocation(position) {

        const latitude =
            position.coords.latitude;

        const longitude =
            position.coords.longitude;


        setLocationLoading(true);


        try {

            const data =
                await updateDriverLocation(
                    latitude,
                    longitude
                );


            saveDriver(data);

            setError("");

        }
        catch (err) {

            console.error(
                "GPS update error:",
                err
            );

            setError(
                err?.message ||
                "Unable to update GPS location."
            );

        }
        finally {

            setLocationLoading(false);

        }

    }


    // ==========================================
    // GPS ERROR
    // ==========================================

    function handleLocationError(err) {

        let message =
            "Unable to access your current location.";


        if (
            err.code ===
            err.PERMISSION_DENIED
        ) {

            message =
                "Location permission denied. Please allow location access.";

        }
        else if (
            err.code ===
            err.POSITION_UNAVAILABLE
        ) {

            message =
                "Your current location is unavailable.";

        }
        else if (
            err.code ===
            err.TIMEOUT
        ) {

            message =
                "GPS request timed out. Trying again...";

        }


        setError(message);

    }


    // ==========================================
    // GO ONLINE
    // ==========================================

    async function handleOnline() {

        if (!driver?.verified) {

            setError(
                "Your driver profile must be verified before going online."
            );

            return;

        }


        try {

            setProcessing(true);
            setError("");
            setSuccess("");


            const data =
                await goOnline();


            saveDriver(data);

            startLocationTracking();


            setSuccess(
                "You are online. Live GPS tracking has started."
            );

        }
        catch (err) {

            console.error(
                "Go online error:",
                err
            );

            setError(
                err?.message ||
                "Unable to go online."
            );

        }
        finally {

            setProcessing(false);

        }

    }


    // ==========================================
    // GO OFFLINE
    // ==========================================

    async function handleOffline() {

        const confirmed =
            window.confirm(
                "Are you sure you want to go offline?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setProcessing(true);
            setError("");
            setSuccess("");


            const data =
                await goOffline();


            saveDriver(data);

            stopLocationTracking();


            setSuccess(
                "You are now offline."
            );

        }
        catch (err) {

            console.error(
                "Go offline error:",
                err
            );

            setError(
                err?.message ||
                "Unable to go offline."
            );

        }
        finally {

            setProcessing(false);

        }

    }


    // ==========================================
    // COMPLETE RIDE
    // ==========================================

    async function handleCompleteRide() {

        const rideId =
            getRideId(currentRide);


        if (!rideId) {

            setError(
                "Current ride ID not found."
            );

            return;

        }


        const confirmed =
            window.confirm(
                "Are you sure you want to complete this ride?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setRideProcessing(true);
            setError("");
            setSuccess("");


            await completeRide(
                rideId,
                token
            );


            setCurrentRide(null);

            await loadDriver();


            setSuccess(
                "Ride completed successfully."
            );

        }
        catch (err) {

            console.error(
                "Complete ride error:",
                err
            );

            setError(
                err?.message ||
                "Unable to complete ride."
            );

        }
        finally {

            setRideProcessing(false);

        }

    }


    // ==========================================
    // CANCEL RIDE
    // ==========================================

    async function handleCancelRide() {

        const rideId =
            getRideId(currentRide);


        if (!rideId) {

            setError(
                "Current ride ID not found."
            );

            return;

        }


        const confirmed =
            window.confirm(
                "Cancel this ride? This action cannot be undone."
            );


        if (!confirmed) {
            return;
        }


        try {

            setRideProcessing(true);
            setError("");
            setSuccess("");


            await cancelRide(
                rideId,
                token
            );


            setCurrentRide(null);

            await loadDriver();


            setSuccess(
                "Ride cancelled successfully."
            );

        }
        catch (err) {

            console.error(
                "Cancel ride error:",
                err
            );

            setError(
                err?.message ||
                "Unable to cancel ride."
            );

        }
        finally {

            setRideProcessing(false);

        }

    }


    // ==========================================
    // LOGOUT
    // ==========================================

    function handleLogout() {

        stopLocationTracking();


        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("driver");


        navigate(
            "/login",
            {
                replace: true
            }
        );

    }


    // ==========================================
    // HELPERS
    // ==========================================

    function getRideId(ride) {

        return (
            ride?.id ||
            ride?._id ||
            ride?.rideId
        );

    }


    const rideStatus =
        currentRide?.status ||
        "UNKNOWN";


    const latitude =
        driver?.currentLocation?.latitude;


    const longitude =
        driver?.currentLocation?.longitude;


    const rating =
        driver?.rating ??
        driver?.averageRating ??
        driver?.driverRating ??
        0;


    const totalRides =
        driver?.totalRides ??
        driver?.completedRides ??
        driver?.rideCount ??
        0;


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="dashboard-loading">

                <div className="loading-card">

                    <div className="loading-icon">
                        🚕
                    </div>

                    <div className="loading-spinner"></div>

                    <h2>
                        Loading Dashboard
                    </h2>

                    <p>
                        Connecting to SmartRide...
                    </p>

                </div>


                <DashboardCSS />

            </div>

        );

    }


    // ==========================================
    // PROFILE NOT FOUND
    // ==========================================

    if (profileNotFound) {

        return (

            <>

                <div className="dashboard-page">

                    <header className="dashboard-navbar">

                        <div className="brand">

                            <div className="brand-logo">
                                🚗
                            </div>

                            <div>
                                <strong>
                                    SmartRide
                                </strong>

                                <small>
                                    Driver Portal
                                </small>
                            </div>

                        </div>


                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </header>


                    <main className="registration-empty">

                        <div className="registration-empty-card">

                            <div className="empty-icon">
                                🚕
                            </div>

                            <span className="eyebrow">
                                DRIVER PORTAL
                            </span>

                            <h1>
                                Become a SmartRide Driver
                            </h1>

                            <p>
                                You don't have a driver profile yet.
                                Register your license and vehicle
                                information to start driving.
                            </p>


                            <div className="empty-info">

                                <span>
                                    🪪
                                </span>

                                <div>

                                    <strong>
                                        Quick Registration
                                    </strong>

                                    <p>
                                        License number, vehicle number
                                        and vehicle type are required.
                                    </p>

                                </div>

                            </div>


                            <button
                                className="primary-button large"
                                onClick={() =>
                                    navigate(
                                        "/driver/register"
                                    )
                                }
                            >
                                🚕 Register as Driver
                            </button>


                            <button
                                className="secondary-button"
                                onClick={() =>
                                    navigate("/")
                                }
                            >
                                ← Back to Home
                            </button>

                        </div>

                    </main>

                </div>


                <DashboardCSS />

            </>

        );

    }


    // ==========================================
    // MAIN DASHBOARD
    // ==========================================

    return (

        <>

            <div className="dashboard-page">


                {/* =================================
                    NAVBAR
                ================================= */}

                <header className="dashboard-navbar">

                    <div className="brand">

                        <div className="brand-logo">
                            🚗
                        </div>

                        <div>

                            <strong>
                                SmartRide
                            </strong>

                            <small>
                                Driver Portal
                            </small>

                        </div>

                    </div>


                    <nav className="nav-actions">

                        <button
                            onClick={() =>
                                navigate(
                                    "/driver/rides"
                                )
                            }
                        >
                            🚕 Rides
                        </button>

                        <button
                            onClick={() =>
                                navigate(
                                    "/driver/profile"
                                )
                            }
                        >
                            👤 Profile
                        </button>

                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </nav>

                </header>


                {/* =================================
                    MAIN
                ================================= */}

                <main className="dashboard-container">


                    {/* PAGE HEADER */}

                    <section className="dashboard-heading">

                        <div>

                            <span className="eyebrow">
                                DRIVER CONTROL CENTER
                            </span>

                            <h1>
                                Good to see you back 🚗
                            </h1>

                            <p>
                                Manage your availability,
                                rides and live location.
                            </p>

                        </div>

                    </section>


                    {/* MESSAGES */}

                    {error && (

                        <div className="dashboard-alert error">

                            <span>⚠️</span>

                            <span>
                                {error}
                            </span>

                            <button
                                onClick={() =>
                                    setError("")
                                }
                            >
                                ×
                            </button>

                        </div>

                    )}


                    {success && (

                        <div className="dashboard-alert success">

                            <span>✓</span>

                            <span>
                                {success}
                            </span>

                            <button
                                onClick={() =>
                                    setSuccess("")
                                }
                            >
                                ×
                            </button>

                        </div>

                    )}


                    {/* =================================
                        STATUS CARD
                    ================================= */}

                    <section className="driver-status-card">

                        <div className="status-left">

                            <div
                                className={
                                    driver?.online
                                        ? "status-icon online"
                                        : "status-icon offline"
                                }
                            >
                                {driver?.online
                                    ? "●"
                                    : "○"
                                }
                            </div>


                            <div>

                                <span className="status-label">
                                    CURRENT STATUS
                                </span>

                                <h2>
                                    {driver?.online
                                        ? "You're Online"
                                        : "You're Offline"
                                    }
                                </h2>

                                <div className="verification-row">

                                    {driver?.verified ? (

                                        <span className="verified-badge">
                                            ✓ Verified Driver
                                        </span>

                                    ) : (

                                        <span className="pending-badge-dashboard">
                                            ⚠ Verification Pending
                                        </span>

                                    )}

                                </div>

                            </div>

                        </div>


                        <div className="status-actions">

                            {driver?.online ? (

                                <button
                                    className="offline-button"
                                    disabled={processing}
                                    onClick={
                                        handleOffline
                                    }
                                >

                                    {processing
                                        ? "Processing..."
                                        : "🔴 Go Offline"
                                    }

                                </button>

                            ) : (

                                <button
                                    className="online-button"
                                    disabled={
                                        processing ||
                                        !driver?.verified
                                    }
                                    onClick={
                                        handleOnline
                                    }
                                >

                                    {processing
                                        ? "Processing..."
                                        : "🟢 Go Online"
                                    }

                                </button>

                            )}


                            {currentRide && (

                                <button
                                    className="purple-button"
                                    onClick={() =>
                                        navigate(
                                            "/driver/current-ride"
                                        )
                                    }
                                >
                                    🚕 Current Ride
                                </button>

                            )}

                        </div>

                    </section>


                    {/* =================================
                        STATS
                    ================================= */}

                    <section className="stats-grid">

                        <StatCard
                            icon="⭐"
                            title="Your Rating"
                            value={
                                Number(rating).toFixed(1)
                            }
                            subtitle="out of 5"
                        />

                        <StatCard
                            icon="🚕"
                            title="Total Rides"
                            value={
                                totalRides
                            }
                            subtitle="Completed rides"
                        />

                        <StatCard
                            icon="📍"
                            title="GPS Status"
                            value={
                                latitude != null
                                    ? "Active"
                                    : "Waiting"
                            }
                            subtitle={
                                driver?.online
                                    ? "Live tracking"
                                    : "Driver offline"
                            }
                        />

                    </section>


                    {/* =================================
                        CURRENT RIDE
                    ================================= */}

                    {currentRide ? (

                        <section className="current-ride-card">

                            <div className="section-heading">

                                <div>

                                    <span className="eyebrow blue">
                                        ACTIVE RIDE
                                    </span>

                                    <h2>
                                        🚕 Current Ride
                                    </h2>

                                    <p>
                                        Ride #
                                        {getRideId(
                                            currentRide
                                        )}
                                    </p>

                                </div>


                                <span
                                    className={
                                        `ride-status ${rideStatus
                                            .toLowerCase()
                                            .replace(
                                                /_/g,
                                                "-"
                                            )}`
                                    }
                                >
                                    {rideStatus}
                                </span>

                            </div>


                            <div className="ride-grid">

                                <RideInfo
                                    icon="📍"
                                    title="Pickup"
                                    value={
                                        getLocationText(
                                            currentRide?.pickupLocation
                                        )
                                    }
                                />

                                <RideInfo
                                    icon="🏁"
                                    title="Destination"
                                    value={
                                        getLocationText(
                                            currentRide?.dropLocation ||
                                            currentRide?.destinationLocation
                                        )
                                    }
                                />

                                <RideInfo
                                    icon="📏"
                                    title="Distance"
                                    value={
                                        formatDistance(
                                            currentRide
                                        )
                                    }
                                />

                                <RideInfo
                                    icon="💰"
                                    title="Fare"
                                    value={
                                        formatFare(
                                            currentRide
                                        )
                                    }
                                />

                            </div>


                            <div className="ride-actions">

                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        navigate(
                                            "/driver/current-ride"
                                        )
                                    }
                                >
                                    🗺️ Open Live Ride
                                </button>


                                {(
                                    rideStatus ===
                                    "IN_PROGRESS" ||
                                    rideStatus ===
                                    "STARTED"
                                ) && (

                                    <button
                                        className="complete-button"
                                        disabled={
                                            rideProcessing
                                        }
                                        onClick={
                                            handleCompleteRide
                                        }
                                    >
                                        ✓ Complete Ride
                                    </button>

                                )}


                                {rideStatus !== "COMPLETED" &&
                                rideStatus !== "CANCELLED" && (

                                    <button
                                        className="cancel-button"
                                        disabled={
                                            rideProcessing
                                        }
                                        onClick={
                                            handleCancelRide
                                        }
                                    >
                                        ✕ Cancel Ride
                                    </button>

                                )}

                            </div>

                        </section>

                    ) : (

                        <section className="empty-ride-card">

                            <div className="empty-ride-icon">
                                🚕
                            </div>

                            <div>

                                <h2>
                                    No Active Ride
                                </h2>

                                <p>
                                    You don't have an active
                                    ride right now.
                                </p>

                            </div>


                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate(
                                        "/driver/rides"
                                    )
                                }
                            >
                                Find Available Rides
                            </button>

                        </section>

                    )}


                    {/* =================================
                        MAP
                    ================================= */}

                    <section className="dashboard-card">

                        <div className="section-heading">

                            <div>

                                <span className="eyebrow">
                                    LIVE LOCATION
                                </span>

                                <h2>
                                    📍 Driver Location
                                </h2>

                                <p>
                                    Your current GPS position
                                </p>

                            </div>


                            {driver?.online && (

                                <span className="live-badge">
                                    ● LIVE
                                </span>

                            )}

                        </div>


                        <div className="map-wrapper">

                            <DriverMap
                                latitude={
                                    latitude
                                }
                                longitude={
                                    longitude
                                }
                                online={
                                    driver?.online
                                }
                            />

                        </div>


                        {locationLoading && (

                            <div className="location-loading">
                                🔄 Updating GPS location...
                            </div>

                        )}

                    </section>


                    {/* =================================
                        DRIVER INFORMATION
                    ================================= */}

                    <section className="dashboard-card">

                        <div className="section-heading">

                            <div>

                                <span className="eyebrow">
                                    PROFILE
                                </span>

                                <h2>
                                    👤 Driver Information
                                </h2>

                                <p>
                                    Your registered driver details
                                </p>

                            </div>


                            <button
                                className="small-action"
                                onClick={() =>
                                    navigate(
                                        "/driver/profile"
                                    )
                                }
                            >
                                View Profile →
                            </button>

                        </div>


                        <div className="profile-grid">

                            <Info
                                label="License Number"
                                value={
                                    driver?.licenseNumber ||
                                    "N/A"
                                }
                            />

                            <Info
                                label="Vehicle Number"
                                value={
                                    driver?.vehicleNumber ||
                                    "N/A"
                                }
                            />

                            <Info
                                label="Vehicle Type"
                                value={
                                    driver?.vehicleType ||
                                    "N/A"
                                }
                            />

                            <Info
                                label="Verification"
                                value={
                                    driver?.verified
                                        ? "✓ Verified"
                                        : (
                                            driver?.verificationStatus ||
                                            "Pending"
                                        )
                                }
                            />

                            <Info
                                label="Rating"
                                value={
                                    `⭐ ${Number(
                                        rating
                                    ).toFixed(1)} / 5`
                                }
                            />

                            <Info
                                label="Total Rides"
                                value={
                                    totalRides
                                }
                            />

                        </div>

                    </section>


                    {/* =================================
                        QUICK ACTIONS
                    ================================= */}

                    <section className="quick-actions">

                        <QuickAction
                            icon="🚕"
                            title="Available Rides"
                            onClick={() =>
                                navigate(
                                    "/driver/rides"
                                )
                            }
                        />

                        <QuickAction
                            icon="🗺️"
                            title="Current Ride"
                            onClick={() =>
                                navigate(
                                    "/driver/current-ride"
                                )
                            }
                        />

                        <QuickAction
                            icon="👤"
                            title="Driver Profile"
                            onClick={() =>
                                navigate(
                                    "/driver/profile"
                                )
                            }
                        />

                    </section>

                </main>

            </div>


            <DashboardCSS />

        </>

    );

}


// ==========================================
// STAT CARD
// ==========================================

function StatCard({
    icon,
    title,
    value,
    subtitle
}) {

    return (

        <div className="stat-card">

            <div className="stat-top">

                <div className="stat-icon">
                    {icon}
                </div>

            </div>

            <h2>
                {value}
            </h2>

            <strong>
                {title}
            </strong>

            <span>
                {subtitle}
            </span>

        </div>

    );

}


// ==========================================
// RIDE INFO
// ==========================================

function RideInfo({
    icon,
    title,
    value
}) {

    return (

        <div className="ride-info">

            <div className="ride-info-icon">
                {icon}
            </div>

            <div>

                <span>
                    {title}
                </span>

                <strong>
                    {value}
                </strong>

            </div>

        </div>

    );

}


// ==========================================
// PROFILE INFO
// ==========================================

function Info({
    label,
    value
}) {

    return (

        <div className="profile-item">

            <span>
                {label}
            </span>

            <strong>
                {value}
            </strong>

        </div>

    );

}


// ==========================================
// QUICK ACTION
// ==========================================

function QuickAction({
    icon,
    title,
    onClick
}) {

    return (

        <button
            className="quick-action"
            onClick={onClick}
        >

            <span className="quick-icon">
                {icon}
            </span>

            <span>
                {title}
            </span>

            <span className="quick-arrow">
                →
            </span>

        </button>

    );

}


// ==========================================
// LOCATION TEXT
// ==========================================

function getLocationText(location) {

    if (!location) {
        return "Location unavailable";
    }


    if (typeof location === "string") {
        return location;
    }


    if (location.address) {
        return location.address;
    }


    if (location.location) {
        return location.location;
    }


    if (location.name) {
        return location.name;
    }


    if (
        location.latitude != null &&
        location.longitude != null
    ) {

        return (
            `${Number(location.latitude).toFixed(5)}, ` +
            `${Number(location.longitude).toFixed(5)}`
        );

    }


    return "Address unavailable";

}


// ==========================================
// DISTANCE
// ==========================================

function formatDistance(ride) {

    const distance =
        ride?.distance ??
        ride?.distanceKm;


    if (distance == null) {
        return "N/A";
    }


    return `${Number(distance).toFixed(2)} km`;

}


// ==========================================
// FARE
// ==========================================

function formatFare(ride) {

    const fare =
        ride?.fare ??
        ride?.totalFare ??
        ride?.estimatedFare;


    if (fare == null) {
        return "N/A";
    }


    return `₹${Number(fare).toFixed(2)}`;

}


// ==========================================
// CSS
// ==========================================

function DashboardCSS() {

    return (

        <style>{`

            * {
                box-sizing: border-box;
            }


            body {
                margin: 0;
                font-family:
                    Inter,
                    system-ui,
                    -apple-system,
                    BlinkMacSystemFont,
                    "Segoe UI",
                    sans-serif;
                background: #f8fafc;
                color: #0f172a;
            }


            button {
                font-family: inherit;
            }


            .dashboard-page {
                min-height: 100vh;

                background:
                    radial-gradient(
                        circle at top right,
                        rgba(219,234,254,.8),
                        transparent 30%
                    ),
                    #f8fafc;
            }


            /* =====================================
               NAVBAR
            ===================================== */

            .dashboard-navbar {

                height: 76px;

                background:
                    rgba(15,23,42,.96);

                color: white;

                padding:
                    0 clamp(18px,4vw,50px);

                display: flex;

                justify-content: space-between;

                align-items: center;

                position: sticky;

                top: 0;

                z-index: 100;

                box-shadow:
                    0 5px 25px
                    rgba(15,23,42,.15);
            }


            .brand {

                display: flex;

                align-items: center;

                gap: 12px;
            }


            .brand-logo {

                width: 43px;
                height: 43px;

                display: flex;

                align-items: center;

                justify-content: center;

                border-radius: 12px;

                background:
                    linear-gradient(
                        135deg,
                        #2563eb,
                        #4f46e5
                    );

                font-size: 22px;
            }


            .brand strong {

                display: block;

                font-size: 17px;
            }


            .brand small {

                display: block;

                color: #94a3b8;

                font-size: 11px;

                margin-top: 2px;
            }


            .nav-actions {

                display: flex;

                align-items: center;

                gap: 8px;
            }


            .nav-actions button {

                border: none;

                background: transparent;

                color: #cbd5e1;

                padding:
                    9px 13px;

                border-radius: 8px;

                cursor: pointer;

                font-weight: 600;
            }


            .nav-actions button:hover {

                background: #1e293b;

                color: white;
            }


            .logout-button {

                background: #dc2626 !important;

                color: white !important;
            }


            /* =====================================
               CONTAINER
            ===================================== */

            .dashboard-container {

                max-width: 1200px;

                margin: auto;

                padding:
                    45px 20px 60px;
            }


            .dashboard-heading {

                margin-bottom: 28px;
            }


            .eyebrow {

                display: block;

                color: #64748b;

                font-size: 11px;

                font-weight: 800;

                letter-spacing: 1.5px;

                margin-bottom: 7px;
            }


            .eyebrow.blue {
                color: #2563eb;
            }


            .dashboard-heading h1 {

                margin: 0;

                font-size:
                    clamp(28px,4vw,38px);

                letter-spacing: -.7px;
            }


            .dashboard-heading p {

                margin: 8px 0 0;

                color: #64748b;
            }


            /* =====================================
               ALERT
            ===================================== */

            .dashboard-alert {

                display: flex;

                align-items: center;

                gap: 10px;

                padding: 14px 16px;

                border-radius: 12px;

                margin-bottom: 20px;

                font-size: 14px;

                font-weight: 600;
            }


            .dashboard-alert button {

                margin-left: auto;

                border: none;

                background: transparent;

                font-size: 20px;

                cursor: pointer;

                color: inherit;
            }


            .dashboard-alert.error {

                background: #fef2f2;

                color: #b91c1c;

                border: 1px solid #fecaca;
            }


            .dashboard-alert.success {

                background: #f0fdf4;

                color: #15803d;

                border: 1px solid #bbf7d0;
            }


            /* =====================================
               STATUS
            ===================================== */

            .driver-status-card {

                background: white;

                border:
                    1px solid #e2e8f0;

                border-radius: 18px;

                padding: 25px;

                display: flex;

                align-items: center;

                justify-content: space-between;

                gap: 20px;

                box-shadow:
                    0 8px 30px
                    rgba(15,23,42,.06);
            }


            .status-left {

                display: flex;

                align-items: center;

                gap: 15px;
            }


            .status-icon {

                width: 55px;
                height: 55px;

                border-radius: 16px;

                display: flex;

                align-items: center;

                justify-content: center;

                font-size: 26px;
            }


            .status-icon.online {

                background: #dcfce7;

                color: #16a34a;
            }


            .status-icon.offline {

                background: #f1f5f9;

                color: #64748b;
            }


            .status-label {

                color: #94a3b8;

                font-size: 10px;

                font-weight: 800;

                letter-spacing: 1.2px;
            }


            .status-left h2 {

                margin:
                    4px 0 7px;

                font-size: 21px;
            }


            .verified-badge,
            .pending-badge-dashboard {

                font-size: 11px;

                font-weight: 700;
            }


            .verified-badge {
                color: #15803d;
            }


            .pending-badge-dashboard {
                color: #b45309;
            }


            .status-actions {

                display: flex;

                gap: 10px;

                flex-wrap: wrap;

                justify-content: flex-end;
            }


            .online-button,
            .offline-button,
            .purple-button {

                border: none;

                padding:
                    12px 18px;

                border-radius: 10px;

                color: white;

                font-weight: 800;

                cursor: pointer;

                transition:
                    transform .2s,
                    opacity .2s;
            }


            .online-button {

                background: #16a34a;
            }


            .offline-button {

                background: #dc2626;
            }


            .purple-button {

                background: #7c3aed;
            }


            .online-button:hover:not(:disabled),
            .offline-button:hover:not(:disabled),
            .purple-button:hover {

                transform: translateY(-2px);
            }


            .online-button:disabled {

                background: #94a3b8;

                cursor: not-allowed;

                opacity: .65;
            }


            /* =====================================
               STATS
            ===================================== */

            .stats-grid {

                display: grid;

                grid-template-columns:
                    repeat(3,1fr);

                gap: 18px;

                margin-top: 20px;
            }


            .stat-card {

                background: white;

                border:
                    1px solid #e2e8f0;

                border-radius: 16px;

                padding: 23px;

                box-shadow:
                    0 6px 25px
                    rgba(15,23,42,.05);
            }


            .stat-top {

                display: flex;

                justify-content: space-between;
            }


            .stat-icon {

                width: 42px;
                height: 42px;

                border-radius: 12px;

                background: #eff6ff;

                display: flex;

                align-items: center;

                justify-content: center;

                font-size: 20px;
            }


            .stat-card h2 {

                margin:
                    18px 0 3px;

                font-size: 28px;
            }


            .stat-card strong {

                display: block;

                font-size: 14px;
            }


            .stat-card span {

                display: block;

                margin-top: 5px;

                color: #94a3b8;

                font-size: 12px;
            }


            /* =====================================
               CARDS
            ===================================== */

            .dashboard-card,
            .current-ride-card {

                margin-top: 20px;

                background: white;

                border:
                    1px solid #e2e8f0;

                border-radius: 18px;

                padding: 25px;

                box-shadow:
                    0 6px 25px
                    rgba(15,23,42,.05);
            }


            .current-ride-card {

                border:
                    1px solid #bfdbfe;

                box-shadow:
                    0 10px 35px
                    rgba(37,99,235,.08);
            }


            .section-heading {

                display: flex;

                justify-content: space-between;

                align-items: flex-start;

                gap: 15px;

                margin-bottom: 20px;
            }


            .section-heading h2 {

                margin: 0;

                font-size: 20px;
            }


            .section-heading p {

                margin:
                    5px 0 0;

                color: #64748b;

                font-size: 13px;
            }


            .live-badge {

                background: #dcfce7;

                color: #15803d;

                padding:
                    7px 10px;

                border-radius: 20px;

                font-size: 10px;

                font-weight: 800;
            }


            /* =====================================
               RIDE
            ===================================== */

            .ride-status {

                padding:
                    7px 12px;

                border-radius: 20px;

                background: #f1f5f9;

                color: #475569;

                font-size: 10px;

                font-weight: 800;
            }


            .ride-status.in-progress,
            .ride-status.started {

                background: #dcfce7;

                color: #15803d;
            }


            .ride-status.accepted {

                background: #fef3c7;

                color: #92400e;
            }


            .ride-status.driver-arriving,
            .ride-status.arriving {

                background: #dbeafe;

                color: #1d4ed8;
            }


            .ride-grid {

                display: grid;

                grid-template-columns:
                    repeat(4,1fr);

                gap: 12px;
            }


            .ride-info {

                background: #f8fafc;

                border:
                    1px solid #e2e8f0;

                border-radius: 12px;

                padding: 16px;

                display: flex;

                gap: 11px;

                min-width: 0;
            }


            .ride-info-icon {

                font-size: 20px;
            }


            .ride-info span {

                display: block;

                color: #94a3b8;

                font-size: 10px;

                font-weight: 800;

                text-transform: uppercase;

                margin-bottom: 5px;
            }


            .ride-info strong {

                display: block;

                font-size: 13px;

                overflow-wrap: anywhere;
            }


            .ride-actions {

                display: flex;

                gap: 10px;

                flex-wrap: wrap;

                margin-top: 20px;
            }


            .primary-button,
            .complete-button,
            .cancel-button {

                border: none;

                padding:
                    12px 18px;

                border-radius: 10px;

                color: white;

                font-weight: 800;

                cursor: pointer;
            }


            .primary-button {

                background:
                    linear-gradient(
                        135deg,
                        #2563eb,
                        #4f46e5
                    );
            }


            .complete-button {

                background: #16a34a;
            }


            .cancel-button {

                background: #dc2626;
            }


            .primary-button:disabled,
            .complete-button:disabled,
            .cancel-button:disabled {

                opacity: .55;

                cursor: not-allowed;
            }


            /* =====================================
               EMPTY RIDE
            ===================================== */

            .empty-ride-card {

                margin-top: 20px;

                background: white;

                border:
                    1px solid #e2e8f0;

                border-radius: 18px;

                padding: 27px;

                display: flex;

                align-items: center;

                gap: 18px;

                flex-wrap: wrap;

                box-shadow:
                    0 6px 25px
                    rgba(15,23,42,.05);
            }


            .empty-ride-icon {

                width: 58px;
                height: 58px;

                display: flex;

                align-items: center;

                justify-content: center;

                background: #eff6ff;

                border-radius: 16px;

                font-size: 27px;
            }


            .empty-ride-card h2 {

                margin: 0 0 4px;

                font-size: 18px;
            }


            .empty-ride-card p {

                margin: 0;

                color: #64748b;

                font-size: 13px;
            }


            .empty-ride-card .primary-button {

                margin-left: auto;
            }


            /* =====================================
               MAP
            ===================================== */

            .map-wrapper {

                width: 100%;

                min-height: 300px;

                overflow: hidden;

                border-radius: 14px;

                background: #f1f5f9;
            }


            .location-loading {

                margin-top: 12px;

                color: #2563eb;

                font-size: 12px;

                font-weight: 600;
            }


            /* =====================================
               PROFILE
            ===================================== */

            .small-action {

                border: none;

                background: #eff6ff;

                color: #2563eb;

                padding:
                    9px 13px;

                border-radius: 9px;

                font-weight: 700;

                cursor: pointer;
            }


            .profile-grid {

                display: grid;

                grid-template-columns:
                    repeat(3,1fr);

                gap: 15px;
            }


            .profile-item {

                background: #f8fafc;

                border:
                    1px solid #e2e8f0;

                padding: 16px;

                border-radius: 11px;
            }


            .profile-item span {

                display: block;

                color: #94a3b8;

                font-size: 10px;

                font-weight: 800;

                text-transform: uppercase;

                margin-bottom: 6px;
            }


            .profile-item strong {

                font-size: 14px;

                overflow-wrap: anywhere;
            }


            /* =====================================
               QUICK ACTIONS
            ===================================== */

            .quick-actions {

                display: grid;

                grid-template-columns:
                    repeat(3,1fr);

                gap: 14px;

                margin-top: 20px;
            }


            .quick-action {

                border: none;

                background: #0f172a;

                color: white;

                border-radius: 14px;

                padding: 20px;

                display: flex;

                align-items: center;

                gap: 12px;

                cursor: pointer;

                font-weight: 700;

                text-align: left;
            }


            .quick-action:hover {

                background: #1e293b;
            }


            .quick-icon {

                font-size: 22px;
            }


            .quick-arrow {

                margin-left: auto;

                color: #64748b;

                font-size: 20px;
            }


            /* =====================================
               REGISTRATION EMPTY
            ===================================== */

            .registration-empty {

                min-height:
                    calc(100vh - 76px);

                display: flex;

                align-items: center;

                justify-content: center;

                padding: 30px 20px;
            }


            .registration-empty-card {

                max-width: 560px;

                width: 100%;

                background: white;

                border:
                    1px solid #e2e8f0;

                border-radius: 22px;

                padding: 45px;

                text-align: center;

                box-shadow:
                    0 20px 60px
                    rgba(15,23,42,.08);
            }


            .empty-icon {

                width: 80px;
                height: 80px;

                margin: auto auto 20px;

                display: flex;

                align-items: center;

                justify-content: center;

                border-radius: 22px;

                background:
                    linear-gradient(
                        135deg,
                        #2563eb,
                        #4f46e5
                    );

                font-size: 38px;
            }


            .registration-empty-card h1 {

                margin:
                    0 0 10px;

                font-size: 28px;
            }


            .registration-empty-card > p {

                color: #64748b;

                line-height: 1.6;

                font-size: 14px;
            }


            .empty-info {

                display: flex;

                text-align: left;

                gap: 12px;

                margin:
                    25px 0;

                padding: 17px;

                background: #eff6ff;

                border-radius: 12px;

                color: #1d4ed8;
            }


            .empty-info p {

                margin:
                    4px 0 0;

                font-size: 12px;

                color: #64748b;
            }


            .large {

                width: 100%;

                height: 50px;
            }


            .secondary-button {

                width: 100%;

                height: 46px;

                margin-top: 10px;

                border: none;

                background: #f1f5f9;

                color: #475569;

                border-radius: 10px;

                font-weight: 700;

                cursor: pointer;
            }


            /* =====================================
               LOADING
            ===================================== */

            .dashboard-loading {

                min-height: 100vh;

                display: flex;

                align-items: center;

                justify-content: center;

                background: #f8fafc;
            }


            .loading-card {

                background: white;

                padding: 40px;

                border-radius: 20px;

                text-align: center;

                box-shadow:
                    0 15px 50px
                    rgba(15,23,42,.08);
            }


            .loading-icon {

                font-size: 45px;

                margin-bottom: 12px;
            }


            .loading-spinner {

                width: 25px;
                height: 25px;

                margin: auto;

                border:
                    3px solid #dbeafe;

                border-top-color: #2563eb;

                border-radius: 50%;

                animation:
                    spin-dashboard .8s linear infinite;
            }


            .loading-card h2 {

                margin:
                    18px 0 5px;
            }


            .loading-card p {

                margin: 0;

                color: #64748b;

                font-size: 13px;
            }


            @keyframes spin-dashboard {

                to {
                    transform: rotate(360deg);
                }

            }


            /* =====================================
               RESPONSIVE
            ===================================== */

            @media(max-width: 900px) {

                .ride-grid {

                    grid-template-columns:
                        repeat(2,1fr);
                }


                .profile-grid {

                    grid-template-columns:
                        repeat(2,1fr);
                }

            }


            @media(max-width: 700px) {

                .dashboard-navbar {

                    height: auto;

                    min-height: 70px;

                    padding: 12px 15px;

                    gap: 10px;

                    flex-wrap: wrap;
                }


                .nav-actions {

                    width: 100%;

                    overflow-x: auto;
                }


                .nav-actions button {

                    white-space: nowrap;
                }


                .dashboard-container {

                    padding:
                        30px 14px 45px;
                }


                .driver-status-card {

                    align-items: flex-start;

                    flex-direction: column;
                }


                .status-actions {

                    width: 100%;

                    justify-content: flex-start;
                }


                .stats-grid {

                    grid-template-columns:
                        1fr;
                }


                .quick-actions {

                    grid-template-columns:
                        1fr;
                }

            }


            @media(max-width: 550px) {

                .ride-grid,
                .profile-grid {

                    grid-template-columns:
                        1fr;
                }


                .section-heading {

                    flex-direction: column;
                }


                .empty-ride-card .primary-button {

                    margin-left: 0;

                    width: 100%;
                }


                .registration-empty-card {

                    padding: 30px 20px;
                }


                .registration-empty-card h1 {

                    font-size: 23px;
                }


                .dashboard-heading h1 {

                    font-size: 28px;
                }

            }

        `}</style>

    );

}


export default DriverDashboard;