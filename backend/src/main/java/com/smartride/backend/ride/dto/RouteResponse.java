package com.smartride.backend.ride.dto;

import lombok.Data;

import java.util.List;

@Data
public class RouteResponse {

    private double distanceKm;

    private int durationMinutes;

    /*
     * OSRM road route coordinates
     *
     * Each point:
     * [longitude, latitude]
     */
    private List<List<Double>> routeCoordinates;


    public RouteResponse() {
    }


    public RouteResponse(
            double distanceKm,
            int durationMinutes,
            List<List<Double>> routeCoordinates
    ) {

        this.distanceKm =
                distanceKm;

        this.durationMinutes =
                durationMinutes;

        this.routeCoordinates =
                routeCoordinates;
    }
}