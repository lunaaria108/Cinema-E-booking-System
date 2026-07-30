package com.csci.cinemabackend.service;

import com.csci.cinemabackend.model.Booking;
import com.csci.cinemabackend.model.Movie;
import com.csci.cinemabackend.model.Payment;
import com.csci.cinemabackend.model.Showtime;
import com.csci.cinemabackend.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class BookingConfirmationService {

    private static final Logger logger =
            LoggerFactory.getLogger(BookingConfirmationService.class);

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("MMMM d, yyyy");

    private static final DateTimeFormatter TIME_FORMATTER =
            DateTimeFormatter.ofPattern("h:mm a");

    private final MailService mailService;

    public BookingConfirmationService(MailService mailService) {
        this.mailService = mailService;
    }

    public void sendConfirmation(Payment payment) {
        if (payment == null || payment.getBooking() == null) {
            logger.warn(
                    "Booking confirmation email was not sent because payment or booking was missing."
            );
            return;
        }

        if (!"Approved".equals(payment.getPaymentStatus())) {
            logger.info(
                    "Booking confirmation email was not sent because payment status was {}.",
                    payment.getPaymentStatus()
            );
            return;
        }

        Booking booking = payment.getBooking();
        User user = booking.getUser();
        Showtime showtime = booking.getShowtime();

        if (user == null
                || user.getEmail() == null
                || user.getEmail().trim().isEmpty()) {

            logger.warn(
                    "Booking confirmation email was not sent for booking {} because the user email was missing.",
                    booking.getBookingId()
            );
            return;
        }

        String subject =
                "Booking Confirmation #" + booking.getBookingId();

        String body = buildEmailBody(
                user,
                booking,
                showtime,
                payment
        );

        try {
            mailService.send(
                    user.getEmail(),
                    subject,
                    body
            );

            logger.info(
                    "Booking confirmation email sent for booking {}.",
                    booking.getBookingId()
            );
        } catch (IllegalStateException exception) {
            /*
             * Do not fail or reverse a successful payment just because
             * the confirmation email could not be sent.
             */
            logger.error(
                    "Payment succeeded, but the confirmation email failed for booking {}.",
                    booking.getBookingId(),
                    exception
            );
        }
    }

    private String buildEmailBody(
            User user,
            Booking booking,
            Showtime showtime,
            Payment payment) {

        String customerName = user.getFirstName();

        if (customerName == null || customerName.trim().isEmpty()) {
            customerName = user.getUserName();
        }

        String movieTitle = "Not available";
        String showDate = "Not available";
        String showTime = "Not available";
        String hallNumber = "Not available";

        if (showtime != null) {
            Movie movie = showtime.getMovie();

            if (movie != null
                    && movie.getMovieTitle() != null
                    && !movie.getMovieTitle().trim().isEmpty()) {

                movieTitle = movie.getMovieTitle();
            }

            if (showtime.getShowDate() != null) {
                showDate = showtime.getShowDate()
                        .format(DATE_FORMATTER);
            }

            if (showtime.getShowTime() != null) {
                showTime = showtime.getShowTime()
                        .format(TIME_FORMATTER);
            }

            if (showtime.getHallNumber() != null) {
                hallNumber =
                        showtime.getHallNumber().toString();
            }
        }

        return "Hello " + customerName + ",\n\n"
                + "Your cinema booking has been confirmed.\n\n"
                + "Booking ID: " + booking.getBookingId() + "\n"
                + "Movie: " + movieTitle + "\n"
                + "Date: " + showDate + "\n"
                + "Time: " + showTime + "\n"
                + "Hall: " + hallNumber + "\n"
                + "Booking status: " + booking.getStatus() + "\n"
                + "Payment status: " + payment.getPaymentStatus() + "\n"
                + "Payment reference: "
                + payment.getPaymentReference() + "\n"
                + "Amount paid: $" + payment.getAmount() + "\n\n"
                + "Thank you for choosing our cinema. "
                + "We hope you enjoy the movie!";
    }
}
