package com.smartride.backend.ride.dto;

public class DriverLocationUpdate {

    private String rideId;

    private double latitude;

    private double longitude;


    public DriverLocationUpdate() {
    }


    public String getRideId() {
        return rideId;
    }


    public void setRideId(
            String rideId
    ) {

        this.rideId = rideId;
    }


    public double getLatitude() {
        return latitude;
    }


    public void setLatitude(
            double latitude
    ) {

        this.latitude = latitude;
    }


    public double getLongitude() {
        return longitude;
    }


    public void setLongitude(
            double longitude
    ) {

        this.longitude = longitude;
    }
}