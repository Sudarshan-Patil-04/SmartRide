import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {

        setForm({
            ...form,
            [event.target.name]: event.target.value
        });

    };

    const handleLogin = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            const result = await loginUser(form);

            console.log("Login response:", result);

            if (!result?.token) {
                throw new Error(
                    "Login successful but token was not received"
                );
            }

            if (!result?.role) {
                throw new Error(
                    "Login successful but user role was not received"
                );
            }

            localStorage.setItem(
                "token",
                result.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(result)
            );

            localStorage.setItem(
                "role",
                result.role
            );

            if (result.userId) {

                localStorage.setItem(
                    "userId",
                    result.userId
                );

            }

            switch (result.role) {

                case "CUSTOMER":

                    navigate(
                        "/customer/dashboard",
                        { replace: true }
                    );

                    break;

                case "DRIVER":

                    navigate(
                        "/driver/dashboard",
                        { replace: true }
                    );

                    break;

                case "ADMIN":

                    navigate(
                        "/admin/dashboard",
                        { replace: true }
                    );

                    break;

                default:

                    throw new Error(
                        "Unknown user role: " +
                        result.role
                    );
            }

        }
        catch (err) {

            console.error(
                "Login error:",
                err
            );

            setError(
                err.message ||
                "Login failed. Please check your credentials."
            );

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <div style={styles.page}>

            {/* LEFT BRAND SECTION */}

            <div style={styles.brandSection}>

                <div style={styles.brandContent}>

                    <div style={styles.logoCircle}>
                        🚗
                    </div>

                    <h1 style={styles.brandTitle}>
                        SmartRide
                    </h1>

                    <p style={styles.brandSubtitle}>
                        Smart rides. Better journeys.
                    </p>

                    <div style={styles.featureBox}>

                        <Feature
                            icon="📍"
                            title="Live Tracking"
                            text="Track your ride in real time"
                        />

                        <Feature
                            icon="⚡"
                            title="Fast Booking"
                            text="Book your ride in seconds"
                        />

                        <Feature
                            icon="🛡️"
                            title="Safe & Secure"
                            text="Your journey, our responsibility"
                        />

                    </div>

                </div>

            </div>


            {/* LOGIN SECTION */}

            <div style={styles.formSection}>

                <div style={styles.formCard}>

                    <div style={styles.mobileLogo}>
                        🚗 SmartRide
                    </div>

                    <span style={styles.welcome}>
                        WELCOME BACK
                    </span>

                    <h2 style={styles.title}>
                        Sign in to your account
                    </h2>

                    <p style={styles.subtitle}>
                        Continue your journey with SmartRide.
                    </p>


                    {error && (

                        <div style={styles.error}>
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>

                    )}


                    <form onSubmit={handleLogin}>


                        {/* EMAIL */}

                        <div style={styles.inputGroup}>

                            <label style={styles.label}>
                                Email Address
                            </label>

                            <div style={styles.inputWrapper}>

                                <span style={styles.inputIcon}>
                                    ✉️
                                </span>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    style={styles.input}
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div style={styles.inputGroup}>

                            <label style={styles.label}>
                                Password
                            </label>

                            <div style={styles.inputWrapper}>

                                <span style={styles.inputIcon}>
                                    🔒
                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                    style={styles.input}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    style={styles.eyeButton}
                                >
                                    {showPassword
                                        ? "🙈"
                                        : "👁️"
                                    }
                                </button>

                            </div>

                        </div>


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.loginButton,
                                opacity:
                                    loading ? 0.7 : 1
                            }}
                        >

                            {loading ? (

                                <>
                                    <span style={styles.spinner}>
                                        ⟳
                                    </span>

                                    Signing in...
                                </>

                            ) : (

                                <>
                                    Sign In
                                    <span>
                                        →
                                    </span>
                                </>

                            )}

                        </button>

                    </form>


                    {/* REGISTER */}

                    <div style={styles.registerArea}>

                        <span>
                            Don't have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/register")
                            }
                            style={styles.registerButton}
                        >
                            Create Account
                        </button>

                    </div>


                    <div style={styles.footer}>
                        © 2026 SmartRide
                    </div>

                </div>

            </div>

        </div>

    );
}


/* ==========================================
   FEATURE
========================================== */

function Feature({
    icon,
    title,
    text
}) {

    return (

        <div style={styles.feature}>

            <div style={styles.featureIcon}>
                {icon}
            </div>

            <div>

                <strong>
                    {title}
                </strong>

                <p>
                    {text}
                </p>

            </div>

        </div>

    );

}


/* ==========================================
   STYLES
========================================== */

const styles = {

    page: {
        minHeight: "100vh",
        display: "flex",
        background: "#f8fafc",
        fontFamily:
            "Inter, Arial, sans-serif"
    },

    brandSection: {
        width: "48%",
        minHeight: "100vh",
        background:
            "linear-gradient(135deg,#111827,#1e3a8a,#2563eb)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        boxSizing: "border-box"
    },

    brandContent: {
        width: "100%",
        maxWidth: "500px"
    },

    logoCircle: {
        width: "75px",
        height: "75px",
        borderRadius: "22px",
        background: "rgba(255,255,255,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "38px",
        marginBottom: "25px",
        border:
            "1px solid rgba(255,255,255,0.2)"
    },

    brandTitle: {
        fontSize: "52px",
        margin: "0 0 10px",
        fontWeight: "800"
    },

    brandSubtitle: {
        fontSize: "20px",
        opacity: 0.85,
        marginBottom: "45px"
    },

    featureBox: {
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },

    feature: {
        display: "flex",
        alignItems: "center",
        gap: "16px"
    },

    featureIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "14px",
        background:
            "rgba(255,255,255,0.13)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px"
    },

    feature: {
        display: "flex",
        alignItems: "center",
        gap: "16px"
    },

    featureIcon: {
        minWidth: "48px",
        height: "48px",
        borderRadius: "14px",
        background:
            "rgba(255,255,255,0.13)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px"
    },

    formSection: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px"
    },

    formCard: {
        width: "100%",
        maxWidth: "440px"
    },

    mobileLogo: {
        display: "none",
        fontSize: "24px",
        fontWeight: "800",
        marginBottom: "35px"
    },

    welcome: {
        color: "#2563eb",
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "2px"
    },

    title: {
        fontSize: "34px",
        margin: "10px 0",
        color: "#111827"
    },

    subtitle: {
        color: "#6b7280",
        marginBottom: "30px"
    },

    error: {
        display: "flex",
        gap: "10px",
        padding: "13px 15px",
        background: "#fef2f2",
        color: "#b91c1c",
        border:
            "1px solid #fecaca",
        borderRadius: "10px",
        marginBottom: "20px",
        fontSize: "14px"
    },

    inputGroup: {
        marginBottom: "20px"
    },

    label: {
        display: "block",
        marginBottom: "8px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#374151"
    },

    inputWrapper: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #d1d5db",
        borderRadius: "10px",
        background: "white",
        transition: "0.2s"
    },

    inputIcon: {
        paddingLeft: "14px",
        fontSize: "16px"
    },

    input: {
        flex: 1,
        border: "none",
        outline: "none",
        padding: "13px 12px",
        fontSize: "15px",
        background: "transparent",
        minWidth: 0
    },

    eyeButton: {
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: "10px 14px",
        fontSize: "16px"
    },

    loginButton: {
        width: "100%",
        border: "none",
        borderRadius: "10px",
        padding: "14px",
        background:
            "linear-gradient(135deg,#2563eb,#1d4ed8)",
        color: "white",
        fontSize: "16px",
        fontWeight: "700",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        boxShadow:
            "0 8px 20px rgba(37,99,235,0.25)"
    },

    spinner: {
        fontSize: "20px"
    },

    registerArea: {
        marginTop: "28px",
        textAlign: "center",
        color: "#6b7280",
        fontSize: "14px"
    },

    registerButton: {
        border: "none",
        background: "transparent",
        color: "#2563eb",
        fontWeight: "700",
        cursor: "pointer",
        marginLeft: "5px"
    },

    footer: {
        textAlign: "center",
        marginTop: "45px",
        color: "#9ca3af",
        fontSize: "12px"
    }

};

export default Login;