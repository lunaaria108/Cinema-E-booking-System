package com.csci.cinemabackend.service;

import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.csci.cinemabackend.dto.AdminCreateMovieRequest;
import com.csci.cinemabackend.dto.AdminScheduleShowtimeRequest;
import com.csci.cinemabackend.model.Genre;
import com.csci.cinemabackend.model.Movie;
import com.csci.cinemabackend.model.Showtime;
import com.csci.cinemabackend.repository.GenreRepository;
import com.csci.cinemabackend.repository.MovieRepository;
import com.csci.cinemabackend.repository.ShowtimeRepository;

@Service
public class AdminService {

    private static final Set<String> ALLOWED_MOVIE_STATUSES =
            Set.of("Currently Running", "Coming Soon", "Ended");

    private final AuthService authService;
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final ShowtimeRepository showtimeRepository;

    public AdminService(
            AuthService authService,
            MovieRepository movieRepository,
            GenreRepository genreRepository,
            ShowtimeRepository showtimeRepository) {

        this.authService = authService;
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
        this.showtimeRepository = showtimeRepository;
    }

    public List<Genre> getGenres(String authorizationHeader) {
        requireAdmin(authorizationHeader);
        return genreRepository.findAll();
    }

    public List<Movie> getMovies(String authorizationHeader) {
        requireAdmin(authorizationHeader);
        return movieRepository.findAll();
    }

    public Movie createMovie(String authorizationHeader, AdminCreateMovieRequest request) {
        requireAdmin(authorizationHeader);

        String movieTitle = requiredText(request.getMovieTitle(), "Movie title is required");
        Integer genreId = requiredInteger(request.getGenreId(), "Genre is required");
        String mpaaRating = requiredText(request.getMpaaRating(), "MPAA rating is required");
        String status = requiredText(request.getStatus(), "Status is required");

        if (!ALLOWED_MOVIE_STATUSES.contains(status)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Status must be one of: Currently Running, Coming Soon, Ended");
        }

        Genre genre = genreRepository.findById(genreId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Genre not found"));

        Movie movie = new Movie();
        movie.setMovieTitle(movieTitle);
        movie.setGenre(genre);
        movie.setDirector(trimToNull(request.getDirector()));
        movie.setProducer(trimToNull(request.getProducer()));
        movie.setCastMembers(trimToNull(request.getCastMembers()));
        movie.setSynopsis(trimToNull(request.getSynopsis()));
        movie.setTrailerImage(trimToNull(request.getTrailerImage()));
        movie.setTrailerVideo(trimToNull(request.getTrailerVideo()));
        movie.setMpaaRating(mpaaRating);
        movie.setReleaseDate(request.getReleaseDate());
        movie.setStatus(status);

        return movieRepository.save(movie);
    }

    public Showtime scheduleShowtime(String authorizationHeader, AdminScheduleShowtimeRequest request) {
        requireAdmin(authorizationHeader);

        Integer movieId = requiredInteger(request.getMovieId(), "Movie is required");
        Integer hallNumber = requiredInteger(request.getHallNumber(), "Hall number is required");

        if (hallNumber <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hall number must be positive");
        }

        if (request.getShowDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Show date is required");
        }

        if (request.getShowTime() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Show time is required");
        }

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Movie not found"));

        boolean hallConflict = showtimeRepository.existsByHallNumberAndShowDateAndShowTime(
                hallNumber,
                request.getShowDate(),
                request.getShowTime());

        if (hallConflict) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This hall is already booked at that date and time");
        }

        Showtime showtime = new Showtime();
        showtime.setMovie(movie);
        showtime.setHallNumber(hallNumber);
        showtime.setShowDate(request.getShowDate());
        showtime.setShowTime(request.getShowTime());

        return showtimeRepository.save(showtime);
    }

    private void requireAdmin(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid Authorization header");
        }

        String token = authorizationHeader.substring("Bearer ".length()).trim();

        if (token.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing session token");
        }

        boolean isAdmin = authService.isAdmin(token);

        if (!isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }
    }

    private String requiredText(String value, String errorMessage) {
        if (value == null || value.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, errorMessage);
        }

        return value.trim();
    }

    private Integer requiredInteger(Integer value, String errorMessage) {
        if (value == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, errorMessage);
        }

        return value;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
