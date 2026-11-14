import React, { useState } from "react";

import {
    registerDriver
} from "../../api/driverApi";

import {
    useNavigate
} from "react-router-dom";


function DriverRegistration() {

    const navigate = useNavigate();


    // ==========================================
    // FORM STATE
    // ==========================================

    const [licenseNumber, setLicenseNumber] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [vehicleType, setVehicleType] = useState("");


    // ==========================================
    // UI STATE
    // ==========================================

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ==========================================
    // SUBMIT
    // ==========================================

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setSuccess("");


        // ======================================
        // VALIDATION
        // ======================================

        if (!licenseNumber.trim()) {

            setError("Please enter your driving license number.");
            return;

        }


        if (!vehicleNumber.trim()) {

            setError("Please enter your vehicle number.");
            return;

        }


        if (!vehicleType) {

            setError("Please select your vehicle type.");
            return;

        }


        try {

            setLoading(true);


            await registerDriver(
                licenseNumber,
                vehicleNumber,
                vehicleType
            );


            setSuccess(
                "Driver profile created successfully. Your profile is waiting for admin verification."
            );


            setTimeout(() => {

                navigate(
                    "/driver/dashboard",
                    {
                        replace: true
                    }
                );

            }, 1200);

        }
        catch (err) {

            console.error(
                "Driver registration error:",
                err
            );


            setError(
                err?.message ||
                "Unable to create driver profile."
            );

        }
        finally {

            setLoading(false);

        }

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="driver-register-page">

            <div className="driver-register-card">


                {/* =====================================
                    HEADER
                ===================================== */}

                <div className="driver-register-header">

                    <div className="driver-register-icon">
                        🚕
                    </div>

                    <div>

                        <div className="brand-small">
                            SMARTRIDE
                        </div>

                        <h1>
                            Become a Driver
                        </h1>

                        <p>
                            Complete your vehicle information
                            to start driving with SmartRide.
                        </p>

                    </div>

                </div>


                {/* =====================================
                    ERROR
                ===================================== */}

                {error && (

                    <div className="register-alert error">

                        <span>⚠️</span>

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* =====================================
                    SUCCESS
                ===================================== */}

                {success && (

                    <div className="register-alert success">

                        <span>✓</span>

                        <span>
                            {success}
                        </span>

                    </div>

                )}


                {/* =====================================
                    FORM
                ===================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="driver-register-form"
                >


                    {/* LICENSE */}

                    <div className="field">

                        <label>
                            Driving License Number
                        </label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                🪪
                            </span>

                            <input
                                type="text"
                                placeholder="Example: MH1520230012345"
                                value={licenseNumber}
                                onChange={(e) =>
                                    setLicenseNumber(
                                        e.target.value
                                    )
                                }
                                disabled={loading}
                            />

                        </div>

                    </div>


                    {/* VEHICLE NUMBER */}

                    <div className="field">

                        <label>
                            Vehicle Registration Number
                        </label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                🚗
                            </span>

                            <input
                                type="text"
                                placeholder="Example: MH15AB1234"
                                value={vehicleNumber}
                                onChange={(e) =>
                                    setVehicleNumber(
                                        e.target.value
                                    )
                                }
                                disabled={loading}
                            />

                        </div>

                    </div>


                    {/* VEHICLE TYPE */}

                    <div className="field">

                        <label>
                            Vehicle Type
                        </label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                🚘
                            </span>

                            <select
                                value={vehicleType}
                                onChange={(e) =>
                                    setVehicleType(
                                        e.target.value
                                    )
                                }
                                disabled={loading}
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

                    </div>


                    {/* =================================
                        VERIFICATION INFO
                    ================================= */}

                    <div className="verification-box">

                        <div className="verification-icon">
                            🔐
                        </div>

                        <div>

                            <strong>
                                Admin Verification
                            </strong>

                            <p>
                                After registration, your driver
                                profile will be reviewed by the
                                SmartRide administrator.
                            </p>

                            <span className="pending-badge">
                                🟠 PENDING VERIFICATION
                            </span>

                        </div>

                    </div>


                    {/* =================================
                        SUBMIT
                    ================================= */}

                    <button
                        type="submit"
                        disabled={loading}
                        className={
                            loading
                                ? "register-submit loading"
                                : "register-submit"
                        }
                    >

                        {loading ? (

                            <>
                                <span className="spinner"></span>
                                Creating Profile...
                            </>

                        ) : (

                            <>
                                🚕 Create Driver Profile
                            </>

                        )}

                    </button>


                    {/* BACK */}

                    <button
                        type="button"
                        className="register-back"
                        disabled={loading}
                        onClick={() =>
                            navigate("/driver/dashboard")
                        }
                    >
                        ← Back to Dashboard
                    </button>

                </form>

            </div>


            {/* =========================================
                PAGE FOOTER
            ========================================= */}

            <div className="driver-register-footer">

                SmartRide Driver Portal • Secure & Reliable

            </div>


            {/* =========================================
                CSS
            ========================================= */}

            <style>{`

                * {
                    box-sizing: border-box;
                }

                .driver-register-page {
                    min-height: 100vh;
                    background:
                        radial-gradient(
                            circle at top left,
                            #dbeafe,
                            transparent 35%
                        ),
                        radial-gradient(
                            circle at bottom right,
                            #ede9fe,
                            transparent 35%
                        ),
                        #f8fafc;

                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;

                    padding: 40px 20px;

                    font-family:
                        Inter,
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                }


                .driver-register-card {
                    width: 100%;
                    max-width: 560px;

                    background: rgba(255,255,255,0.95);

                    border: 1px solid #e5e7eb;

                    border-radius: 24px;

                    padding: 40px;

                    box-shadow:
                        0 25px 60px
                        rgba(15,23,42,0.10);

                    backdrop-filter: blur(12px);
                }


                .driver-register-header {
                    display: flex;
                    gap: 20px;
                    align-items: center;

                    margin-bottom: 30px;
                }


                .driver-register-icon {
                    width: 76px;
                    height: 76px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    flex-shrink: 0;

                    font-size: 38px;

                    border-radius: 20px;

                    background:
                        linear-gradient(
                            135deg,
                            #2563eb,
                            #4f46e5
                        );

                    box-shadow:
                        0 12px 25px
                        rgba(37,99,235,0.25);
                }


                .brand-small {
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 2px;
                    color: #2563eb;
                    margin-bottom: 5px;
                }


                .driver-register-header h1 {
                    margin: 0;

                    font-size: 29px;

                    color: #111827;
                }


                .driver-register-header p {
                    margin: 7px 0 0;

                    color: #64748b;

                    line-height: 1.5;

                    font-size: 14px;
                }


                .register-alert {
                    display: flex;
                    gap: 10px;

                    padding: 14px 16px;

                    border-radius: 12px;

                    margin-bottom: 22px;

                    font-size: 14px;

                    font-weight: 600;
                }


                .register-alert.error {
                    background: #fef2f2;
                    color: #b91c1c;
                    border: 1px solid #fecaca;
                }


                .register-alert.success {
                    background: #f0fdf4;
                    color: #15803d;
                    border: 1px solid #bbf7d0;
                }


                .driver-register-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }


                .field label {
                    display: block;

                    margin-bottom: 8px;

                    font-size: 13px;

                    font-weight: 700;

                    color: #374151;
                }


                .input-wrapper {
                    position: relative;
                }


                .input-icon {
                    position: absolute;

                    left: 15px;
                    top: 50%;

                    transform:
                        translateY(-50%);

                    font-size: 17px;

                    pointer-events: none;
                }


                .input-wrapper input,
                .input-wrapper select {

                    width: 100%;

                    height: 50px;

                    border: 1px solid #d1d5db;

                    border-radius: 12px;

                    background: #f8fafc;

                    color: #111827;

                    font-size: 14px;

                    padding:
                        0 15px 0 45px;

                    outline: none;

                    transition:
                        border-color .2s,
                        box-shadow .2s,
                        background .2s;
                }


                .input-wrapper select {
                    cursor: pointer;
                }


                .input-wrapper input:focus,
                .input-wrapper select:focus {

                    background: white;

                    border-color: #2563eb;

                    box-shadow:
                        0 0 0 4px
                        rgba(37,99,235,0.10);
                }


                .input-wrapper input:disabled,
                .input-wrapper select:disabled {

                    opacity: .6;

                    cursor: not-allowed;
                }


                .verification-box {

                    display: flex;

                    gap: 14px;

                    padding: 17px;

                    border-radius: 14px;

                    background: #fffbeb;

                    border: 1px solid #fde68a;
                }


                .verification-icon {
                    font-size: 23px;
                }


                .verification-box strong {
                    display: block;

                    color: #92400e;

                    margin-bottom: 5px;
                }


                .verification-box p {
                    margin: 0 0 10px;

                    color: #92400e;

                    font-size: 13px;

                    line-height: 1.5;
                }


                .pending-badge {
                    display: inline-block;

                    padding: 5px 9px;

                    border-radius: 20px;

                    background: #fef3c7;

                    color: #92400e;

                    font-size: 10px;

                    font-weight: 800;

                    letter-spacing: .4px;
                }


                .register-submit {

                    height: 52px;

                    border: none;

                    border-radius: 12px;

                    background:
                        linear-gradient(
                            135deg,
                            #2563eb,
                            #4f46e5
                        );

                    color: white;

                    font-size: 15px;

                    font-weight: 800;

                    cursor: pointer;

                    box-shadow:
                        0 10px 20px
                        rgba(37,99,235,0.20);

                    transition:
                        transform .2s,
                        box-shadow .2s;
                }


                .register-submit:hover:not(:disabled) {

                    transform: translateY(-2px);

                    box-shadow:
                        0 14px 25px
                        rgba(37,99,235,0.28);
                }


                .register-submit:disabled {

                    cursor: not-allowed;

                    opacity: .7;
                }


                .register-submit.loading {

                    display: flex;

                    justify-content: center;

                    align-items: center;

                    gap: 10px;
                }


                .spinner {

                    width: 18px;
                    height: 18px;

                    border:
                        2px solid
                        rgba(255,255,255,.4);

                    border-top-color: white;

                    border-radius: 50%;

                    animation:
                        spin .7s linear infinite;
                }


                @keyframes spin {

                    to {
                        transform: rotate(360deg);
                    }

                }


                .register-back {

                    height: 46px;

                    border: none;

                    border-radius: 12px;

                    background: #f1f5f9;

                    color: #475569;

                    font-weight: 700;

                    cursor: pointer;
                }


                .register-back:hover {

                    background: #e2e8f0;
                }


                .driver-register-footer {

                    margin-top: 22px;

                    font-size: 12px;

                    color: #94a3b8;

                    text-align: center;
                }


                @media(max-width: 600px) {

                    .driver-register-page {
                        padding: 20px 14px;
                    }


                    .driver-register-card {
                        padding: 25px 20px;

                        border-radius: 18px;
                    }


                    .driver-register-header {
                        align-items: flex-start;
                    }


                    .driver-register-icon {
                        width: 60px;
                        height: 60px;

                        font-size: 29px;
                    }


                    .driver-register-header h1 {
                        font-size: 23px;
                    }

                }

            `}</style>

        </div>

    );
}


export default DriverRegistration;