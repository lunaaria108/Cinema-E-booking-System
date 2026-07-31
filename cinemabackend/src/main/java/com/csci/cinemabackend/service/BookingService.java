package com.csci.cinemabackend.service;

import com.csci.cinemabackend.dto.BookingResponse;
import com.csci.cinemabackend.dto.CheckoutConfirmRequest;
import com.csci.cinemabackend.dto.SeatAvailabilityResponse;
import com.csci.cinemabackend.dto.SeatSelectionRequest;
import com.csci.cinemabackend.model.Booking;
import com.csci.cinemabackend.model.Showtime;
import com.csci.cinemabackend.model.Ticket;
import com.csci.cinemabackend.model.User;
import com.csci.cinemabackend.repository.BookingRepository;
import com.csci.cinemabackend.repository.ShowtimeRepository;
import com.csci.cinemabackend.repository.TicketRepository;
import com.csci.cinemabackend.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private static final List<String> ACTIVE_BOOKING_STATUSES =
            List.of("Pending", "Paid");

    private static final String[] SEAT_ROWS =
            {"A", "B", "C", "D", "E", "F", "G", "H"};

    private static final int SEATS_PER_ROW = 10;

    private static final Map<String, BigDecimal> TICKET_PRICES =
            Map.of(
                "Adult", new BigDecimal("10.00"),
                "Senior", new BigDecimal("7.00"),
                                "Child", new BigDecimal("5.00"),
                                "Student", new BigDecimal("0.00")
            );

  private static final BigDecimal BOOKING_FEE = 
    BigDecimal.ZERO;

    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final ShowtimeRepository showtimeRepository;
    private final UserRepository userRepository;
    private final TaxService taxService;

    public BookingService(
            BookingRepository bookingRepository,
            TicketRepository ticketRepository,
            ShowtimeRepository showtimeRepository,
            UserRepository userRepository,
            TaxService taxService) {

        this.bookingRepository = bookingRepository;
        this.ticketRepository = ticketRepository;
        this.showtimeRepository = showtimeRepository;
        this.userRepository = userRepository;
        this.taxService = taxService;
    }

    public List<SeatAvailabilityResponse> getSeatAvailability(
            Integer showtimeId) {

        if (!showtimeRepository.existsById(showtimeId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Showtime not found"
            );
        }

        Set<String> bookedSeats = new HashSet<>(
                ticketRepository.findBookedSeatLabels(
                        showtimeId,
                        ACTIVE_BOOKING_STATUSES
                )
        );

        List<SeatAvailabilityResponse> seats =
                new ArrayList<>();

        for (String row : SEAT_ROWS) {
            for (int number = 1;
                 number <= SEATS_PER_ROW;
                 number++) {

                String seatLabel = row + number;

                seats.add(
                        new SeatAvailabilityResponse(
                                seatLabel,
                                bookedSeats.contains(seatLabel)
                        )
                );
            }
        }

        return seats;
    }

    @Transactional
    public BookingResponse confirmCheckout(
            Integer userId,
            CheckoutConfirmRequest request) {

        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Checkout request is required"
            );
        }

        Integer showtimeId = requiredInteger(
                request.getShowtimeId(),
                "Showtime is required"
        );

        if (request.getSeats() == null
                || request.getSeats().isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "At least one seat is required"
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        Showtime showtime = showtimeRepository
                .findById(showtimeId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Showtime not found"
                        )
                );

        List<SeatSelectionRequest> seatSelections =
                request.getSeats();

        Set<String> requestedSeatLabels =
                new HashSet<>();

        for (SeatSelectionRequest seat : seatSelections) {
            if (seat == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Seat selection is required"
                );
            }

            String seatLabel = requiredText(
                    seat.getSeatLabel(),
                    "Seat is required"
            );

            String ticketType = requiredText(
                    seat.getTicketType(),
                    "Ticket type is required"
            );

            if (!TICKET_PRICES.containsKey(ticketType)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Ticket type must be one of: "
                                + String.join(
                                        ", ",
                                        TICKET_PRICES.keySet()
                                )
                );
            }

            if (!requestedSeatLabels.add(seatLabel)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Seat "
                                + seatLabel
                                + " was selected more than once"
                );
            }
        }

        Set<String> alreadyBooked = new HashSet<>(
                ticketRepository.findBookedSeatLabels(
                        showtimeId,
                        ACTIVE_BOOKING_STATUSES
                )
        );

        alreadyBooked.retainAll(requestedSeatLabels);

        if (!alreadyBooked.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Seat(s) "
                            + String.join(", ", alreadyBooked)
                            + " are no longer available"
            );
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShowtime(showtime);
        booking.setStatus("Pending");

        /*
         * The taxable subtotal begins with the booking fee.
         * Each selected ticket price is added below.
         */
        BigDecimal subtotal = BOOKING_FEE;

        List<Ticket> tickets = new ArrayList<>();

        for (SeatSelectionRequest seat : seatSelections) {
            String seatLabel = seat.getSeatLabel().trim();
            String ticketType = seat.getTicketType().trim();

            BigDecimal price =
                    TICKET_PRICES.get(ticketType);

            Ticket ticket = new Ticket();
            ticket.setBooking(booking);
            ticket.setShowtime(showtime);
            ticket.setSeatLabel(seatLabel);
            ticket.setTicketType(ticketType);
            ticket.setPrice(price);

            tickets.add(ticket);
            subtotal = subtotal.add(price);
        }

        subtotal = subtotal.setScale(
                2,
                RoundingMode.HALF_UP
        );

        BigDecimal tax =
                taxService.calculateTax(subtotal);

        BigDecimal total =
                subtotal.add(tax)
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );

        booking.setTickets(tickets);
        booking.setTotalPrice(total);

        try {
            Booking saved =
                    bookingRepository.saveAndFlush(booking);

            return new BookingResponse(saved);
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "One or more selected seats were just taken. "
                            + "Please choose another seat."
            );
        }
    }

    public BookingResponse getBooking(Integer bookingId, User caller) {
        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Booking not found"
                        )
                );

        if (!Boolean.TRUE.equals(caller.getIsAdmin())
                && !booking.getUser().getUserId().equals(caller.getUserId())) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Booking not found"
            );
        }

        return new BookingResponse(booking);
    }

    public List<BookingResponse> getBookingsForUser(
            Integer userId) {

        return bookingRepository
                .findByUserUserId(userId)
                .stream()
                .map(BookingResponse::new)
                .collect(Collectors.toList());
    }

    private String requiredText(
            String value,
            String errorMessage) {

        if (value == null || value.trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    errorMessage
            );
        }

        return value.trim();
    }

    private Integer requiredInteger(
            Integer value,
            String errorMessage) {

        if (value == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    errorMessage
            );
        }

        return value;
    }
}
