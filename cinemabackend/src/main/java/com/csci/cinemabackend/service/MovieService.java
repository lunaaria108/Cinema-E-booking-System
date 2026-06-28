package com.csci.cinemabackend.service;

import org.springframework.stereotype.Service;
import com.csci.cinemabackend.model.Movie;
import com.csci.cinemabackend.repository.MovieRepository;
import java.util.List;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<Movie> getCurrentlyRunning() {
        return movieRepository.findByStatus("Currently Running");
    }

    public List<Movie> getComingSoon() {
        return movieRepository.findByStatus("Coming Soon");
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }
    public List<Movie> searchMovies(String movieTitle) {
    return movieRepository.findByMovieTitleContainingIgnoreCase(movieTitle);
    }

    public List<Movie> filterByGenre(String genreName) {
    return movieRepository.findByGenreGenreNameIgnoreCase(genreName);
    }
}
