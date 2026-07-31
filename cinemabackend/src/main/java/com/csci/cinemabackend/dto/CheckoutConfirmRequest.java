package com.csci.cinemabackend.dto;

import java.util.List;

public class CheckoutConfirmRequest {

    private Integer showtimeId;
    private List<SeatSelectionRequest> seats;

    public Integer getShowtimeId() {
        return showtimeId;
    }

    public void setShowtimeId(Integer showtimeId) {
        this.showtimeId = showtimeId;
    }

    public List<SeatSelectionRequest> getSeats() {
        return seats;
    }

    public void setSeats(List<SeatSelectionRequest> seats) {
        this.seats = seats;
    }
}
