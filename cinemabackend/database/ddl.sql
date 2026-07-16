
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    promotion_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE password_reset_token (
    token_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_reset_user FOREIGN KEY (user_id)
        REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE email_verification_token (
    token_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_verified_user FOREIGN KEY (user_id)
        REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE user_session (
    session_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_session_user FOREIGN KEY (user_id)
        REFERENCES Users(user_id) ON DELETE CASCADE
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
    CONSTRAINT fk_payment_user FOREIGN KEY (user_id)
        REFERENCES Users(user_id) ON DELETE CASCADE
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
    CONSTRAINT fk_movie_genre FOREIGN KEY (genre_id)
        REFERENCES Genre(genre_id) ON DELETE RESTRICT
);

CREATE TABLE Review (
    review_id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL,
    user_id INT NOT NULL,
    rating DECIMAL(2,1),
    review_text TEXT,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_review_movie FOREIGN KEY (movie_id)
        REFERENCES Movie(movie_id) ON DELETE CASCADE,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id)
        REFERENCES Users(user_id) ON DELETE CASCADE
);


CREATE TABLE Hall (
    hall_id SERIAL PRIMARY KEY,
    hall_number INT NOT NULL UNIQUE,
    total_seats INT NOT NULL
);

CREATE TABLE Seat (
    seat_id SERIAL PRIMARY KEY,
    hall_id INT NOT NULL,
    row_label VARCHAR(5) NOT NULL,
    seat_number INT NOT NULL,
    CONSTRAINT fk_seat_hall FOREIGN KEY (hall_id)
        REFERENCES Hall(hall_id) ON DELETE CASCADE,
    CONSTRAINT uq_seat_position UNIQUE (hall_id, row_label, seat_number)
);


CREATE TABLE Showtime (
    showtime_id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL,
    hall_id INT NOT NULL,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    CONSTRAINT fk_showtime_movie FOREIGN KEY (movie_id)
        REFERENCES Movie(movie_id) ON DELETE CASCADE,
    CONSTRAINT fk_showtime_hall FOREIGN KEY (hall_id)
        REFERENCES Hall(hall_id) ON DELETE RESTRICT
);

=
CREATE TABLE TicketPrice (
    ticket_price_id SERIAL PRIMARY KEY,
    ticket_type VARCHAR(10) NOT NULL UNIQUE
        CHECK (ticket_type IN ('Adult', 'Senior', 'Child')),
    price DECIMAL(6,2) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE BookingFee (
    booking_fee_id SERIAL PRIMARY KEY,
    fee_amount DECIMAL(6,2) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE Promotion (
    promotion_id SERIAL PRIMARY KEY,
    promo_code VARCHAR(30) NOT NULL UNIQUE,
    discount_amount DECIMAL(6,2) NOT NULL,
    is_percentage BOOLEAN NOT NULL DEFAULT FALSE,
    expiration_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE Booking (
    booking_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    showtime_id INT NOT NULL,
    promotion_id INT,
    booking_date TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'Pending'
        CHECK (status IN ('Pending', 'Paid', 'Cancelled', 'Refunded')),
    total_price DECIMAL(8,2) NOT NULL,
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id)
        REFERENCES Users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_showtime FOREIGN KEY (showtime_id)
        REFERENCES Showtime(showtime_id) ON DELETE RESTRICT,
    CONSTRAINT fk_booking_promotion FOREIGN KEY (promotion_id)
        REFERENCES Promotion(promotion_id) ON DELETE SET NULL
);


CREATE TABLE Ticket (
    ticket_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    showtime_id INT NOT NULL,
    seat_id INT NOT NULL,
    ticket_type VARCHAR(10) NOT NULL
        CHECK (ticket_type IN ('Adult', 'Senior', 'Child')),
    price DECIMAL(6,2) NOT NULL,
    CONSTRAINT fk_ticket_booking FOREIGN KEY (booking_id)
        REFERENCES Booking(booking_id) ON DELETE CASCADE,
    CONSTRAINT fk_ticket_showtime FOREIGN KEY (showtime_id)
        REFERENCES Showtime(showtime_id) ON DELETE RESTRICT,
    CONSTRAINT fk_ticket_seat FOREIGN KEY (seat_id)
        REFERENCES Seat(seat_id) ON DELETE RESTRICT,
    CONSTRAINT uq_seat_per_showtime UNIQUE (showtime_id, seat_id)
);


CREATE TABLE Payment (
    payment_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL UNIQUE,
    card_id INT,
    payment_date TIMESTAMP NOT NULL DEFAULT NOW(),
    amount DECIMAL(8,2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'Pending'
        CHECK (payment_status IN ('Pending', 'Approved', 'Declined', 'Refunded')),
    payment_reference VARCHAR(255),
    CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id)
        REFERENCES Booking(booking_id) ON DELETE CASCADE,
    CONSTRAINT fk_payment_card FOREIGN KEY (card_id)
        REFERENCES PaymentCard(card_id) ON DELETE SET NULL
);


CREATE TABLE FavoriteMovie (
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, movie_id),
    CONSTRAINT fk_favorite_movie FOREIGN KEY (movie_id)
        REFERENCES Movie(movie_id) ON DELETE CASCADE,
    CONSTRAINT fk_favorite_user FOREIGN KEY (user_id)
        REFERENCES Users(user_id) ON DELETE CASCADE
);


CREATE TABLE UserPreference (
    preference_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    preferred_genre_id INT,
    preferred_mpaa_rating VARCHAR(10),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_pref_user FOREIGN KEY (user_id)
        REFERENCES Users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_pref_genre FOREIGN KEY (preferred_genre_id)
        REFERENCES Genre(genre_id) ON DELETE SET NULL
);
