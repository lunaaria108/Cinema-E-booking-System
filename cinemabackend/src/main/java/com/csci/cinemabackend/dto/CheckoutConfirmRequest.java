package com.csci.cinemabackend.dto;

import java.util.List;

public class CheckoutConfirmRequest {

    private Integer userId;
    private Integer showtimeId;
    private List<SeatSelectionRequest> seats;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

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
