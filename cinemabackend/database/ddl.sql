CREATE TABLE Genre (
    genre_id SERIAL PRIMARY KEY,
    genre_name VARCHAR(50) NOT NULL UNIQUE
);


CREATE TABLE Movie (
    movie_id SERIAL PRIMARY KEY,
    movie_title VARCHAR(255) NOT NULL,
    genre_id INT NOT NULL,
    director VARCHAR(150),
    producer VARCHAR(150),
    cast_members TEXT,
    synopsis TEXT,
    trailer_image VARCHAR(255),
    trailer_video VARCHAR(255),
    mpaa_rating VARCHAR(10) NOT NULL,
    release_date DATE,
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('Currently Running', 'Coming Soon', 'Ended')),
    CONSTRAINT fk_movie_genre
        FOREIGN KEY (genre_id)
        REFERENCES Genre(genre_id)
        ON DELETE RESTRICT
);


CREATE TABLE Review (
    review_id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL,
    reviewer_name VARCHAR(100),
    rating DECIMAL(2,1),
    review_text TEXT,

    CONSTRAINT fk_review_movie
        FOREIGN KEY (movie_id)
        REFERENCES Movie(movie_id)
        ON DELETE CASCADE
);


CREATE TABLE Showtime (
    showtime_id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    hall_number INT NOT NULL,

    CONSTRAINT fk_showtime_movie
        FOREIGN KEY (movie_id)
        REFERENCES Movie(movie_id)
        ON DELETE CASCADE
);


CREATE TABLE User (
    user_id SERIAL PRIMARY KEY, 
    email VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL UNIQUE,
    created TIMESTAMP NOT NULL DEFAULT NOW()
)
    
    
