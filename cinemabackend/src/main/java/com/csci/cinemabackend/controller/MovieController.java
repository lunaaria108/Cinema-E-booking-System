package com.csci.cinemabackend.controller;

import com.csci.cinemabackend.model.Movie;
import com.csci.cinemabackend.repository.MovieRepository;
import com.csci.cinemabackend.repository.ShowtimeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:5173")
/**
 * Controller class for handling movie api requests.
 */
public class MovieController {

    private final MovieRepository movieRepository;
    private final ShowtimeRepository showtimeRepository;

    public MovieController(
            MovieRepository movieRepository,
            ShowtimeRepository showtimeRepository) {
        this.movieRepository = movieRepository;
        this.showtimeRepository = showtimeRepository;
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

        // Filter movies by title, genre, and/or showtime period
    @GetMapping("/filter")
        public List<Movie> filterMovies(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String showtime) {

        String normalizedTitle = normalize(title);
        String normalizedGenre = normalize(genre);
        String normalizedShowtime = normalize(showtime);

        Set<Integer> filteredMovieIdsByShowtime = null;

        if (normalizedShowtime != null) {
            filteredMovieIdsByShowtime = switch (normalizedShowtime.toLowerCase(Locale.ROOT)) {
            case "morning" -> new HashSet<>(
                showtimeRepository.findDistinctMovieIdsByShowTimeRange(
                    LocalTime.of(5, 0),
                    LocalTime.of(12, 0)
                )
            );
            case "afternoon" -> new HashSet<>(
                showtimeRepository.findDistinctMovieIdsByShowTimeRange(
                    LocalTime.of(12, 0),
                    LocalTime.of(17, 0)
                )
            );
            case "evening" -> new HashSet<>(
                showtimeRepository.findDistinctMovieIdsByShowTimeRange(
                    LocalTime.of(17, 0),
                    LocalTime.of(21, 0)
                )
            );
            case "late night", "latenight" -> new HashSet<>(
                showtimeRepository.findDistinctMovieIdsByShowTimeWrappedRange(
                    LocalTime.of(21, 0),
                    LocalTime.of(5, 0)
                )
            );
            default -> throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Showtime filter must be one of: Morning, Afternoon, Evening, Late Night"
            );
            };
        }

        Set<Integer> showtimeMovieIds = filteredMovieIdsByShowtime;

        return movieRepository.findAll().stream()
            .filter(movie -> normalizedTitle == null
                || (movie.getMovieTitle() != null
                && movie.getMovieTitle().toLowerCase(Locale.ROOT)
                .contains(normalizedTitle.toLowerCase(Locale.ROOT))))
            .filter(movie -> normalizedGenre == null
                || (movie.getGenre() != null
                && movie.getGenre().getGenreName() != null
                && movie.getGenre().getGenreName().equalsIgnoreCase(normalizedGenre)))
            .filter(movie -> showtimeMovieIds == null
                || showtimeMovieIds.contains(movie.getMovieId()))
            .toList();
        }

        private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();

        if (trimmed.isEmpty()) {
            return null;
        }

        return trimmed;
    }
}
