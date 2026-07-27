package com.csci.cinemabackend.repository;

import com.csci.cinemabackend.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Integer> {

    List<Ticket> findByBookingBookingId(Integer bookingId);

    @Query("select t.seatLabel from Ticket t "
            + "where t.showtime.showtimeId = :showtimeId "
            + "and t.booking.status in :statuses")
    List<String> findBookedSeatLabels(
            @Param("showtimeId") Integer showtimeId,
            @Param("statuses") List<String> statuses);
}
