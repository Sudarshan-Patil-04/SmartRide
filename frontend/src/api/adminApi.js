import {
    apiRequest
} from "./apiClient";


// ==========================================
// DASHBOARD STATISTICS
// ==========================================

export const getAdminDashboardStats =
    async () => {

        return apiRequest(
            "/api/admin/dashboard/stats",
            {
                method: "GET"
            }
        );

    };


// ==========================================
// GET ALL DRIVERS
// ==========================================

export const getAllDrivers =
    async () => {

        return apiRequest(
            "/api/admin/drivers",
            {
                method: "GET"
            }
        );

    };


// ==========================================
// GET PENDING DRIVERS
// ==========================================

export const getPendingDrivers =
    async () => {

        return apiRequest(
            "/api/admin/drivers/pending",
            {
                method: "GET"
            }
        );

    };


// ==========================================
// GET DRIVER DETAILS
// ==========================================

export const getDriverById =
    async (driverId) => {

        return apiRequest(
            `/api/admin/drivers/${driverId}`,
            {
                method: "GET"
            }
        );

    };


// ==========================================
// VERIFY DRIVER
// ==========================================

export const verifyDriver =
    async (driverId) => {

        return apiRequest(
            `/api/admin/drivers/${driverId}/verify`,
            {
                method: "PUT"
            }
        );

    };


// ==========================================
// REJECT DRIVER
// ==========================================

export const rejectDriver =
    async (driverId) => {

        return apiRequest(
            `/api/admin/drivers/${driverId}/reject`,
            {
                method: "PUT"
            }
        );

    };


// ==========================================
// REMOVE DRIVER
// ==========================================

export const deleteDriver =
    async (driverId) => {

        return apiRequest(
            `/api/admin/drivers/${driverId}`,
            {
                method: "DELETE"
            }
        );

    };


// ==========================================
// GET ALL CUSTOMERS
// ==========================================

export const getAllCustomers =
    async () => {

        return apiRequest(
            "/api/admin/customers",
            {
                method: "GET"
            }
        );

    };


// ==========================================
// GET CUSTOMER
// ==========================================

export const getCustomerById =
    async (customerId) => {

        return apiRequest(
            `/api/admin/customers/${customerId}`,
            {
                method: "GET"
            }
        );

    };


// ==========================================
// DELETE CUSTOMER
// ==========================================

export const deleteCustomer =
    async (customerId) => {

        return apiRequest(
            `/api/admin/customers/${customerId}`,
            {
                method: "DELETE"
            }
        );

    };


// ==========================================
// GET ALL RIDES
// ==========================================

export const getAllAdminRides =
    async () => {

        return apiRequest(
            "/api/admin/rides",
            {
                method: "GET"
            }
        );

    };


// ==========================================
// GET RIDE DETAILS
// ==========================================

export const getAdminRideById =
    async (rideId) => {

        return apiRequest(
            `/api/admin/rides/${rideId}`,
            {
                method: "GET"
            }
        );

    };


// ==========================================
// GET ALL RATINGS
// ==========================================

export const getAllRatings =
    async () => {

        return apiRequest(
            "/api/admin/ratings",
            {
                method: "GET"
            }
        );

    };


// ==========================================
// ADMIN ANALYTICS
// ==========================================

export const getAdminAnalytics =
    async () => {

        return apiRequest(
            "/api/admin/analytics",
            {
                method: "GET"
            }
        );

    };