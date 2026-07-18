package com.csci.cinemabackend.repository;

import com.csci.cinemabackend.model.FavoriteMovie;
import com.csci.cinemabackend.model.FavoriteMovieId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Provides database operations for users' favorite movies.
 */
public interface FavoriteMovieRepository
        extends JpaRepository<FavoriteMovie, FavoriteMovieId> {

    List<FavoriteMovie> findByUserUserId(Integer userId);

   @Query("""
SELECT COUNT(f) > 0
FROM FavoriteMovie f
WHERE f.user.userId = :userId
  AND f.movie.movieId = :movieId
""")
boolean favoriteExists(
        @Param("userId") Integer userId,
        @Param("movieId") Integer movieId
);
    void deleteByUserUserIdAndMovieMovieId(
            Integer userId,
            Integer movieId
    );
}
