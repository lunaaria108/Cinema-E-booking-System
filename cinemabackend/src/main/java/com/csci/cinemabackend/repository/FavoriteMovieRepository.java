package com.csci.cinemabackend.repository;

import com.csci.cinemabackend.model.FavoriteMovie;
import com.csci.cinemabackend.model.FavoriteMovieId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Provides database operations for users' favorite movies.
 */
public interface FavoriteMovieRepository
        extends JpaRepository<FavoriteMovie, FavoriteMovieId> {

    List<FavoriteMovie> findByUserUserId(Integer userId);

    boolean existsByUserUserIdAndMovieMovieId(
            Integer userId,
            Integer movieId
    );

    void deleteByUserUserIdAndMovieMovieId(
            Integer userId,
            Integer movieId
    );
}