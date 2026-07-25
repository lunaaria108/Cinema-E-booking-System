package com.csci.cinemabackend.controller;

import com.csci.cinemabackend.dto.AdminCreateMovieRequest;
import com.csci.cinemabackend.dto.AdminScheduleShowtimeRequest;
import com.csci.cinemabackend.model.Genre;
import com.csci.cinemabackend.model.Movie;
import com.csci.cinemabackend.model.Showtime;
import com.csci.cinemabackend.service.AdminService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/genres")
    public ResponseEntity<List<Genre>> getGenres(
            @RequestHeader("Authorization") String authorizationHeader) {

        return ResponseEntity.ok(adminService.getGenres(authorizationHeader));
    }

    @GetMapping("/movies")
    public ResponseEntity<List<Movie>> getMovies(
            @RequestHeader("Authorization") String authorizationHeader) {

        return ResponseEntity.ok(adminService.getMovies(authorizationHeader));
    }

    @PostMapping("/movies")
    public ResponseEntity<?> createMovie(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody AdminCreateMovieRequest request) {

        try {
            Movie createdMovie = adminService.createMovie(authorizationHeader, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMovie);
        } catch (DataIntegrityViolationException exception) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Unable to save movie due to invalid data constraints"));
        } catch (ResponseStatusException exception) {
            return ResponseEntity.status(exception.getStatusCode()).body(
                    Map.of("message", exception.getReason()));
        }
    }

    @PostMapping("/showtimes")
    public ResponseEntity<?> scheduleShowtime(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody AdminScheduleShowtimeRequest request) {

        try {
            Showtime showtime = adminService.scheduleShowtime(authorizationHeader, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(showtime);
        } catch (DataIntegrityViolationException exception) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Unable to schedule showtime. Verify movie and hall values."));
        } catch (ResponseStatusException exception) {
            return ResponseEntity.status(exception.getStatusCode()).body(
                    Map.of("message", exception.getReason()));
        }
    }
}
