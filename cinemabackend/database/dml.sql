INSERT INTO Genre (genre_name)
VALUES
('Action'),
('Comedy'),
('Drama'),
('Horror'),
('Science Fiction'),
('Animation'),
('Adventure');


INSERT INTO Movie
(
    movie_title,
    genre_id,
    director,
    producer,
    cast_members,
    synopsis,
    trailer_image,
    trailer_video,
    mpaa_rating,
    release_date,
    status
)
VALUES
(
    'Toy Story FIVE',
    6,
    'Andrew Stanton',
    'Pixar Animation Studios',
    'Tom Hanks, Tim Allen, Greta Lee',
    'The toys return for a new adventure as technology changes playtime.',
    'https://upload.wikimedia.org/wikipedia/en/1/13/Toy_Story.jpg',
    'https://www.youtube.com/embed/v-PjgYDrg70',
    'PG',
    '2026-06-19',
    'Currently Running'
),
(
    'The Death of Robin Hood',
    7,
    'Michael Sarnoski',
    'A24',
    'Hugh Jackman, Jodie Comer, Bill Skarsgard',
    'Robin Hood faces his past after a life of crime and battle.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtVu8pkhXxVwzcANXqEV6sni6bttQMDtRdHjIvNWnvWmzY9TpdD2EB-akCmuanNluHm9Rm&s=10',
    'https://www.youtube.com/embed/zwPn9ZnbCo0',
    'R',
    '2026-06-19',
    'Currently Running'
),
(
    'Supergirl',
    1,
    'Craig Gillespie',
    'DC Studios',
    'Milly Alcock, Matthias Schoenaerts, Eve Ridley',
    'Supergirl faces a dangerous journey across the galaxy.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvhrwjrm0h8DC-UFCCN63eU6iI57Gga7N3T69LhaPpdR2jiMmOHjhUAuqlRKqWykYK0fI4&s=10',
    'https://www.youtube.com/embed/uhUht6vAsMY',
    'PG-13',
    '2026-06-26',
    'Currently Running'
),
(
    'Jackass: Best and Last',
    2,
    'TBD',
    'Paramount Pictures',
    'Johnny Knoxville, Steve-O, Chris Pontius',
    'The Jackass crew returns for another round of wild stunts and comedy.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbYrNLfK_8u0-Yh5muli1fCVBOYZwsMcIphv5k8j74GDmgXQkiEpx776TKlorK9uWLH1-RCDDkhEQYV3jGUv0sBhvTW1fst81pbIoKt3g&s',
    'https://www.youtube.com/embed/FNq-QT2Jpng',
    'R',
    '2026-06-26',
    'Currently Running'
),
(
    'Disclosure Day',
    5,
    'Steven Spielberg',
    'Universal Pictures',
    'Josh O Connor, Eve Hewson, Emily Blunt, Colin Firth',
    'A science fiction story centered around a major world-changing discovery.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLhmAPwRryN9Lcr-RlV0Y4jY7q-1Zgs9Trd0Ni5zT9QBO8VNRCIpTuMExko19KAbMGX97T&s=10',
    'https://www.youtube.com/embed/TcMBFSGVi1c',
    'PG-13',
    '2026-06-12',
    'Currently Running'
),
(
    'Minions & Monsters',
    6,
    'TBD',
    'Universal Pictures',
    'TBD',
    'A new animated adventure from the world of Minions.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDMajmWqWp9L7uOGjGnN_AO-5zZVzerdqCKH0F3zHV63xkDhL20ze6pPaX9PNvre-4n-WBdw&s=10',
    'https://www.youtube.com/embed/qQlr9-rF32A',
    'PG',
    '2026-07-01',
    'Coming Soon'
),
(
    'Young Washington',
    3,
    'TBD',
    'Angel Studios',
    'TBD',
    'A historical drama about the early life of George Washington.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnRonnlZ_44WMfOkzCM7-b5xMf7i-wGCYNLZW6nwt7Rktyqleruu35MTtBwqBJOoAYv3c0&s=10',
    'https://www.youtube.com/embed/TcMBFSGVi1c',
    'PG-13',
    '2026-07-03',
    'Coming Soon'
),
(
    'Moana',
    7,
    'Thomas Kail',
    'Disney',
    'Catherine Laga''aia, Dwayne Johnson',
    'A live-action retelling of Moana''s ocean adventure.',
    'https://upload.wikimedia.org/wikipedia/en/2/26/Moana_Teaser_Poster.jpg',
    'https://www.youtube.com/embed/LKFuXETZUsI',
    'PG',
    '2026-07-10',
    'Coming Soon'
),
(
    'Evil Dead Burn',
    4,
    'Sébastien Vaniček',
    'Warner Bros.',
    'TBD',
    'A new terrifying chapter in the Evil Dead horror franchise.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEM1El_x90LqgO0_YG2acsJCJVjFNHnD2D2JsqSeyb7_cNanE8CvoYin86Ze_FH9o4oNi4&s=10',
    'https://www.youtube.com/embed/BqQNO7BzN08',
    'R',
    '2026-07-10',
    'Coming Soon'
),
(
    'The Odyssey',
    7,
    'Christopher Nolan',
    'Universal Pictures',
    'Matt Damon, Tom Holland, Zendaya',
    'A mythic action epic based on Homer''s legendary journey.',
    'https://www.movieposters.com/cdn/shop/files/odyssey_ver2_1024x1024.jpg?v=1767639159',
    'https://www.youtube.com/embed/TcMBFSGVi1c',
    'R',
    '2026-07-17',
    'Coming Soon'
);


INSERT INTO Users
(
    email,
    user_name,
    first_name,
    last_name,
    phone_number,
    street_address,
    password,
    is_admin,
    is_active
)
VALUES
(
    'james@example.com',
    'james',
    'James',
    'Reviewer',
    '7705550101',
    '123 Main Street',
    'temporary-password',
    FALSE,
    TRUE
),
(
    'alex@example.com',
    'alex',
    'Alex',
    'Reviewer',
    '7705550102',
    '456 Oak Avenue',
    'temporary-password',
    FALSE,
    TRUE
),
(
    'emily@example.com',
    'emily',
    'Emily',
    'Reviewer',
    '7705550103',
    '789 Pine Road',
    'temporary-password',
    FALSE,
    TRUE
),
(
    'chris@example.com',
    'chris',
    'Chris',
    'Reviewer',
    '7705550104',
    '321 Maple Drive',
    'temporary-password',
    FALSE,
    TRUE
),
(
    'maria@example.com',
    'maria',
    'Maria',
    'Reviewer',
    '7705550105',
    '654 Cedar Lane',
    'temporary-password',
    FALSE,
    TRUE
);


INSERT INTO Review
(
    movie_id,
    user_id,
    rating,
    review_text
)
VALUES
(1, 1, 4.8, 'A fun animated movie for all ages.'),
(2, 2, 4.4, 'A darker adventure story with strong performances.'),
(3, 3, 4.5, 'Exciting superhero action.'),
(4, 4, 4.2, 'Funny and chaotic.'),
(5, 5, 4.6, 'A strong science fiction story.');


INSERT INTO Hall
(
    hall_number,
    total_seats
)
VALUES
(1, 100),
(2, 100),
(3, 100);


INSERT INTO Showtime
(
    movie_id,
    hall_id,
    show_date,
    show_time
)
VALUES
(1, 1, '2026-07-01', '14:00:00'),
(1, 2, '2026-07-01', '19:30:00'),
(2, 3, '2026-07-01', '16:00:00'),
(2, 1, '2026-07-02', '20:15:00'),
(3, 2, '2026-07-01', '15:30:00'),
(3, 3, '2026-07-03', '18:45:00'),
(4, 1, '2026-07-02', '13:00:00'),
(4, 2, '2026-07-02', '17:30:00'),
(5, 3, '2026-07-03', '18:00:00'),
(5, 1, '2026-07-03', '21:00:00'),
(1, 2, '2026-07-03', '19:00:00'),
(6, 1, '2026-07-04', '14:00:00'),
(6, 2, '2026-07-04', '19:30:00'),
(7, 3, '2026-07-05', '16:00:00'),
(7, 1, '2026-07-05', '20:15:00'),
(8, 2, '2026-07-06', '15:30:00'),
(8, 3, '2026-07-06', '18:45:00'),
(9, 1, '2026-07-07', '13:00:00'),
(9, 2, '2026-07-07', '17:30:00'),
(10, 3, '2026-07-08', '18:00:00'),
(10, 1, '2026-07-08', '21:00:00');


INSERT INTO TicketPrice
(
    ticket_type,
    price
)
VALUES
('Adult', 12.00),
('Senior', 9.00),
('Child', 8.00);


INSERT INTO BookingFee
(
    fee_amount
)
VALUES
(2.50);
