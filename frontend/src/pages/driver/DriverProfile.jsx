import React, {
    useEffect,
    useState
} from "react";

import {
    getDriverProfile,
    submitDriverVerification
} from "../../api/driverApi";

import {
    useNavigate
} from "react-router-dom";


function DriverProfile() {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [driver, setDriver] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [profileNotFound, setProfileNotFound] =
        useState(false);


    // =====================================================
    // VERIFICATION FORM STATE
    // =====================================================

    const [showVerificationForm, setShowVerificationForm] =
        useState(false);

    const [licenseNumber, setLicenseNumber] =
        useState("");

    const [vehicleNumber, setVehicleNumber] =
        useState("");

    const [vehicleType, setVehicleType] =
        useState("");


    const [verificationLoading, setVerificationLoading] =
        useState(false);

    const [verificationError, setVerificationError] =
        useState("");

    const [verificationSuccess, setVerificationSuccess] =
        useState("");


    // =====================================================
    // LOAD PROFILE
    // =====================================================

    useEffect(() => {

        loadDriverProfile();

    }, []);


    // =====================================================
    // GET DRIVER PROFILE
    // =====================================================

    async function loadDriverProfile(
        isRefresh = false
    ) {

        try {

            if (isRefresh) {

                setRefreshing(true);

            } else {

                setLoading(true);

            }


            setError("");

            setProfileNotFound(false);


            const data =
                await getDriverProfile();


            console.log(
                "Driver Profile:",
                data
            );


            if (!data) {

                setDriver(null);

                setProfileNotFound(true);

                return;
            }


            setDriver(data);

            setProfileNotFound(false);


            // =============================================
            // LOAD EXISTING VALUES INTO FORM
            // =============================================

            setLicenseNumber(
                data.licenseNumber || ""
            );

            setVehicleNumber(
                data.vehicleNumber || ""
            );

            setVehicleType(
                data.vehicleType || ""
            );

        }

        catch (err) {

            console.error(
                "Driver profile error:",
                err
            );


            const message =
                (
                    err?.message ||
                    ""
                ).toLowerCase();


            if (
                message.includes(
                    "profile not found"
                ) ||
                message.includes(
                    "driver not registered"
                ) ||
                message.includes(
                    "not registered"
                )
            ) {

                setDriver(null);

                setProfileNotFound(true);

                setError("");

                return;
            }


            setError(
                err?.message ||
                "Failed to load driver profile."
            );

        }

        finally {

            setLoading(false);

            setRefreshing(false);

        }

    }


    // =====================================================
    // OPEN VERIFICATION FORM
    // =====================================================

    function openVerificationForm() {

        setVerificationError("");

        setVerificationSuccess("");


        setLicenseNumber(
            driver?.licenseNumber || ""
        );

        setVehicleNumber(
            driver?.vehicleNumber || ""
        );

        setVehicleType(
            driver?.vehicleType || ""
        );


        setShowVerificationForm(true);

    }


    // =====================================================
    // CLOSE VERIFICATION FORM
    // =====================================================

    function closeVerificationForm() {

        if (verificationLoading) {
            return;
        }


        setShowVerificationForm(false);

        setVerificationError("");

    }


    // =====================================================
    // SUBMIT VERIFICATION
    // =====================================================

    async function handleVerificationSubmit(
        event
    ) {

        event.preventDefault();


        setVerificationError("");

        setVerificationSuccess("");


        // =============================================
        // VALIDATION
        // =============================================

        if (!licenseNumber.trim()) {

            setVerificationError(
                "Please enter your driving license number."
            );

            return;
        }


        if (!vehicleNumber.trim()) {

            setVerificationError(
                "Please enter your vehicle number."
            );

            return;
        }


        if (!vehicleType) {

            setVerificationError(
                "Please select your vehicle type."
            );

            return;
        }


        try {

            setVerificationLoading(true);


            await submitDriverVerification(
                licenseNumber.trim(),
                vehicleNumber.trim(),
                vehicleType
            );


            setVerificationSuccess(
                "Verification request submitted successfully. Your details have been sent to the administrator."
            );


            // =============================================
            // REFRESH PROFILE
            // =============================================

            await loadDriverProfile(true);


            // =============================================
            // CLOSE FORM AFTER SHORT DELAY
            // =============================================

            setTimeout(() => {

                setShowVerificationForm(false);

            }, 1200);

        }

        catch (err) {

            console.error(
                "Driver verification error:",
                err
            );


            setVerificationError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to submit verification request."
            );

        }

        finally {

            setVerificationLoading(false);

        }

    }


    // =====================================================
    // BACK
    // =====================================================

    function handleBack() {

        navigate(
            "/driver/dashboard"
        );

    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div style={styles.page}>

                <div style={styles.loadingCard}>

                    <div style={styles.loadingIcon}>
                        🚗
                    </div>

                    <h2>
                        Loading Driver Profile
                    </h2>

                    <p style={styles.muted}>
                        Fetching your latest information...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // PROFILE NOT FOUND
    // =====================================================

    if (profileNotFound) {

        return (

            <div style={styles.page}>

                <div style={styles.notFoundCard}>

                    <div style={styles.notFoundIcon}>
                        🚕
                    </div>

                    <h1 style={styles.notFoundTitle}>
                        Driver Profile Not Found
                    </h1>

                    <p style={styles.notFoundText}>
                        You don't have a SmartRide driver
                        profile associated with this account.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/driver/register"
                            )
                        }
                        style={styles.registerButton}
                    >
                        🚕 Register as Driver
                    </button>

                    <button
                        onClick={handleBack}
                        style={styles.backButtonLarge}
                    >
                        ← Back to Dashboard
                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div style={styles.page}>

                <div style={styles.errorCard}>

                    <div style={styles.errorIcon}>
                        ⚠️
                    </div>

                    <h2>
                        Unable to Load Profile
                    </h2>

                    <p style={styles.errorText}>
                        {error}
                    </p>

                    <div style={styles.errorActions}>

                        <button
                            onClick={() =>
                                loadDriverProfile()
                            }
                            style={styles.primaryButton}
                        >
                            🔄 Try Again
                        </button>

                        <button
                            onClick={handleBack}
                            style={styles.secondaryButton}
                        >
                            ← Dashboard
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // SAFETY CHECK
    // =====================================================

    if (!driver) {

        return (

            <div style={styles.page}>

                <div style={styles.notFoundCard}>

                    <div style={styles.notFoundIcon}>
                        🚕
                    </div>

                    <h1 style={styles.notFoundTitle}>
                        Driver Profile Not Found
                    </h1>

                    <p style={styles.notFoundText}>
                        You haven't registered as a
                        SmartRide driver yet.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/driver/register"
                            )
                        }
                        style={styles.registerButton}
                    >
                        🚕 Register as Driver
                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // DRIVER DATA
    // =====================================================

    const isOnline =
        driver.online === true;


    const isVerified =
        driver.verified === true;


    const status =
        isOnline
            ? "ONLINE"
            : "OFFLINE";


    const verification =
        isVerified
            ? "VERIFIED"
            : (
                driver.verificationStatus ||
                "PENDING"
            );


    const rating =
        Number(
            driver.rating ??
            driver.averageRating ??
            0
        );


    const totalRides =
        driver.totalRides ??
        driver.completedRides ??
        driver.rideCount ??
        0;


    const initials =
        driver.name
            ? driver.name
                .split(" ")
                .filter(Boolean)
                .map(
                    word =>
                        word.charAt(0)
                )
                .join("")
                .substring(0, 2)
                .toUpperCase()
            : "DR";


    // =====================================================
    // MAIN PROFILE
    // =====================================================

    return (

        <div style={styles.page}>

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div style={styles.header}>

                <div>

                    <button
                        onClick={handleBack}
                        style={styles.backButton}
                    >
                        ← Dashboard
                    </button>

                    <h1 style={styles.title}>
                        Driver Profile
                    </h1>

                    <p style={styles.subtitle}>
                        Manage and view your SmartRide
                        driver information.
                    </p>

                </div>


                <button
                    onClick={() =>
                        loadDriverProfile(true)
                    }
                    disabled={refreshing}
                    style={{
                        ...styles.refreshButton,
                        opacity:
                            refreshing
                                ? 0.65
                                : 1
                    }}
                >
                    {refreshing
                        ? "⟳ Refreshing..."
                        : "↻ Refresh"}
                </button>

            </div>


            {/* ================================================= */}
            {/* HERO */}
            {/* ================================================= */}

            <div style={styles.heroCard}>

                <div style={styles.profileSection}>

                    <div style={styles.avatar}>
                        {initials}
                    </div>


                    <div style={styles.profileInfo}>

                        <h2 style={styles.driverName}>
                            {driver.name ||
                                "SmartRide Driver"}
                        </h2>


                        <p style={styles.email}>
                            {driver.email ||
                                "Email not available"}
                        </p>


                        <div style={styles.badges}>

                            <span
                                style={{
                                    ...styles.statusBadge,
                                    background:
                                        isOnline
                                            ? "rgba(34,197,94,.16)"
                                            : "rgba(248,113,113,.16)",
                                    color:
                                        isOnline
                                            ? "#bbf7d0"
                                            : "#fecaca"
                                }}
                            >

                                <span
                                    style={{
                                        ...styles.dot,
                                        background:
                                            isOnline
                                                ? "#22c55e"
                                                : "#ef4444"
                                    }}
                                />

                                {status}

                            </span>


                            <span
                                style={{
                                    ...styles.statusBadge,
                                    background:
                                        isVerified
                                            ? "rgba(34,197,94,.16)"
                                            : "rgba(251,191,36,.16)",
                                    color:
                                        isVerified
                                            ? "#bbf7d0"
                                            : "#fde68a"
                                }}
                            >

                                {isVerified
                                    ? "✓ VERIFIED"
                                    : `⚠ ${verification}`}

                            </span>

                        </div>

                    </div>

                </div>


                <div style={styles.heroLine} />


                <div style={styles.heroFooter}>

                    <span>
                        🚕 SmartRide Driver
                    </span>

                    <span>
                        {isVerified
                            ? "Ready to drive"
                            : "Verification required"}
                    </span>

                </div>

            </div>


            {/* ================================================= */}
            {/* STATS */}
            {/* ================================================= */}

            <div style={styles.statsGrid}>

                <div style={styles.statCard}>

                    <div
                        style={{
                            ...styles.statIcon,
                            background: "#fff7ed"
                        }}
                    >
                        ⭐
                    </div>

                    <div>

                        <p style={styles.statLabel}>
                            Your Rating
                        </p>

                        <h3 style={styles.statValue}>
                            {rating.toFixed(1)}
                        </h3>

                        <small style={styles.statHint}>
                            Out of 5
                        </small>

                    </div>

                </div>


                <div style={styles.statCard}>

                    <div
                        style={{
                            ...styles.statIcon,
                            background: "#eff6ff"
                        }}
                    >
                        🚕
                    </div>

                    <div>

                        <p style={styles.statLabel}>
                            Total Rides
                        </p>

                        <h3 style={styles.statValue}>
                            {totalRides}
                        </h3>

                        <small style={styles.statHint}>
                            Completed rides
                        </small>

                    </div>

                </div>


                <div style={styles.statCard}>

                    <div
                        style={{
                            ...styles.statIcon,
                            background:
                                isOnline
                                    ? "#ecfdf5"
                                    : "#fef2f2"
                        }}
                    >
                        {isOnline
                            ? "🟢"
                            : "🔴"}
                    </div>

                    <div>

                        <p style={styles.statLabel}>
                            Current Status
                        </p>

                        <h3
                            style={{
                                ...styles.statValue,
                                color:
                                    isOnline
                                        ? "#16a34a"
                                        : "#dc2626"
                            }}
                        >
                            {status}
                        </h3>

                        <small style={styles.statHint}>
                            Driver availability
                        </small>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* INFORMATION */}
            {/* ================================================= */}

            <div style={styles.contentGrid}>

                {/* ================================================= */}
                {/* PERSONAL INFORMATION */}
                {/* ================================================= */}

                <div style={styles.card}>

                    <div style={styles.cardHeader}>

                        <div style={styles.cardIcon}>
                            👤
                        </div>

                        <div>

                            <h2 style={styles.cardTitle}>
                                Personal Information
                            </h2>

                            <p style={styles.cardSubtitle}>
                                Your SmartRide account
                            </p>

                        </div>

                    </div>


                    <div style={styles.infoList}>

                        <InfoRow
                            icon="👤"
                            label="Full Name"
                            value={
                                driver.name ||
                                "Not Available"
                            }
                        />

                        <InfoRow
                            icon="📧"
                            label="Email"
                            value={
                                driver.email ||
                                "Not Available"
                            }
                        />

                        <InfoRow
                            icon="📱"
                            label="Phone"
                            value={
                                driver.phone ||
                                "Not Available"
                            }
                        />

                    </div>

                </div>


                {/* ================================================= */}
                {/* VEHICLE INFORMATION */}
                {/* ================================================= */}

                <div style={styles.card}>

                    <div style={styles.cardHeader}>

                        <div
                            style={{
                                ...styles.cardIcon,
                                background: "#eef2ff"
                            }}
                        >
                            🚗
                        </div>

                        <div>

                            <h2 style={styles.cardTitle}>
                                Vehicle Information
                            </h2>

                            <p style={styles.cardSubtitle}>
                                Your registered vehicle
                            </p>

                        </div>

                    </div>


                    <div style={styles.infoList}>

                        <InfoRow
                            icon="🪪"
                            label="License Number"
                            value={
                                driver.licenseNumber ||
                                "Not Available"
                            }
                        />

                        <InfoRow
                            icon="🔢"
                            label="Vehicle Number"
                            value={
                                driver.vehicleNumber ||
                                "Not Available"
                            }
                        />

                        <InfoRow
                            icon="🚘"
                            label="Vehicle Type"
                            value={
                                driver.vehicleType ||
                                "Not Available"
                            }
                        />

                    </div>


                    {/* ================================================= */}
                    {/* VERIFY DRIVER BUTTON */}
                    {/* ================================================= */}

                    {!isVerified && !showVerificationForm && (

                        <button
                            onClick={
                                openVerificationForm
                            }
                            style={
                                styles.verifyDriverButton
                            }
                        >
                            ✓ Verify Driver
                        </button>

                    )}


                    {/* ================================================= */}
                    {/* VERIFICATION FORM */}
                    {/* ================================================= */}

                    {showVerificationForm && (

                        <div style={styles.formContainer}>

                            <div style={styles.formHeader}>

                                <div>

                                    <h3 style={styles.formTitle}>
                                        Driver Verification
                                    </h3>

                                    <p style={styles.formSubtitle}>
                                        Enter your vehicle and
                                        license information.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        closeVerificationForm
                                    }
                                    style={
                                        styles.closeButton
                                    }
                                    disabled={
                                        verificationLoading
                                    }
                                >
                                    ✕
                                </button>

                            </div>


                            {/* ERROR */}

                            {verificationError && (

                                <div
                                    style={
                                        styles.formError
                                    }
                                >
                                    ⚠️
                                    <span>
                                        {verificationError}
                                    </span>
                                </div>

                            )}


                            {/* SUCCESS */}

                            {verificationSuccess && (

                                <div
                                    style={
                                        styles.formSuccess
                                    }
                                >
                                    ✓
                                    <span>
                                        {verificationSuccess}
                                    </span>
                                </div>

                            )}


                            <form
                                onSubmit={
                                    handleVerificationSubmit
                                }
                                style={
                                    styles.verificationForm
                                }
                            >

                                {/* LICENSE */}

                                <div>

                                    <label
                                        style={
                                            styles.formLabel
                                        }
                                    >
                                        Driving License Number
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            licenseNumber
                                        }
                                        onChange={(e) =>
                                            setLicenseNumber(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Example: MH1520230012345"
                                        disabled={
                                            verificationLoading
                                        }
                                        style={
                                            styles.formInput
                                        }
                                    />

                                </div>


                                {/* VEHICLE NUMBER */}

                                <div>

                                    <label
                                        style={
                                            styles.formLabel
                                        }
                                    >
                                        Vehicle Number
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            vehicleNumber
                                        }
                                        onChange={(e) =>
                                            setVehicleNumber(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Example: MH15AB1234"
                                        disabled={
                                            verificationLoading
                                        }
                                        style={
                                            styles.formInput
                                        }
                                    />

                                </div>


                                {/* VEHICLE TYPE */}

                                <div>

                                    <label
                                        style={
                                            styles.formLabel
                                        }
                                    >
                                        Vehicle Type
                                    </label>

                                    <select
                                        value={
                                            vehicleType
                                        }
                                        onChange={(e) =>
                                            setVehicleType(
                                                e.target.value
                                            )
                                        }
                                        disabled={
                                            verificationLoading
                                        }
                                        style={
                                            styles.formInput
                                        }
                                    >

                                        <option value="">
                                            Select vehicle type
                                        </option>

                                        <option value="BIKE">
                                            🏍️ Bike
                                        </option>

                                        <option value="AUTO">
                                            🛺 Auto
                                        </option>

                                        <option value="CAR">
                                            🚗 Car
                                        </option>

                                    </select>

                                </div>


                                {/* SUBMIT */}

                                <button
                                    type="submit"
                                    disabled={
                                        verificationLoading
                                    }
                                    style={
                                        styles.submitVerificationButton
                                    }
                                >

                                    {verificationLoading
                                        ? "⟳ Submitting..."
                                        : "✓ Submit for Verification"}

                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        closeVerificationForm
                                    }
                                    disabled={
                                        verificationLoading
                                    }
                                    style={
                                        styles.cancelButton
                                    }
                                >
                                    Cancel
                                </button>

                            </form>

                        </div>

                    )}

                </div>

            </div>


            {/* ================================================= */}
            {/* VERIFICATION STATUS */}
            {/* ================================================= */}

            <div
                style={{
                    ...styles.verificationCard,
                    border:
                        isVerified
                            ? "1px solid #bbf7d0"
                            : "1px solid #fed7aa",
                    background:
                        isVerified
                            ? "#f0fdf4"
                            : "#fffaf0"
                }}
            >

                <div
                    style={{
                        ...styles.verificationIcon,
                        background:
                            isVerified
                                ? "#dcfce7"
                                : "#ffedd5",
                        color:
                            isVerified
                                ? "#15803d"
                                : "#c2410c"
                    }}
                >
                    {isVerified
                        ? "✓"
                        : "!"}
                </div>


                <div style={styles.verificationText}>

                    <h3>
                        {isVerified
                            ? "Driver account verified"
                            : "Driver verification pending"}
                    </h3>

                    <p>
                        {isVerified
                            ? "You are approved to provide rides on SmartRide."
                            : "Your account is waiting for administrator verification."}
                    </p>

                </div>


                <span
                    style={{
                        ...styles.verificationBadge,
                        background:
                            isVerified
                                ? "#dcfce7"
                                : "#ffedd5",
                        color:
                            isVerified
                                ? "#15803d"
                                : "#c2410c"
                    }}
                >
                    {verification}
                </span>

            </div>


            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <div style={styles.footer}>

                <button
                    onClick={() =>
                        navigate(
                            "/driver/dashboard"
                        )
                    }
                    style={styles.secondaryButton}
                >
                    ← Dashboard
                </button>


                <button
                    onClick={() =>
                        loadDriverProfile(true)
                    }
                    disabled={refreshing}
                    style={styles.primaryButton}
                >
                    {refreshing
                        ? "⟳ Updating..."
                        : "↻ Refresh Profile"}
                </button>

            </div>

        </div>

    );

}


// =====================================================
// INFO ROW
// =====================================================

function InfoRow({
    icon,
    label,
    value
}) {

    return (

        <div style={styles.infoRow}>

            <div style={styles.infoIcon}>
                {icon}
            </div>

            <div style={styles.infoContent}>

                <span style={styles.infoLabel}>
                    {label}
                </span>

                <span style={styles.infoValue}>
                    {value}
                </span>

            </div>

        </div>

    );

}


// =====================================================
// STYLES
// =====================================================

const styles = {

    page: {
        minHeight: "100vh",
        background:
            "linear-gradient(135deg,#f8fafc 0%,#eef2ff 50%,#f8fafc 100%)",
        padding: "35px 25px",
        fontFamily:
            "Inter,Segoe UI,Arial,sans-serif",
        boxSizing: "border-box",
        color: "#0f172a"
    },


    header: {
        maxWidth: "1100px",
        margin: "0 auto 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: "20px"
    },


    backButton: {
        border: "none",
        background: "transparent",
        padding: "0",
        marginBottom: "10px",
        color: "#64748b",
        fontSize: "14px",
        fontWeight: "700",
        cursor: "pointer"
    },


    title: {
        margin: 0,
        fontSize: "36px",
        fontWeight: "900",
        letterSpacing: "-1px"
    },


    subtitle: {
        margin: "7px 0 0",
        color: "#64748b",
        fontSize: "15px"
    },


    refreshButton: {
        border: "1px solid #dbeafe",
        background: "white",
        color: "#2563eb",
        padding: "11px 18px",
        borderRadius: "10px",
        fontWeight: "800",
        cursor: "pointer",
        boxShadow:
            "0 5px 15px rgba(15,23,42,.06)"
    },


    heroCard: {
        maxWidth: "1100px",
        margin: "0 auto 20px",
        padding: "30px",
        borderRadius: "22px",
        color: "white",
        background:
            "linear-gradient(135deg,#0f172a,#1e3a8a 55%,#2563eb)",
        boxShadow:
            "0 20px 45px rgba(30,58,138,.22)"
    },


    profileSection: {
        display: "flex",
        alignItems: "center",
        gap: "22px"
    },


    avatar: {
        width: "88px",
        height: "88px",
        borderRadius: "24px",
        background:
            "linear-gradient(135deg,#60a5fa,#818cf8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "28px",
        fontWeight: "900",
        border:
            "3px solid rgba(255,255,255,.3)",
        flexShrink: 0
    },


    profileInfo: {
        flex: 1
    },


    driverName: {
        margin: 0,
        fontSize: "30px",
        fontWeight: "900"
    },


    email: {
        margin: "6px 0 15px",
        opacity: ".75",
        fontSize: "14px"
    },


    badges: {
        display: "flex",
        gap: "9px",
        flexWrap: "wrap"
    },


    statusBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        padding: "7px 12px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "900"
    },


    dot: {
        width: "7px",
        height: "7px",
        borderRadius: "50%"
    },


    heroLine: {
        height: "1px",
        background:
            "rgba(255,255,255,.12)",
        margin: "25px 0 15px"
    },


    heroFooter: {
        display: "flex",
        justifyContent: "space-between",
        color: "rgba(255,255,255,.65)",
        fontSize: "12px",
        fontWeight: "700"
    },


    statsGrid: {
        maxWidth: "1100px",
        margin: "0 auto 20px",
        display: "grid",
        gridTemplateColumns:
            "repeat(3,minmax(0,1fr))",
        gap: "18px"
    },


    statCard: {
        background: "rgba(255,255,255,.9)",
        border:
            "1px solid rgba(226,232,240,.8)",
        borderRadius: "17px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        boxShadow:
            "0 8px 25px rgba(15,23,42,.06)"
    },


    statIcon: {
        width: "52px",
        height: "52px",
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "23px",
        flexShrink: 0
    },


    statLabel: {
        margin: "0 0 4px",
        color: "#64748b",
        fontSize: "12px",
        fontWeight: "700"
    },


    statValue: {
        margin: 0,
        fontSize: "25px",
        fontWeight: "900"
    },


    statHint: {
        color: "#94a3b8",
        fontSize: "11px"
    },


    contentGrid: {
        maxWidth: "1100px",
        margin: "0 auto 20px",
        display: "grid",
        gridTemplateColumns:
            "repeat(2,minmax(0,1fr))",
        gap: "20px"
    },


    card: {
        background: "white",
        border:
            "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "25px",
        boxShadow:
            "0 8px 25px rgba(15,23,42,.06)"
    },


    cardHeader: {
        display: "flex",
        alignItems: "center",
        gap: "13px",
        marginBottom: "20px"
    },


    cardIcon: {
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        background: "#eff6ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px"
    },


    cardTitle: {
        margin: 0,
        fontSize: "18px",
        fontWeight: "850"
    },


    cardSubtitle: {
        margin: "4px 0 0",
        fontSize: "12px",
        color: "#94a3b8"
    },


    infoList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },


    infoRow: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px",
        borderRadius: "12px",
        background: "#f8fafc",
        border:
            "1px solid #f1f5f9"
    },


    infoIcon: {
        width: "35px",
        height: "35px",
        borderRadius: "9px",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
    },


    infoContent: {
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        minWidth: 0
    },


    infoLabel: {
        fontSize: "10px",
        color: "#94a3b8",
        fontWeight: "800",
        textTransform: "uppercase"
    },


    infoValue: {
        fontSize: "14px",
        color: "#334155",
        fontWeight: "750",
        wordBreak: "break-word"
    },


    // =====================================================
    // VERIFY DRIVER
    // =====================================================

    verifyDriverButton: {
        width: "100%",
        marginTop: "18px",
        border: "none",
        background:
            "linear-gradient(135deg,#2563eb,#4f46e5)",
        color: "white",
        padding: "13px",
        borderRadius: "11px",
        fontSize: "14px",
        fontWeight: "900",
        cursor: "pointer",
        boxShadow:
            "0 8px 20px rgba(37,99,235,.20)"
    },


    formContainer: {
        marginTop: "20px",
        padding: "20px",
        borderRadius: "16px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0"
    },


    formHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "18px"
    },


    formTitle: {
        margin: 0,
        fontSize: "18px",
        fontWeight: "900",
        color: "#0f172a"
    },


    formSubtitle: {
        margin: "5px 0 0",
        fontSize: "12px",
        color: "#64748b"
    },


    closeButton: {
        border: "none",
        background: "#e2e8f0",
        color: "#475569",
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "900"
    },


    verificationForm: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },


    formLabel: {
        display: "block",
        marginBottom: "7px",
        fontSize: "12px",
        fontWeight: "800",
        color: "#374151"
    },


    formInput: {
        width: "100%",
        height: "46px",
        border: "1px solid #cbd5e1",
        borderRadius: "10px",
        background: "white",
        padding: "0 13px",
        fontSize: "14px",
        color: "#111827",
        outline: "none",
        boxSizing: "border-box"
    },


    formError: {
        display: "flex",
        gap: "8px",
        padding: "11px 13px",
        marginBottom: "15px",
        borderRadius: "10px",
        background: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#b91c1c",
        fontSize: "12px",
        fontWeight: "700"
    },


    formSuccess: {
        display: "flex",
        gap: "8px",
        padding: "11px 13px",
        marginBottom: "15px",
        borderRadius: "10px",
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        color: "#15803d",
        fontSize: "12px",
        fontWeight: "700"
    },


    submitVerificationButton: {
        height: "48px",
        border: "none",
        borderRadius: "10px",
        background:
            "linear-gradient(135deg,#2563eb,#4f46e5)",
        color: "white",
        fontSize: "14px",
        fontWeight: "900",
        cursor: "pointer"
    },


    cancelButton: {
        height: "44px",
        border: "none",
        borderRadius: "10px",
        background: "#e2e8f0",
        color: "#475569",
        fontSize: "13px",
        fontWeight: "800",
        cursor: "pointer"
    },


    // =====================================================
    // VERIFICATION STATUS
    // =====================================================

    verificationCard: {
        maxWidth: "1100px",
        margin: "0 auto 20px",
        borderRadius: "16px",
        padding: "19px 23px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        boxShadow:
            "0 7px 22px rgba(15,23,42,.05)"
    },


    verificationIcon: {
        width: "45px",
        height: "45px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        fontWeight: "900",
        flexShrink: 0
    },


    verificationText: {
        flex: 1
    },


    verificationBadge: {
        padding: "7px 13px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "900"
    },


    footer: {
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px"
    },


    primaryButton: {
        border: "none",
        background:
            "linear-gradient(135deg,#2563eb,#4f46e5)",
        color: "white",
        padding: "12px 20px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "800",
        boxShadow:
            "0 7px 18px rgba(37,99,235,.2)"
    },


    secondaryButton: {
        border: "1px solid #dbe3ef",
        background: "white",
        color: "#475569",
        padding: "12px 20px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "800"
    },


    // =====================================================
    // NOT FOUND
    // =====================================================

    notFoundCard: {
        width: "100%",
        maxWidth: "650px",
        margin: "90px auto",
        background: "white",
        borderRadius: "24px",
        padding: "45px",
        textAlign: "center",
        boxShadow:
            "0 20px 50px rgba(15,23,42,.10)",
        border:
            "1px solid #e2e8f0",
        boxSizing: "border-box"
    },


    notFoundIcon: {
        width: "80px",
        height: "80px",
        margin: "0 auto 18px",
        borderRadius: "22px",
        background:
            "linear-gradient(135deg,#dbeafe,#e0e7ff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "38px"
    },


    notFoundTitle: {
        margin: "15px 0 10px",
        fontSize: "27px",
        fontWeight: "900",
        color: "#0f172a"
    },


    notFoundText: {
        color: "#64748b",
        lineHeight: 1.6,
        maxWidth: "500px",
        margin:
            "0 auto 25px"
    },


    registerButton: {
        width: "100%",
        border: "none",
        background:
            "linear-gradient(135deg,#2563eb,#4f46e5)",
        color: "white",
        padding: "15px",
        borderRadius: "11px",
        fontSize: "15px",
        fontWeight: "900",
        cursor: "pointer"
    },


    backButtonLarge: {
        width: "100%",
        border: "none",
        background: "#f1f5f9",
        color: "#475569",
        padding: "13px",
        borderRadius: "11px",
        fontSize: "14px",
        fontWeight: "800",
        cursor: "pointer",
        marginTop: "10px"
    },


    // =====================================================
    // ERROR
    // =====================================================

    errorCard: {
        maxWidth: "500px",
        margin: "110px auto",
        background: "white",
        borderRadius: "22px",
        padding: "40px",
        textAlign: "center",
        boxShadow:
            "0 15px 40px rgba(15,23,42,.09)"
    },


    errorIcon: {
        fontSize: "45px",
        marginBottom: "10px"
    },


    errorText: {
        color: "#64748b",
        marginBottom: "25px"
    },


    errorActions: {
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        flexWrap: "wrap"
    },


    // =====================================================
    // LOADING
    // =====================================================

    loadingCard: {
        maxWidth: "450px",
        margin: "120px auto",
        background: "white",
        borderRadius: "22px",
        padding: "45px",
        textAlign: "center",
        boxShadow:
            "0 15px 40px rgba(15,23,42,.08)"
    },


    loadingIcon: {
        fontSize: "50px",
        marginBottom: "15px"
    },


    muted: {
        color: "#64748b"
    }

};


export default DriverProfile;