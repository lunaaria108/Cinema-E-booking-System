package com.csci.cinemabackend.model;

import jakarta.persistence.*;
import java.util.List;
import java.time.LocalDate;

@Entity
@Table(name = "movie")
/**
 * Represents a movie entity in the cinema booking system.
 */
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer movieId;

    private String movieTitle;

    @ManyToOne
    @JoinColumn(name = "genre_id")
    private Genre genre;

    private String director;
    private String producer;

    @Column(columnDefinition = "TEXT")
    private String castMembers;

    @Column(columnDefinition = "TEXT")
    private String synopsis;

    private String trailerImage;
    private String trailerVideo;

    private String mpaaRating;

    private LocalDate releaseDate;

    private String status;

    @OneToMany(mappedBy = "movie")
    private List<Review> reviews;

    @OneToMany(mappedBy = "movie")
    private List<Showtime> showtimes;

    @Override
    public String toString() {
        return "Movie{" +
                "id=" + movieId +
                ", title='" + movieTitle + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}