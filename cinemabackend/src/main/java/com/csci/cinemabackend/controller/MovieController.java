package com.csci.cinemabackend.controller;

import com.csci.cinemabackend.model.Movie;
import com.csci.cinemabackend.repository.MovieRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:5173")
/**
 * Controller class for handling movie api requests.
 */
public class MovieController {

    private final MovieRepository movieRepository;

    public MovieController(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @GetMapping
    List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    // Get currently running movies
    @GetMapping("/current")
    public List<Movie> getCurrentlyRunningMovies() {
        return movieRepository.findByStatus("Currently Running");
    }

    // Get coming soon movies
    @GetMapping("/coming-soon")
    public List<Movie> getComingSoonMovies() {
        return movieRepository.findByStatus("Coming Soon");
    }

    // Get a single movie by its ID
    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable Integer id) {
        return movieRepository.findById(id).orElseThrow(() -> new RuntimeException("Movie not found"));
    }
    // Search movies by title
    @GetMapping("/search")
    public List<Movie> searchMovies(@RequestParam String title) {
        return movieRepository.findByMovieTitleContainingIgnoreCase(title);
    }

    // Filter movies by genre
    @GetMapping("/filter")
    public List<Movie> filterMovies(@RequestParam String genre) {
        return movieRepository.findByGenreGenreNameIgnoreCase(genre);
    }
}
