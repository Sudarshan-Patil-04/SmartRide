import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    return (

        <div style={styles.page}>

            {/* ================================================= */}
            {/* NAVBAR */}
            {/* ================================================= */}

            <nav style={styles.navbar}>

                <div
                    style={styles.logo}
                    onClick={() => navigate("/")}
                >
                    <span style={styles.logoIcon}>
                        🚕
                    </span>

                    <span>
                        Smart<span style={styles.logoAccent}>Ride</span>
                    </span>
                </div>


                <div style={styles.navLinks}>

                    <a href="#features">
                        Features
                    </a>

                    <a href="#how-it-works">
                        How It Works
                    </a>

                    <a href="#about">
                        About
                    </a>

                </div>


                <div style={styles.navActions}>

                    <button
                        style={styles.navLogin}
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </button>


                    <button
                        style={styles.navRegister}
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Get Started
                    </button>

                </div>

            </nav>


            {/* ================================================= */}
            {/* HERO */}
            {/* ================================================= */}

            <section style={styles.hero}>

                <div style={styles.heroGlow1}></div>
                <div style={styles.heroGlow2}></div>


                <div style={styles.heroContent}>

                    {/* LEFT */}

                    <div style={styles.heroLeft}>

                        <div style={styles.badge}>
                            <span style={styles.badgeDot}>
                                ●
                            </span>

                            Smart & Reliable
                            Transportation
                        </div>


                        <h1 style={styles.heroTitle}>

                            Your Ride.
                            <br />

                            <span style={styles.gradientText}>
                                Your Way.
                            </span>

                        </h1>


                        <p style={styles.heroDescription}>

                            Book a ride in seconds, track your
                            driver live and enjoy a safe,
                            reliable journey with SmartRide.

                        </p>


                        <div style={styles.heroButtons}>

                            <button
                                style={styles.primaryButton}
                                onClick={() =>
                                    navigate("/register")
                                }
                            >
                                🚕 Book a Ride
                                <span style={styles.arrow}>
                                    →
                                </span>
                            </button>


                            <button
                                style={styles.secondaryButton}
                                onClick={() =>
                                    navigate("/login")
                                }
                            >
                                Login to SmartRide
                            </button>

                        </div>


                        {/* TRUST */}

                        <div style={styles.trustRow}>

                            <div style={styles.trustAvatars}>

                                <span>👨</span>
                                <span>👩</span>
                                <span>👨</span>
                                <span>👩</span>

                            </div>


                            <div>

                                <div style={styles.stars}>
                                    ★★★★★
                                </div>

                                <small style={styles.trustText}>
                                    Trusted by SmartRide users
                                </small>

                            </div>

                        </div>

                    </div>


                    {/* RIGHT VISUAL */}

                    <div style={styles.heroRight}>

                        <div style={styles.mapCard}>

                            <div style={styles.mapTop}>

                                <div>

                                    <span style={styles.smallLabel}>
                                        YOUR RIDE
                                    </span>

                                    <h3 style={styles.mapTitle}>
                                        Driver is on the way
                                    </h3>

                                </div>


                                <span style={styles.liveBadge}>
                                    ● LIVE
                                </span>

                            </div>


                            {/* Fake map */}

                            <div style={styles.map}>

                                <div style={styles.mapRoad1}></div>
                                <div style={styles.mapRoad2}></div>
                                <div style={styles.mapRoad3}></div>


                                <div style={styles.mapPinPickup}>
                                    📍
                                </div>


                                <div style={styles.mapCar}>
                                    🚕
                                </div>


                                <div style={styles.mapPinDestination}>
                                    🏁
                                </div>


                                <div style={styles.routeLine}></div>

                            </div>


                            <div style={styles.driverCard}>

                                <div style={styles.driverAvatar}>
                                    👨‍✈️
                                </div>


                                <div style={styles.driverDetails}>

                                    <strong>
                                        Your Driver
                                    </strong>

                                    <span>
                                        ⭐ 5.0 • Verified Driver
                                    </span>

                                </div>


                                <div style={styles.eta}>

                                    <strong>
                                        4 min
                                    </strong>

                                    <span>
                                        ETA
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* Floating card */}

                        <div style={styles.floatingCard}>

                            <span style={styles.floatingIcon}>
                                🛡️
                            </span>

                            <div>

                                <strong>
                                    Safe & Verified
                                </strong>

                                <small>
                                    Every driver is verified
                                </small>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================================================= */}
            {/* STATS */}
            {/* ================================================= */}

            <section style={styles.statsSection}>

                <div style={styles.statsContainer}>

                    <Stat
                        number="24/7"
                        label="Ride Availability"
                    />

                    <Stat
                        number="100%"
                        label="Verified Drivers"
                    />

                    <Stat
                        number="Live"
                        label="GPS Tracking"
                    />

                    <Stat
                        number="5.0"
                        label="Driver Rating"
                    />

                </div>

            </section>


            {/* ================================================= */}
            {/* FEATURES */}
            {/* ================================================= */}

            <section
                id="features"
                style={styles.section}
            >

                <div style={styles.sectionHeader}>

                    <span style={styles.sectionBadge}>
                        FEATURES
                    </span>

                    <h2 style={styles.sectionTitle}>
                        Everything you need
                        <br />
                        for a better ride
                    </h2>

                    <p style={styles.sectionDescription}>
                        SmartRide brings booking, tracking,
                        payments and driver management
                        together in one simple platform.
                    </p>

                </div>


                <div style={styles.featuresGrid}>

                    <Feature
                        icon="🚕"
                        title="Easy Ride Booking"
                        description="Find and book your ride quickly with a simple and intuitive booking experience."
                    />


                    <Feature
                        icon="📍"
                        title="Live Driver Tracking"
                        description="Track your driver's real-time location and know exactly when they will arrive."
                    />


                    <Feature
                        icon="💳"
                        title="Secure Payments"
                        description="Enjoy a smooth and secure payment experience for every completed ride."
                    />


                    <Feature
                        icon="⭐"
                        title="Driver Ratings"
                        description="Rate your ride experience and help maintain a trusted driver community."
                    />


                    <Feature
                        icon="🚗"
                        title="Driver Partner System"
                        description="Drivers can manage availability, rides and live GPS location from their dashboard."
                    />


                    <Feature
                        icon="🛡️"
                        title="Verified Drivers"
                        description="Driver verification helps create a safer and more reliable transportation network."
                    />

                </div>

            </section>


            {/* ================================================= */}
            {/* HOW IT WORKS */}
            {/* ================================================= */}

            <section
                id="how-it-works"
                style={styles.howSection}
            >

                <div style={styles.sectionHeader}>

                    <span style={styles.sectionBadge}>
                        HOW IT WORKS
                    </span>

                    <h2 style={styles.sectionTitle}>
                        Ride in three simple steps
                    </h2>

                    <p style={styles.sectionDescription}>
                        No complicated process. Humanity has
                        suffered enough from unnecessary forms.
                    </p>

                </div>


                <div style={styles.steps}>

                    <Step
                        number="01"
                        icon="👤"
                        title="Create an Account"
                        description="Register as a customer and set up your SmartRide account."
                    />


                    <div style={styles.stepConnector}></div>


                    <Step
                        number="02"
                        icon="📍"
                        title="Book Your Ride"
                        description="Choose your pickup and destination, then request your ride."
                    />


                    <div style={styles.stepConnector}></div>


                    <Step
                        number="03"
                        icon="🚕"
                        title="Enjoy Your Ride"
                        description="Track your driver live and reach your destination safely."
                    />

                </div>

            </section>


            {/* ================================================= */}
            {/* CUSTOMER / DRIVER */}
            {/* ================================================= */}

            <section
                id="about"
                style={styles.splitSection}
            >

                {/* CUSTOMER */}

                <div style={styles.splitCard}>

                    <div style={styles.splitIcon}>
                        👤
                    </div>

                    <span style={styles.sectionBadge}>
                        FOR CUSTOMERS
                    </span>

                    <h2 style={styles.splitTitle}>
                        Your journey,
                        <br />
                        made simple.
                    </h2>

                    <p style={styles.splitDescription}>
                        Book rides, follow your driver's location,
                        manage your trips and enjoy a seamless
                        transportation experience.
                    </p>


                    <button
                        style={styles.darkButton}
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Start Riding →
                    </button>

                </div>


                {/* DRIVER */}

                <div style={styles.splitCardDark}>

                    <div style={styles.splitIconDark}>
                        🚗
                    </div>

                    <span style={styles.driverBadge}>
                        FOR DRIVERS
                    </span>

                    <h2 style={styles.splitTitleDark}>
                        Drive smarter.
                        <br />
                        Earn better.
                    </h2>

                    <p style={styles.splitDescriptionDark}>
                        Manage your availability, accept rides,
                        share your live location and manage your
                        driver profile from one dashboard.
                    </p>


                    <button
                        style={styles.lightButton}
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Become a Driver →
                    </button>

                </div>

            </section>


            {/* ================================================= */}
            {/* CTA */}
            {/* ================================================= */}

            <section style={styles.ctaSection}>

                <div style={styles.ctaGlow}></div>


                <div style={styles.ctaContent}>

                    <div style={styles.ctaIcon}>
                        🚕
                    </div>


                    <h2 style={styles.ctaTitle}>
                        Ready to ride?
                    </h2>


                    <p style={styles.ctaText}>
                        Your next journey is just a few clicks away.
                    </p>


                    <button
                        style={styles.ctaButton}
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Create Your Account
                        <span>
                            →
                        </span>
                    </button>

                </div>

            </section>


            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <footer style={styles.footer}>

                <div style={styles.footerTop}>

                    <div>

                        <div style={styles.footerLogo}>
                            🚕 SmartRide
                        </div>

                        <p style={styles.footerDescription}>
                            Smart transportation for
                            smarter journeys.
                        </p>

                    </div>


                    <div style={styles.footerLinks}>

                        <div>

                            <strong>
                                Platform
                            </strong>

                            <span>
                                Ride Booking
                            </span>

                            <span>
                                Live Tracking
                            </span>

                            <span>
                                Driver System
                            </span>

                        </div>


                        <div>

                            <strong>
                                Account
                            </strong>

                            <span
                                onClick={() =>
                                    navigate("/login")
                                }
                                style={styles.clickable}
                            >
                                Login
                            </span>

                            <span
                                onClick={() =>
                                    navigate("/register")
                                }
                                style={styles.clickable}
                            >
                                Register
                            </span>

                        </div>

                    </div>

                </div>


                <div style={styles.footerBottom}>

                    <span>
                        © 2026 SmartRide
                    </span>

                    <span>
                        Built for smarter mobility 🚕
                    </span>

                </div>

            </footer>

        </div>

    );
}


/* ========================================================= */
/* STAT */
/* ========================================================= */

function Stat({
    number,
    label
}) {

    return (

        <div style={styles.stat}>

            <strong>
                {number}
            </strong>

            <span>
                {label}
            </span>

        </div>

    );

}


/* ========================================================= */
/* FEATURE */
/* ========================================================= */

function Feature({
    icon,
    title,
    description
}) {

    return (

        <div
            style={styles.featureCard}
            onMouseEnter={(e) => {

                e.currentTarget.style.transform =
                    "translateY(-6px)";

                e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(15,23,42,0.10)";

            }}
            onMouseLeave={(e) => {

                e.currentTarget.style.transform =
                    "translateY(0)";

                e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(15,23,42,0.05)";

            }}
        >

            <div style={styles.featureIcon}>
                {icon}
            </div>


            <h3 style={styles.featureTitle}>
                {title}
            </h3>


            <p style={styles.featureDescription}>
                {description}
            </p>


            <span style={styles.featureArrow}>
                →
            </span>

        </div>

    );

}


/* ========================================================= */
/* STEP */
/* ========================================================= */

function Step({
    number,
    icon,
    title,
    description
}) {

    return (

        <div style={styles.step}>

            <div style={styles.stepTop}>

                <span style={styles.stepNumber}>
                    {number}
                </span>

                <div style={styles.stepIcon}>
                    {icon}
                </div>

            </div>


            <h3 style={styles.stepTitle}>
                {title}
            </h3>


            <p style={styles.stepDescription}>
                {description}
            </p>

        </div>

    );

}


/* ========================================================= */
/* STYLES */
/* ========================================================= */

const styles = {

    page: {
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
        fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflowX: "hidden"
    },


    /* ================= NAVBAR ================= */

    navbar: {
        height: "76px",
        padding: "0 7%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.95)",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 100
    },


    logo: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "22px",
        fontWeight: "800",
        cursor: "pointer"
    },


    logoIcon: {
        fontSize: "28px"
    },


    logoAccent: {
        color: "#2563eb"
    },


    navLinks: {
        display: "flex",
        gap: "35px",
        alignItems: "center"
    },


    navLink: {
        color: "#475569"
    },


    navActions: {
        display: "flex",
        gap: "10px"
    },


    navLogin: {
        border: "none",
        background: "transparent",
        padding: "10px 18px",
        fontWeight: "600",
        cursor: "pointer",
        color: "#334155"
    },


    navRegister: {
        border: "none",
        background: "#2563eb",
        color: "white",
        padding: "11px 20px",
        borderRadius: "8px",
        fontWeight: "700",
        cursor: "pointer",
        boxShadow: "0 5px 15px rgba(37,99,235,0.25)"
    },


    /* ================= HERO ================= */

    hero: {
        position: "relative",
        minHeight: "650px",
        background:
            "linear-gradient(135deg,#eff6ff 0%,#ffffff 48%,#eef2ff 100%)",
        overflow: "hidden"
    },


    heroGlow1: {
        position: "absolute",
        width: "450px",
        height: "450px",
        borderRadius: "50%",
        background: "rgba(37,99,235,0.08)",
        filter: "blur(70px)",
        top: "-150px",
        right: "5%"
    },


    heroGlow2: {
        position: "absolute",
        width: "350px",
        height: "350px",
        borderRadius: "50%",
        background: "rgba(124,58,237,0.07)",
        filter: "blur(70px)",
        bottom: "-150px",
        left: "15%"
    },


    heroContent: {
        position: "relative",
        zIndex: 2,
        maxWidth: "1200px",
        margin: "auto",
        padding: "90px 25px",
        display: "grid",
        gridTemplateColumns:
            "1fr 1fr",
        gap: "70px",
        alignItems: "center"
    },


    heroLeft: {
        maxWidth: "600px"
    },


    badge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 13px",
        borderRadius: "30px",
        background: "#dbeafe",
        color: "#1d4ed8",
        fontSize: "13px",
        fontWeight: "700"
    },


    badgeDot: {
        fontSize: "9px"
    },


    heroTitle: {
        fontSize: "clamp(48px,6vw,76px)",
        lineHeight: "1.02",
        letterSpacing: "-3px",
        margin: "25px 0 20px",
        fontWeight: "850"
    },


    gradientText: {
        background:
            "linear-gradient(90deg,#2563eb,#7c3aed)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },


    heroDescription: {
        fontSize: "18px",
        lineHeight: "1.7",
        color: "#64748b",
        maxWidth: "550px"
    },


    heroButtons: {
        display: "flex",
        gap: "14px",
        marginTop: "30px",
        flexWrap: "wrap"
    },


    primaryButton: {
        border: "none",
        background: "#2563eb",
        color: "white",
        padding: "15px 23px",
        borderRadius: "9px",
        fontSize: "15px",
        fontWeight: "700",
        cursor: "pointer",
        boxShadow:
            "0 10px 25px rgba(37,99,235,0.25)"
    },


    arrow: {
        marginLeft: "10px",
        fontSize: "18px"
    },


    secondaryButton: {
        border: "1px solid #cbd5e1",
        background: "white",
        color: "#334155",
        padding: "15px 23px",
        borderRadius: "9px",
        fontSize: "15px",
        fontWeight: "700",
        cursor: "pointer"
    },


    trustRow: {
        marginTop: "35px",
        display: "flex",
        alignItems: "center",
        gap: "13px"
    },


    trustAvatars: {
        display: "flex"
    },


    trustText: {
        color: "#64748b"
    },


    stars: {
        color: "#f59e0b",
        letterSpacing: "2px"
    },


    /* ================= HERO MAP ================= */

    heroRight: {
        position: "relative"
    },


    mapCard: {
        background: "white",
        borderRadius: "22px",
        padding: "18px",
        boxShadow:
            "0 30px 70px rgba(15,23,42,0.15)",
        border: "1px solid #e2e8f0"
    },


    mapTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 5px 15px"
    },


    smallLabel: {
        color: "#94a3b8",
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "1px"
    },


    mapTitle: {
        margin: "4px 0 0",
        fontSize: "17px"
    },


    liveBadge: {
        color: "#15803d",
        background: "#dcfce7",
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "10px",
        fontWeight: "800"
    },


    map: {
        height: "310px",
        borderRadius: "15px",
        background:
            "linear-gradient(135deg,#e0f2fe,#dbeafe,#ede9fe)",
        position: "relative",
        overflow: "hidden"
    },


    mapRoad1: {
        position: "absolute",
        width: "140%",
        height: "55px",
        background: "rgba(255,255,255,0.8)",
        transform: "rotate(-25deg)",
        top: "120px",
        left: "-100px"
    },


    mapRoad2: {
        position: "absolute",
        width: "120%",
        height: "40px",
        background: "rgba(255,255,255,0.75)",
        transform: "rotate(35deg)",
        top: "190px",
        left: "-50px"
    },


    mapRoad3: {
        position: "absolute",
        width: "100%",
        height: "35px",
        background: "rgba(255,255,255,0.7)",
        transform: "rotate(-65deg)",
        top: "50px",
        left: "50px"
    },


    mapPinPickup: {
        position: "absolute",
        left: "18%",
        top: "70%",
        fontSize: "30px",
        zIndex: 3
    },


    mapCar: {
        position: "absolute",
        left: "48%",
        top: "42%",
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        background: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "25px",
        border: "4px solid white",
        boxShadow:
            "0 5px 15px rgba(37,99,235,0.4)",
        zIndex: 5
    },


    mapPinDestination: {
        position: "absolute",
        right: "15%",
        top: "20%",
        fontSize: "30px",
        zIndex: 3
    },


    routeLine: {
        position: "absolute",
        width: "230px",
        height: "4px",
        background: "#2563eb",
        left: "24%",
        top: "53%",
        transform: "rotate(-25deg)",
        borderRadius: "10px",
        opacity: 0.8
    },


    driverCard: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginTop: "15px",
        padding: "10px"
    },


    driverAvatar: {
        width: "45px",
        height: "45px",
        borderRadius: "50%",
        background: "#eff6ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "23px"
    },


    driverDetails: {
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        flex: 1
    },


    driverDetailsSpan: {
        color: "#64748b",
        fontSize: "12px"
    },


    eta: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end"
    },


    floatingCard: {
        position: "absolute",
        right: "-25px",
        bottom: "-25px",
        background: "white",
        padding: "14px 18px",
        borderRadius: "13px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow:
            "0 15px 35px rgba(15,23,42,0.15)"
    },


    floatingIcon: {
        fontSize: "25px"
    },


    /* ================= STATS ================= */

    statsSection: {
        background: "#0f172a",
        color: "white"
    },


    statsContainer: {
        maxWidth: "1100px",
        margin: "auto",
        padding: "35px 25px",
        display: "grid",
        gridTemplateColumns:
            "repeat(4,1fr)"
    },


    stat: {
        textAlign: "center",
        borderRight: "1px solid #334155",
        display: "flex",
        flexDirection: "column",
        gap: "5px"
    },


    /* ================= SECTIONS ================= */

    section: {
        maxWidth: "1200px",
        margin: "auto",
        padding: "100px 25px"
    },


    sectionHeader: {
        textAlign: "center",
        maxWidth: "700px",
        margin: "auto"
    },


    sectionBadge: {
        color: "#2563eb",
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "2px"
    },


    sectionTitle: {
        fontSize: "44px",
        lineHeight: "1.15",
        letterSpacing: "-1.5px",
        margin: "15px 0"
    },


    sectionDescription: {
        color: "#64748b",
        lineHeight: "1.7",
        fontSize: "16px"
    },


    /* ================= FEATURES ================= */

    featuresGrid: {
        marginTop: "55px",
        display: "grid",
        gridTemplateColumns:
            "repeat(3,1fr)",
        gap: "20px"
    },


    featureCard: {
        position: "relative",
        padding: "30px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        background: "white",
        boxShadow:
            "0 8px 25px rgba(15,23,42,0.05)",
        transition:
            "transform 0.25s ease, box-shadow 0.25s ease",
        cursor: "default"
    },


    featureIcon: {
        width: "55px",
        height: "55px",
        borderRadius: "13px",
        background: "#eff6ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "28px"
    },


    featureTitle: {
        fontSize: "19px",
        margin: "20px 0 10px"
    },


    featureDescription: {
        color: "#64748b",
        lineHeight: "1.65",
        fontSize: "14px"
    },


    featureArrow: {
        position: "absolute",
        right: "25px",
        bottom: "25px",
        color: "#2563eb",
        fontSize: "20px"
    },


    /* ================= HOW IT WORKS ================= */

    howSection: {
        background: "#f8fafc",
        padding: "100px 7%"
    },


    steps: {
        maxWidth: "1100px",
        margin: "60px auto 0",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center"
    },


    step: {
        maxWidth: "280px",
        textAlign: "center"
    },


    stepTop: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },


    stepNumber: {
        fontSize: "12px",
        color: "#2563eb",
        fontWeight: "800",
        marginBottom: "10px"
    },


    stepIcon: {
        width: "75px",
        height: "75px",
        borderRadius: "50%",
        background: "white",
        border: "1px solid #dbeafe",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px",
        boxShadow:
            "0 10px 25px rgba(15,23,42,0.08)"
    },


    stepTitle: {
        marginTop: "20px",
        fontSize: "18px"
    },


    stepDescription: {
        color: "#64748b",
        lineHeight: "1.6",
        fontSize: "14px"
    },


    stepConnector: {
        width: "100px",
        height: "2px",
        background: "#bfdbfe",
        marginTop: "120px"
    },


    /* ================= SPLIT ================= */

    splitSection: {
        maxWidth: "1200px",
        margin: "auto",
        padding: "100px 25px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "25px"
    },


    splitCard: {
        padding: "55px",
        borderRadius: "20px",
        background: "#eff6ff",
        minHeight: "400px"
    },


    splitCardDark: {
        padding: "55px",
        borderRadius: "20px",
        background: "#0f172a",
        color: "white",
        minHeight: "400px"
    },


    splitIcon: {
        fontSize: "35px",
        marginBottom: "25px"
    },


    splitIconDark: {
        fontSize: "35px",
        marginBottom: "25px"
    },


    driverBadge: {
        color: "#60a5fa",
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "2px"
    },


    splitTitle: {
        fontSize: "38px",
        lineHeight: "1.15",
        letterSpacing: "-1px"
    },


    splitTitleDark: {
        fontSize: "38px",
        lineHeight: "1.15",
        letterSpacing: "-1px"
    },


    splitDescription: {
        color: "#64748b",
        lineHeight: "1.7",
        maxWidth: "450px"
    },


    splitDescriptionDark: {
        color: "#94a3b8",
        lineHeight: "1.7",
        maxWidth: "450px"
    },


    darkButton: {
        marginTop: "25px",
        background: "#0f172a",
        color: "white",
        border: "none",
        padding: "13px 20px",
        borderRadius: "8px",
        fontWeight: "700",
        cursor: "pointer"
    },


    lightButton: {
        marginTop: "25px",
        background: "white",
        color: "#0f172a",
        border: "none",
        padding: "13px 20px",
        borderRadius: "8px",
        fontWeight: "700",
        cursor: "pointer"
    },


    /* ================= CTA ================= */

    ctaSection: {
        position: "relative",
        overflow: "hidden",
        background:
            "linear-gradient(135deg,#1d4ed8,#4f46e5)",
        padding: "100px 25px",
        color: "white",
        textAlign: "center"
    },


    ctaGlow: {
        position: "absolute",
        width: "400px",
        height: "400px",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "50%",
        filter: "blur(30px)",
        top: "-200px",
        right: "-100px"
    },


    ctaContent: {
        position: "relative",
        zIndex: 2
    },


    ctaIcon: {
        fontSize: "45px"
    },


    ctaTitle: {
        fontSize: "48px",
        margin: "15px 0"
    },


    ctaText: {
        color: "#dbeafe",
        fontSize: "17px"
    },


    ctaButton: {
        marginTop: "25px",
        border: "none",
        background: "white",
        color: "#1d4ed8",
        padding: "15px 25px",
        borderRadius: "9px",
        fontWeight: "800",
        cursor: "pointer",
        fontSize: "15px"
    },


    /* ================= FOOTER ================= */

    footer: {
        background: "#020617",
        color: "white",
        padding: "60px 7% 25px"
    },


    footerTop: {
        display: "flex",
        justifyContent: "space-between",
        maxWidth: "1100px",
        margin: "auto"
    },


    footerLogo: {
        fontSize: "22px",
        fontWeight: "800"
    },


    footerDescription: {
        color: "#64748b",
        maxWidth: "250px",
        lineHeight: "1.6"
    },


    footerLinks: {
        display: "flex",
        gap: "100px"
    },


    footerLinkColumn: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },


    clickable: {
        cursor: "pointer"
    },


    footerBottom: {
        maxWidth: "1100px",
        margin: "45px auto 0",
        paddingTop: "20px",
        borderTop: "1px solid #1e293b",
        display: "flex",
        justifyContent: "space-between",
        color: "#64748b",
        fontSize: "13px"
    }

};


export default Home;