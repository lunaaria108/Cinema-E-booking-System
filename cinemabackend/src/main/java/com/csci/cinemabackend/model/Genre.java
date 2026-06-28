package com.csci.cinemabackend.model;

import jakarta.persistence.Entity;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "genre")
/**
 * Represents a genre entity in the cinema booking system.
 */
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer genreId;

    private String genreName;

    @OneToMany(mappedBy = "genre")
    private List<Movie> movies;
}