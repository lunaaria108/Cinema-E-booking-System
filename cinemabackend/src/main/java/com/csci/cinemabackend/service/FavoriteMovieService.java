package com.csci.cinemabackend.service;

import com.csci.cinemabackend.model.FavoriteMovie;
import com.csci.cinemabackend.model.Movie;
import com.csci.cinemabackend.model.User;
import com.csci.cinemabackend.repository.FavoriteMovieRepository;
import com.csci.cinemabackend.repository.MovieRepository;
import com.csci.cinemabackend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Handles favorite movie management.
 */
@Service
public class FavoriteMovieService {

    private final FavoriteMovieRepository favoriteMovieRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;

    public FavoriteMovieService(
            FavoriteMovieRepository favoriteMovieRepository,
            UserRepository userRepository,
            MovieRepository movieRepository) {

        this.favoriteMovieRepository = favoriteMovieRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
    }

    /**
     * Returns all favorite movies stored for a user.
     */
    public List<FavoriteMovie> getFavorites(Integer userId) {
        return favoriteMovieRepository.findFavoritesByUserId(userId);
    }

    /**
     * Adds a movie to the user's favorites.
     */
    @Transactional
    public Optional<FavoriteMovie> addFavorite(
            Integer userId,
            Integer movieId) {

        Optional<User> user = userRepository.findById(userId);
        Optional<Movie> movie = movieRepository.findById(movieId);

        if (user.isEmpty() || movie.isEmpty()) {
            return Optional.empty();
        }

        Optional<FavoriteMovie> existingFavorite =
                favoriteMovieRepository.findFavorite(userId, movieId);

        if (existingFavorite.isPresent()) {
            return existingFavorite;
        }

        FavoriteMovie favoriteMovie = new FavoriteMovie();
        favoriteMovie.setUser(user.get());
        favoriteMovie.setMovie(movie.get());

        FavoriteMovie savedFavorite =
                favoriteMovieRepository.save(favoriteMovie);

        return Optional.of(savedFavorite);
    }

    /**
     * Removes a movie from the user's favorites.
     */
    @Transactional
    public boolean removeFavorite(
            Integer userId,
            Integer movieId) {

        int deletedRows =
                favoriteMovieRepository.deleteFavorite(userId, movieId);

        return deletedRows > 0;
    }
}
