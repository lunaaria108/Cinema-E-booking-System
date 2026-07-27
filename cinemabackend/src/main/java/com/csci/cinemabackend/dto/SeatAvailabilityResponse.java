package com.csci.cinemabackend.dto;

public class SeatAvailabilityResponse {

    private final String seatLabel;
    private final boolean booked;

    public SeatAvailabilityResponse(String seatLabel, boolean booked) {
        this.seatLabel = seatLabel;
        this.booked = booked;
    }

    public String getSeatLabel() {
        return seatLabel;
    }

    public boolean isBooked() {
        return booked;
    }
}
