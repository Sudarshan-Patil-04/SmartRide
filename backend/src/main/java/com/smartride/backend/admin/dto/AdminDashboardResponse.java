package com.smartride.backend.admin.dto;

public class AdminDashboardResponse {

    private long totalCustomers;

    private long totalDrivers;

    private long pendingDrivers;

    private long verifiedDrivers;

    private long totalRides;


    // ==========================================
    // DEFAULT CONSTRUCTOR
    // ==========================================

    public AdminDashboardResponse() {
    }


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public AdminDashboardResponse(
            long totalCustomers,
            long totalDrivers,
            long pendingDrivers,
            long verifiedDrivers,
            long totalRides
    ) {

        this.totalCustomers =
                totalCustomers;

        this.totalDrivers =
                totalDrivers;

        this.pendingDrivers =
                pendingDrivers;

        this.verifiedDrivers =
                verifiedDrivers;

        this.totalRides =
                totalRides;
    }


    // ==========================================
    // GETTERS
    // ==========================================

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public long getTotalDrivers() {
        return totalDrivers;
    }

    public long getPendingDrivers() {
        return pendingDrivers;
    }

    public long getVerifiedDrivers() {
        return verifiedDrivers;
    }

    public long getTotalRides() {
        return totalRides;
    }


    // ==========================================
    // SETTERS
    // ==========================================

    public void setTotalCustomers(
            long totalCustomers
    ) {

        this.totalCustomers =
                totalCustomers;
    }


    public void setTotalDrivers(
            long totalDrivers
    ) {

        this.totalDrivers =
                totalDrivers;
    }


    public void setPendingDrivers(
            long pendingDrivers
    ) {

        this.pendingDrivers =
                pendingDrivers;
    }


    public void setVerifiedDrivers(
            long verifiedDrivers
    ) {

        this.verifiedDrivers =
                verifiedDrivers;
    }


    public void setTotalRides(
            long totalRides
    ) {

        this.totalRides =
                totalRides;
    }
}