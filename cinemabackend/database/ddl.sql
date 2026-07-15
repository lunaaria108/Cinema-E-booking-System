CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE PasswordResetToken (
    token_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_reset_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
);


CREATE TABLE EmailVerificationToken (
    token_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_verified_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
);


CREATE TABLE UserSession (
    session_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_session_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
);


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
    user_id INT NOT NULL,
    rating DECIMAL(2,1),
    review_text TEXT,

    CONSTRAINT fk_review_movie
        FOREIGN KEY (movie_id)
        REFERENCES Movie(movie_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
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


CREATE TABLE FavoriteMovie (
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id, movie_id),

    CONSTRAINT fk_favorite_movie
        FOREIGN KEY (movie_id)
        REFERENCES Movie(movie_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_favorite_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
);


CREATE TABLE PaymentCard (
    card_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    cardholder_name VARCHAR(100) NOT NULL,
    card_number VARCHAR(255) NOT NULL,
    expiration_month INT NOT NULL,
    expiration_year INT NOT NULL,
    cvv VARCHAR(255) NOT NULL,
    billing_zip VARCHAR(10),
    created TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_payment_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
);
