package com.csci.cinemabackend.repository;

import com.csci.cinemabackend.model.Showtime;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Integer> {
    List<Showtime> findByMovieMovieId(Integer movieId);

}
