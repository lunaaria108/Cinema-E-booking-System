package com.csci.cinemabackend.dto;

import com.csci.cinemabackend.model.Booking;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

public class BookingResponse {

    private final Integer bookingId;
    private final Integer showtimeId;
    private final String status;
    private final BigDecimal totalPrice;
    private final Instant bookingDate;
    private final List<TicketResponse> tickets;

    public BookingResponse(Booking booking) {
        this.bookingId = booking.getBookingId();
        this.showtimeId = booking.getShowtime().getShowtimeId();
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
}
