package com.csci.cinemabackend.repository;

import com.csci.cinemabackend.model.FavoriteMovie;
import com.csci.cinemabackend.model.FavoriteMovieId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * Provides database operations for users' favorite movies.
 */
public interface FavoriteMovieRepository
        extends JpaRepository<FavoriteMovie, FavoriteMovieId> {

    @Query("""
        SELECT f
        FROM FavoriteMovie f
        WHERE f.user.userId = :userId
        """)
    List<FavoriteMovie> findFavoritesByUserId(
            @Param("userId") Integer userId
    );

    @Query("""
        SELECT f
        FROM FavoriteMovie f
        WHERE f.user.userId = :userId
          AND f.movie.movieId = :movieId
        """)
    Optional<FavoriteMovie> findFavorite(
            @Param("userId") Integer userId,
            @Param("movieId") Integer movieId
    );

    @Modifying
    @Query("""
        DELETE FROM FavoriteMovie f
        WHERE f.user.userId = :userId
          AND f.movie.movieId = :movieId
        """)
    int deleteFavorite(
            @Param("userId") Integer userId,
            @Param("movieId") Integer movieId
    );
}