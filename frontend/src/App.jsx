import React from "react";

import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import "leaflet/dist/leaflet.css";


// =====================================================
// HOME
// =====================================================

import Home
    from "./pages/Home/Home";


// =====================================================
// AUTH
// =====================================================

import Login
    from "./pages/auth/Login";

import Register
    from "./pages/auth/Register";

import ProtectedRoute
    from "./components/auth/ProtectedRoute";


// =====================================================
// CUSTOMER
// =====================================================

import CustomerDashboard
    from "./pages/customer/CustomerDashboard";

import BookRide
    from "./pages/customer/BookRide";

import RideDetails
    from "./pages/customer/RideDetails";

import MyRides
    from "./pages/customer/MyRides";

import PaymentPage
    from "./pages/customer/PaymentPage";


// =====================================================
// DRIVER
// =====================================================

import DriverDashboard
    from "./pages/driver/DriverDashboard";

import DriverRegistration
    from "./pages/driver/DriverRegistration";

import AvailableRides
    from "./pages/driver/AvailableRides";

import CurrentRide
    from "./pages/driver/CurrentRide";

import DriverProfile
    from "./pages/driver/DriverProfile";


// =====================================================
// ADMIN
// =====================================================

import AdminDashboard
    from "./pages/admin/AdminDashboard";

import AdminDrivers
    from "./pages/admin/AdminDrivers";

import AdminCustomers
    from "./pages/admin/AdminCustomers";

import AdminRatings
    from "./pages/admin/AdminRatings";


// =====================================================
// APP
// =====================================================

function App() {

    return (

        <Routes>

            {/* ================================================= */}
            {/* HOME */}
            {/* ================================================= */}

            <Route
                path="/"
                element={
                    <Home />
                }
            />


            {/* ================================================= */}
            {/* AUTH */}
            {/* ================================================= */}

            <Route
                path="/login"
                element={
                    <Login />
                }
            />

            <Route
                path="/register"
                element={
                    <Register />
                }
            />


            {/* ================================================= */}
            {/* CUSTOMER */}
            {/* ================================================= */}

            <Route
                path="/customer/dashboard"
                element={

                    <ProtectedRoute
                        allowedRole="CUSTOMER"
                    >

                        <CustomerDashboard />

                    </ProtectedRoute>

                }
            />


            <Route
                path="/book-ride"
                element={

                    <ProtectedRoute
                        allowedRole="CUSTOMER"
                    >

                        <BookRide />

                    </ProtectedRoute>

                }
            />


            <Route
                path="/customer/rides"
                element={

                    <ProtectedRoute
                        allowedRole="CUSTOMER"
                    >

                        <MyRides />

                    </ProtectedRoute>

                }
            />


            <Route
                path="/customer/rides/:rideId"
                element={

                    <ProtectedRoute
                        allowedRole="CUSTOMER"
                    >

                        <RideDetails />

                    </ProtectedRoute>

                }
            />


            <Route
                path="/customer/payment/:rideId"
                element={

                    <ProtectedRoute
                        allowedRole="CUSTOMER"
                    >

                        <PaymentPage />

                    </ProtectedRoute>

                }
            />


            {/* ================================================= */}
            {/* DRIVER */}
            {/* ================================================= */}

            <Route
                path="/driver"
                element={

                    <ProtectedRoute
                        allowedRole="DRIVER"
                    >

                        <DriverDashboard />

                    </ProtectedRoute>

                }
            />


            <Route
                path="/driver/dashboard"
                element={

                    <ProtectedRoute
                        allowedRole="DRIVER"
                    >

                        <DriverDashboard />

                    </ProtectedRoute>

                }
            />


            <Route
                path="/driver/register"
                element={

                    <ProtectedRoute
                        allowedRole="DRIVER"
                    >

                        <DriverRegistration />

                    </ProtectedRoute>

                }
            />


            <Route
                path="/driver/rides"
                element={

                    <ProtectedRoute
                        allowedRole="DRIVER"
                    >

                        <AvailableRides />

                    </ProtectedRoute>

                }
            />


            <Route
                path="/driver/current-ride"
                element={

                    <ProtectedRoute
                        allowedRole="DRIVER"
                    >

                        <CurrentRide />

                    </ProtectedRoute>

                }
            />


            <Route
                path="/driver/profile"
                element={

                    <ProtectedRoute
                        allowedRole="DRIVER"
                    >

                        <DriverProfile />

                    </ProtectedRoute>

                }
            />


            {/* ================================================= */}
            {/* ADMIN */}
            {/* ================================================= */}

            <Route
                path="/admin"
                element={

                    <ProtectedRoute
                        allowedRole="ADMIN"
                    >

                        <Navigate
                            to="/admin/dashboard"
                            replace
                        />

                    </ProtectedRoute>

                }
            />


            {/* ADMIN DASHBOARD */}

            <Route
                path="/admin/dashboard"
                element={

                    <ProtectedRoute
                        allowedRole="ADMIN"
                    >

                        <AdminDashboard />

                    </ProtectedRoute>

                }
            />


            {/* ADMIN DRIVERS */}

            <Route
                path="/admin/drivers"
                element={

                    <ProtectedRoute
                        allowedRole="ADMIN"
                    >

                        <AdminDrivers />

                    </ProtectedRoute>

                }
            />


            {/* ADMIN CUSTOMERS */}

            <Route
                path="/admin/customers"
                element={

                    <ProtectedRoute
                        allowedRole="ADMIN"
                    >

                        <AdminCustomers />

                    </ProtectedRoute>

                }
            />


            {/* ADMIN CUSTOMER DETAILS */}

            <Route
                path="/admin/customers/:customerId"
                element={

                    <ProtectedRoute
                        allowedRole="ADMIN"
                    >

                        <AdminCustomers />

                    </ProtectedRoute>

                }
            />


            {/* ADMIN RATINGS */}

            <Route
                path="/admin/ratings"
                element={

                    <ProtectedRoute
                        allowedRole="ADMIN"
                    >

                        <AdminRatings />

                    </ProtectedRoute>

                }
            />


            {/* ================================================= */}
            {/* ADMIN RIDES */}
            {/* ================================================= */}

            {/*
            <Route
                path="/admin/rides"
                element={
                    <ProtectedRoute
                        allowedRole="ADMIN"
                    >
                        <AdminRides />
                    </ProtectedRoute>
                }
            />
            */}


            {/* ================================================= */}
            {/* ADMIN ANALYTICS */}
            {/* ================================================= */}

            {/*
            <Route
                path="/admin/analytics"
                element={
                    <ProtectedRoute
                        allowedRole="ADMIN"
                    >
                        <AdminAnalytics />
                    </ProtectedRoute>
                }
            />
            */}


            {/* ================================================= */}
            {/* UNKNOWN URL */}
            {/* ================================================= */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>

    );

}


export default App;