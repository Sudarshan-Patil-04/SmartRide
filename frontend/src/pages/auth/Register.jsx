import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "CUSTOMER"
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {

        setForm({
            ...form,
            [event.target.name]:
                event.target.value
        });

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            console.log(
                "Register Data:",
                form
            );

            const result =
                await registerUser(form);

            console.log(
                "Register Response:",
                result
            );

            if (!result?.token) {

                throw new Error(
                    "Registration successful but token was not received."
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

            if (result.userId) {

                localStorage.setItem(
                    "userId",
                    result.userId
                );

            }

            if (result.role) {

                localStorage.setItem(
                    "role",
                    result.role
                );

            }


            switch (result.role) {

                case "CUSTOMER":

                    navigate(
                        "/customer/dashboard",
                        {
                            replace: true
                        }
                    );

                    break;


                case "DRIVER":

                    navigate(
                        "/driver/dashboard",
                        {
                            replace: true
                        }
                    );

                    break;


                case "ADMIN":

                    navigate(
                        "/admin/dashboard",
                        {
                            replace: true
                        }
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
                "Registration error:",
                err
            );

            setError(
                err.message ||
                "Registration failed."
            );

        }
        finally {

            setLoading(false);

        }

    };


    return (

        <div style={styles.page}>


            {/* LEFT SIDE */}

            <div style={styles.brandSection}>

                <div style={styles.brandContent}>

                    <div style={styles.logoCircle}>
                        🚗
                    </div>

                    <h1 style={styles.brandTitle}>
                        Join SmartRide
                    </h1>

                    <p style={styles.brandSubtitle}>
                        Your smarter way to move.
                    </p>


                    <div style={styles.masteryCard}>

                        <div style={styles.masteryTitle}>
                            🏆 SMART RIDE EXPERIENCE
                        </div>

                        <div style={styles.masteryItem}>
                            <span>
                                📍 Live Ride Tracking
                            </span>

                            <strong>
                                ✓
                            </strong>
                        </div>

                        <div style={styles.masteryItem}>
                            <span>
                                🚕 Easy Ride Booking
                            </span>

                            <strong>
                                ✓
                            </strong>
                        </div>

                        <div style={styles.masteryItem}>
                            <span>
                                ⭐ Driver Ratings
                            </span>

                            <strong>
                                ✓
                            </strong>
                        </div>

                        <div style={styles.masteryItem}>
                            <span>
                                🛡️ Secure Platform
                            </span>

                            <strong>
                                ✓
                            </strong>
                        </div>

                    </div>

                </div>

            </div>


            {/* FORM */}

            <div style={styles.formSection}>

                <div style={styles.formCard}>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                        style={styles.backButton}
                    >
                        ← Back to Login
                    </button>


                    <span style={styles.welcome}>
                        GET STARTED
                    </span>

                    <h2 style={styles.title}>
                        Create your account
                    </h2>

                    <p style={styles.subtitle}>
                        Join SmartRide and start your journey.
                    </p>


                    {error && (

                        <div style={styles.error}>
                            ⚠️
                            <span>
                                {error}
                            </span>
                        </div>

                    )}


                    <form onSubmit={handleSubmit}>


                        {/* NAME */}

                        <div style={styles.inputGroup}>

                            <label style={styles.label}>
                                Full Name
                            </label>

                            <div style={styles.inputWrapper}>

                                <span style={styles.icon}>
                                    👤
                                </span>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />

                            </div>

                        </div>


                        {/* EMAIL */}

                        <div style={styles.inputGroup}>

                            <label style={styles.label}>
                                Email Address
                            </label>

                            <div style={styles.inputWrapper}>

                                <span style={styles.icon}>
                                    ✉️
                                </span>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />

                            </div>

                        </div>


                        {/* PHONE */}

                        <div style={styles.inputGroup}>

                            <label style={styles.label}>
                                Phone Number
                            </label>

                            <div style={styles.inputWrapper}>

                                <span style={styles.icon}>
                                    📱
                                </span>

                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter phone number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
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

                                <span style={styles.icon}>
                                    🔒
                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Create a password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
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

                            <small style={styles.hint}>
                                Minimum 6 characters
                            </small>

                        </div>


                        {/* ROLE */}

                        <div style={styles.inputGroup}>

                            <label style={styles.label}>
                                Account Type
                            </label>

                            <div style={styles.roleGrid}>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setForm({
                                            ...form,
                                            role: "CUSTOMER"
                                        })
                                    }
                                    style={{
                                        ...styles.roleButton,
                                        ...(form.role === "CUSTOMER"
                                            ? styles.roleSelected
                                            : {})
                                    }}
                                >

                                    <span style={styles.roleIcon}>
                                        🧑
                                    </span>

                                    <strong>
                                        Customer
                                    </strong>

                                    <small>
                                        Book rides
                                    </small>

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setForm({
                                            ...form,
                                            role: "DRIVER"
                                        })
                                    }
                                    style={{
                                        ...styles.roleButton,
                                        ...(form.role === "DRIVER"
                                            ? styles.roleSelected
                                            : {})
                                    }}
                                >

                                    <span style={styles.roleIcon}>
                                        🚕
                                    </span>

                                    <strong>
                                        Driver
                                    </strong>

                                    <small>
                                        Drive & earn
                                    </small>

                                </button>

                            </div>

                        </div>


                        {/* REGISTER */}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.registerMainButton,
                                opacity:
                                    loading ? 0.7 : 1
                            }}
                        >

                            {loading ? (

                                <>
                                    ⟳ Creating Account...
                                </>

                            ) : (

                                <>
                                    Create Account
                                    <span>
                                        →
                                    </span>
                                </>

                            )}

                        </button>

                    </form>


                    <div style={styles.loginArea}>

                        Already have an account?

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/login")
                            }
                            style={styles.loginButton}
                        >
                            Sign In
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
        width: "45%",
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
        width: "70px",
        height: "70px",
        borderRadius: "20px",
        background:
            "rgba(255,255,255,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "35px",
        marginBottom: "25px"
    },

    brandTitle: {
        fontSize: "46px",
        margin: "0 0 10px",
        fontWeight: "800"
    },

    brandSubtitle: {
        fontSize: "19px",
        opacity: 0.85,
        marginBottom: "40px"
    },

    masteryCard: {
        background:
            "rgba(255,255,255,0.10)",
        border:
            "1px solid rgba(255,255,255,0.15)",
        borderRadius: "18px",
        padding: "22px"
    },

    masteryTitle: {
        fontSize: "13px",
        fontWeight: "800",
        letterSpacing: "1px",
        marginBottom: "15px"
    },

    masteryItem: {
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom:
            "1px solid rgba(255,255,255,0.08)",
        fontSize: "14px"
    },

    formSection: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px"
    },

    formCard: {
        width: "100%",
        maxWidth: "480px"
    },

    backButton: {
        border: "none",
        background: "transparent",
        color: "#6b7280",
        cursor: "pointer",
        padding: "0",
        marginBottom: "30px",
        fontSize: "14px"
    },

    welcome: {
        color: "#2563eb",
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "2px"
    },

    title: {
        fontSize: "32px",
        color: "#111827",
        margin: "10px 0"
    },

    subtitle: {
        color: "#6b7280",
        marginBottom: "25px"
    },

    error: {
        display: "flex",
        gap: "10px",
        padding: "13px",
        background: "#fef2f2",
        color: "#b91c1c",
        border:
            "1px solid #fecaca",
        borderRadius: "10px",
        marginBottom: "20px",
        fontSize: "14px"
    },

    inputGroup: {
        marginBottom: "17px"
    },

    label: {
        display: "block",
        color: "#374151",
        fontWeight: "600",
        fontSize: "14px",
        marginBottom: "7px"
    },

    inputWrapper: {
        display: "flex",
        alignItems: "center",
        background: "white",
        border:
            "1px solid #d1d5db",
        borderRadius: "10px"
    },

    icon: {
        paddingLeft: "13px",
        fontSize: "16px"
    },

    input: {
        flex: 1,
        minWidth: 0,
        border: "none",
        outline: "none",
        padding: "12px",
        fontSize: "14px",
        background: "transparent"
    },

    eyeButton: {
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: "10px"
    },

    hint: {
        color: "#9ca3af",
        fontSize: "11px"
    },

    roleGrid: {
        display: "grid",
        gridTemplateColumns:
            "1fr 1fr",
        gap: "12px"
    },

    roleButton: {
        border:
            "2px solid #e5e7eb",
        background: "white",
        borderRadius: "12px",
        padding: "15px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
        color: "#374151"
    },

    roleSelected: {
        border:
            "2px solid #2563eb",
        background: "#eff6ff",
        color: "#1d4ed8"
    },

    roleIcon: {
        fontSize: "25px"
    },

    registerMainButton: {
        width: "100%",
        border: "none",
        borderRadius: "10px",
        padding: "14px",
        background:
            "linear-gradient(135deg,#2563eb,#1d4ed8)",
        color: "white",
        fontWeight: "700",
        fontSize: "15px",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        boxShadow:
            "0 8px 20px rgba(37,99,235,0.25)"
    },

    loginArea: {
        textAlign: "center",
        marginTop: "22px",
        color: "#6b7280",
        fontSize: "14px"
    },

    loginButton: {
        border: "none",
        background: "transparent",
        color: "#2563eb",
        fontWeight: "700",
        cursor: "pointer",
        marginLeft: "5px"
    },

    footer: {
        textAlign: "center",
        marginTop: "30px",
        color: "#9ca3af",
        fontSize: "12px"
    }

};

export default Register;