package com.smartride.backend.ride.service;

import com.smartride.backend.ride.model.RideLocation;
import com.smartride.backend.ride.dto.RouteResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoutingService {

    private final HttpClient httpClient;

    public RoutingService() {
        this.httpClient = HttpClient.newHttpClient();
    }

    public RouteResponse calculateRoute(
            double pickupLatitude,
            double pickupLongitude,
            double destinationLatitude,
            double destinationLongitude
    ) {

        try {

            String url =
                    "https://router.project-osrm.org/route/v1/driving/"
                    + pickupLongitude + "," + pickupLatitude
                    + ";"
                    + destinationLongitude + "," + destinationLatitude
                    + "?overview=full"
                    + "&geometries=geojson";

            HttpRequest request =
                    HttpRequest.newBuilder()
                            .uri(URI.create(url))
                            .GET()
                            .build();

            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            if (response.statusCode() != 200) {
                throw new RuntimeException(
                        "Routing service failed"
                );
            }

            JSONObject json =
                    new JSONObject(response.body());

            if (!"Ok".equals(json.getString("code"))) {
                throw new RuntimeException(
                        "Route could not be calculated"
                );
            }

            JSONArray routes =
                    json.getJSONArray("routes");

            if (routes.isEmpty()) {
                throw new RuntimeException(
                        "No route found"
                );
            }

            JSONObject route =
                    routes.getJSONObject(0);

            double distanceMeters =
                    route.getDouble("distance");

            double distanceKm =
                    distanceMeters / 1000.0;

            double durationSeconds =
                    route.getDouble("duration");

            int durationMinutes =
                    (int) Math.ceil(
                            durationSeconds / 60.0
                    );

            JSONObject geometry =
                    route.getJSONObject("geometry");

            JSONArray coordinates =
                    geometry.getJSONArray("coordinates");

            List<List<Double>> routeCoordinates =
                    new ArrayList<>();

            for (int i = 0; i < coordinates.length(); i++) {

                JSONArray point =
                        coordinates.getJSONArray(i);

                double longitude =
                        point.getDouble(0);

                double latitude =
                        point.getDouble(1);

                routeCoordinates.add(
                        List.of(longitude, latitude)
                );
            }

            return new RouteResponse(
                    distanceKm,
                    durationMinutes,
                    routeCoordinates
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to calculate route: "
                            + e.getMessage()
            );
        }
    }


    public RouteResponse calculateRoute(
            RideLocation pickup,
            RideLocation destination
    ) {

        return calculateRoute(

                pickup.getLatitude(),
                pickup.getLongitude(),

                destination.getLatitude(),
                destination.getLongitude()
        );
    }
}