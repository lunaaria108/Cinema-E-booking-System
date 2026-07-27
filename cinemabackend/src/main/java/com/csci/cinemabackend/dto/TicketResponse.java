package com.csci.cinemabackend.dto;

import java.math.BigDecimal;

public class TicketResponse {

    private final Integer ticketId;
    private final String seatLabel;
    private final String ticketType;
    private final BigDecimal price;

    public TicketResponse(Integer ticketId, String seatLabel, String ticketType, BigDecimal price) {
        this.ticketId = ticketId;
        this.seatLabel = seatLabel;
        this.ticketType = ticketType;
        this.price = price;
    }

    public Integer getTicketId() {
        return ticketId;
    }

    public String getSeatLabel() {
        return seatLabel;
    }

    public String getTicketType() {
        return ticketType;
    }

    public BigDecimal getPrice() {
        return price;
    }
}
