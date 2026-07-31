package com.csci.cinemabackend.dto;

import com.csci.cinemabackend.model.Booking;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.LocalTime;

public class BookingResponse {

    private final Integer bookingId;
    private final Integer showtimeId;
    private final String status;
    private final BigDecimal totalPrice;
    private final Instant bookingDate;
    private final List<TicketResponse> tickets;
    private final String movieTitle;
    private final LocalDate showDate;
    private final LocalTime showTime;

    public BookingResponse(Booking booking) {
        this.bookingId = booking.getBookingId();
        this.showtimeId = booking.getShowtime().getShowtimeId();
        this.movieTitle = booking.getShowtime().getMovie().getMovieTitle();
        this.showDate = booking.getShowtime().getShowDate();
        this.showTime = booking.getShowtime().getShowTime();
        this.status = booking.getStatus();
        this.totalPrice = booking.getTotalPrice();
        this.bookingDate = booking.getBookingDate();
        this.tickets = booking.getTickets().stream()
                .map(ticket -> new TicketResponse(
                        ticket.getTicketId(),
                        ticket.getSeatLabel(),
                        ticket.getTicketType(),
                        ticket.getPrice()))
                .collect(Collectors.toList());
    }

    public Integer getBookingId() {
        return bookingId;
    }

    public Integer getShowtimeId() {
        return showtimeId;
    }

    public String getStatus() {
        return status;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public Instant getBookingDate() {
        return bookingDate;
    }

    public List<TicketResponse> getTickets() {
        return tickets;
    }
    public String getMovieTitle() {
    return movieTitle;
    }

    public LocalDate getShowDate() {
    return showDate;
    }

    public LocalTime getShowTime() {
    return showTime;
    }
}
