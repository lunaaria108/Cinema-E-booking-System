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
(movie_title, genre_id, director, producer, cast_members, synopsis,
 trailer_image, trailer_video, mpaa_rating, release_date, status)
VALUES
(
 'Toy Story 5',
 6,
 'Andrew Stanton',
 'Pixar Animation Studios',
 'Tom Hanks, Tim Allen, Greta Lee',
 'The toys return for a new adventure as technology changes playtime.',
 'https://dummyimage.com/300x450/cccccc/000000&text=Toy+Story+5',
 'https://www.youtube.com/watch?v=v-PjgYDrg70',
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
 'https://dummyimage.com/300x450/cccccc/000000&text=Death+of+Robin+Hood',
 'https://www.youtube.com/watch?v=zwPn9ZnbCo0',
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
 'https://dummyimage.com/300x450/cccccc/000000&text=Supergirl',
 'https://www.youtube.com/watch?v=uhUht6vAsMY',
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
 'https://dummyimage.com/300x450/cccccc/000000&text=Jackass',
 'https://www.youtube.com/watch?v=FNq-QT2Jpng',
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
 'https://dummyimage.com/300x450/cccccc/000000&text=Disclosure+Day',
 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
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
 'https://dummyimage.com/300x450/cccccc/000000&text=Minions+%26+Monsters',
 'https://www.youtube.com/watch?v=qQlr9-rF32A',
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
 'https://dummyimage.com/300x450/cccccc/000000&text=Young+Washington',
 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
 'PG-13',
 '2026-07-03',
 'Coming Soon'
),
(
 'Moana',
 7,
 'Thomas Kail',
 'Disney',
 'Catherine Lagaaia, Dwayne Johnson',
 'A live-action retelling of Moana’s ocean adventure.',
 'https://dummyimage.com/300x450/cccccc/000000&text=Moana',
 'https://www.youtube.com/watch?v=LKFuXETZUsI',
 'PG',
 '2026-07-10',
 'Coming Soon'
),
(
 'Evil Dead Burn',
 4,
 'Sebastien Vanicek',
 'Warner Bros.',
 'TBD',
 'A new terrifying chapter in the Evil Dead horror franchise.',
 'https://dummyimage.com/300x450/cccccc/000000&text=Evil+Dead+Burn',
 'https://www.youtube.com/watch?v=BqQNO7BzN08',
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
 'A mythic action epic based on Homer’s legendary journey.',
 'https://dummyimage.com/300x450/cccccc/000000&text=The+Odyssey',
 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
 'R',
 '2026-07-17',
 'Coming Soon'
);

INSERT INTO Review
(movie_id, reviewer_name, rating, review_text)
VALUES
(1, 'James', 4.8, 'A fun animated movie for all ages.'),
(2, 'Alex', 4.4, 'A darker adventure story with strong performances.'),
(3, 'Emily', 4.5, 'Exciting superhero action.'),
(4, 'Chris', 4.2, 'Funny and chaotic.'),
(5, 'Maria', 4.6, 'A strong science fiction story.');

INSERT INTO Showtime
(movie_id, show_date, show_time, hall_number)
VALUES
(1, '2026-07-01', '14:00:00', 1),
(1, '2026-07-01', '19:30:00', 2),
(2, '2026-07-01', '16:00:00', 3),
(2, '2026-07-02', '20:15:00', 1),
(3, '2026-07-01', '15:30:00', 2),
(3, '2026-07-03', '18:45:00', 3),
(4, '2026-07-02', '13:00:00', 1),
(4, '2026-07-02', '17:30:00', 2),
(5, '2026-07-03', '18:00:00', 3),
(5, '2026-07-03', '21:00:00', 1),
(6, '2026-07-04', '14:00:00', 1),
(6, '2026-07-04', '19:30:00', 2),
(7, '2026-07-05', '16:00:00', 3),
(7, '2026-07-05', '20:15:00', 1),
(8, '2026-07-06', '15:30:00', 2),
(8, '2026-07-06', '18:45:00', 3),
(9, '2026-07-07', '13:00:00', 1),
(9, '2026-07-07', '17:30:00', 2),
(10, '2026-07-08', '18:00:00', 3),
(10, '2026-07-08', '21:00:00', 1);
