package com.csci.cinemabackend.repository;

import com.csci.cinemabackend.model.Showtime;

import java.util.List;
import java.time.LocalTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Integer> {
    List<Showtime> findByMovieMovieId(Integer movieId);

    boolean existsByHallNumberAndShowDateAndShowTime(Integer hallNumber, java.time.LocalDate showDate, java.time.LocalTime showTime);

    @Query("""
        SELECT DISTINCT s.movie.movieId
        FROM Showtime s
        WHERE s.showTime >= :startTime
          AND s.showTime < :endTime
        """)
    List<Integer> findDistinctMovieIdsByShowTimeRange(
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    @Query("""
        SELECT DISTINCT s.movie.movieId
        FROM Showtime s
        WHERE s.showTime >= :startTime
           OR s.showTime < :endTime
        """)
    List<Integer> findDistinctMovieIdsByShowTimeWrappedRange(
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

}
