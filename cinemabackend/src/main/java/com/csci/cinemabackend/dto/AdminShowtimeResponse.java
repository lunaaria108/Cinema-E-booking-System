package com.csci.cinemabackend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AdminShowtimeResponse {

    private final Integer showtimeId;
    private final Integer movieId;
    private final String movieTitle;
    private final Integer hallNumber;
    private final LocalDate showDate;
    private final LocalTime showTime;

    public AdminShowtimeResponse(
            Integer showtimeId,
            Integer movieId,
            String movieTitle,
            Integer hallNumber,
            LocalDate showDate,
            LocalTime showTime) {

        this.showtimeId = showtimeId;
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.hallNumber = hallNumber;
        this.showDate = showDate;
        this.showTime = showTime;
    }

    public Integer getShowtimeId() {
        return showtimeId;
    }

    public Integer getMovieId() {
        return movieId;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public Integer getHallNumber() {
        return hallNumber;
    }

    public LocalDate getShowDate() {
        return showDate;
    }

    public LocalTime getShowTime() {
        return showTime;
    }
}
