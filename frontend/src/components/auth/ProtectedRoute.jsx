import React from "react";

import {
    Navigate
} from "react-router-dom";


function ProtectedRoute({
    children,
    allowedRole
}) {

    // ==========================================
    // GET TOKEN
    // ==========================================

    const token =
        localStorage.getItem("token");


    // ==========================================
    // GET USER
    // ==========================================

    const savedUser =
        localStorage.getItem("user");


    // ==========================================
    // NOT LOGGED IN
    // ==========================================

    if (!token || !savedUser) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // ==========================================
    // PARSE USER
    // ==========================================

    let user;

    try {

        user =
            JSON.parse(savedUser);

    } catch (error) {

        console.error(
            "Invalid user data:",
            error
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // ==========================================
    // ROLE CHECK
    // ==========================================

    if (
        allowedRole &&
        user.role !== allowedRole
    ) {

        // CUSTOMER
        if (user.role === "CUSTOMER") {

            return (
                <Navigate
                    to="/customer/dashboard"
                    replace
                />
            );

        }


        // DRIVER
        if (user.role === "DRIVER") {

            return (
                <Navigate
                    to="/driver/dashboard"
                    replace
                />
            );

        }


        // ADMIN
        if (user.role === "ADMIN") {

            return (
                <Navigate
                    to="/admin/dashboard"
                    replace
                />
            );

        }


        // UNKNOWN ROLE

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // ==========================================
    // ACCESS GRANTED
    // ==========================================

    return children;

}


export default ProtectedRoute;