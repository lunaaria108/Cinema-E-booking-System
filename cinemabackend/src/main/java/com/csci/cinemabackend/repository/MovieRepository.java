package com.csci.cinemabackend.repository;

import com.csci.cinemabackend.model.Movie;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Integer> {

    List<Movie> findByMovieTitleContainingIgnoreCase(String movieTitle);

    List<Movie> findByStatus(String status);
    
    List<Movie> findByGenreGenreNameIgnoreCase(String genreName);
}
