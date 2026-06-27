

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
 'Interstellar',
 5,
 'Christopher Nolan',
 'Emma Thomas',
 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
 'A group of astronauts travels through a wormhole to search for a new home for humanity.',
 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_.jpg',
 'http://youtube.com/watch?v=Lm8p5rlrSkY',
 'PG-13',
 '2014-11-07',
 'Ended'
),

(
 'The Dark Knight',
 1,
 'Christopher Nolan',
 'Emma Thomas',
 'Christian Bale, Heath Ledger, Michael Caine',
 'Batman faces the Joker, a criminal mastermind who pushes Gotham into chaos.',
 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg',
 'https://www.youtube.com/watch?v=oz7wymKGzOU',
 'PG-13',
 '2008-07-18',
 'Ended'
),

(
 'Inception',
 5,
 'Christopher Nolan',
 'Emma Thomas',
 'Leonardo DiCaprio, Joseph Gordon-Levitt, Tom Hardy',
 'A thief who steals secrets through dreams is given a chance to erase his past.',
 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg',
 'https://www.youtube.com/watch?v=YoHD9XEInc0',
 'PG-13',
 '2010-07-16',
 'Ended'
),


(
 'Toy Story',
 6,
 'John Lasseter',
 'Ralph Guggenheim',
 'Tom Hanks, Tim Allen, Annie Potts',
 'A group of toys come to life when humans are not around.',
 'https://upload.wikimedia.org/wikipedia/en/1/13/Toy_Story.jpg',
 'https://www.youtube.com/watch?v=v-PjgYDrg70',
 'G',
 '1995-11-22',
 'Ended'
),

(
 'Spider-Man: No Way Home',
 1,
 'Jon Watts',
 'Kevin Feige',
 'Tom Holland, Zendaya, Benedict Cumberbatch',
 'Spider-Man faces villains from across the multiverse after his identity is revealed.',
 'https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg',
 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
 'PG-13',
 '2021-12-17',
 'Ended'
),

(
 'The Super Mario Bros. Movie',
 6,
 'Aaron Horvath',
 'Chris Meledandri',
 'Chris Pratt, Anya Taylor-Joy, Jack Black',
 'Two brothers are transported to the Mushroom Kingdom and must save it.',
 'https://upload.wikimedia.org/wikipedia/en/4/44/The_Super_Mario_Bros._Movie_poster.jpg',
 'https://www.youtube.com/watch?v=TnGl01FkMMo',
 'PG',
 '2023-04-05',
 'Ended'
),

(
 'A Quiet Place',
 4,
 'John Krasinski',
 'Michael Bay',
 'Emily Blunt, John Krasinski',
 'A family must survive while avoiding creatures that hunt by sound.',
 'https://upload.wikimedia.org/wikipedia/en/a/a0/A_Quiet_Place_film_poster.png',
 'https://www.youtube.com/watch?v=WR7cc5t7tv8',
 'PG-13',
 '2018-04-06',
 'Ended'
),

(
 'Dune: Part Two',
 5,
 'Denis Villeneuve',
 'Mary Parent',
 'Timothée Chalamet, Zendaya, Rebecca Ferguson',
 'Paul Atreides joins the Fremen while preparing for a war over Arrakis.',
 'https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpeg',
 'https://www.youtube.com/watch?v=Way9Dexny3w',
 'PG-13',
 '2024-03-01',
 'Currently Running'
),

(
 'Deadpool & Wolverine',
 1,
 'Shawn Levy',
 'Kevin Feige',
 'Ryan Reynolds, Hugh Jackman',
 'Two unlikely heroes team up for a dangerous multiverse mission.',
 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Deadpool_%26_Wolverine_poster.jpg/220px-Deadpool_%26_Wolverine_poster.jpg',
 'https://www.youtube.com/watch?v=73_1biulkYk',
 'R',
 '2024-07-26',
 'Currently Running'
),

(
 'Inside Out 2',
 6,
 'Kelsey Mann',
 'Mark Nielsen',
 'Amy Poehler, Maya Hawke, Ayo Edebiri',
 'A teenage girl experiences new emotions as she grows up.',
 'https://upload.wikimedia.org/wikipedia/en/f/f7/Inside_Out_2_poster.jpg',
 'https://www.youtube.com/watch?v=LEjhY15eCx0',
 'PG',
 '2024-06-14',
 'Currently Running'
);




INSERT INTO Review
(movie_id, reviewer_name, rating, review_text)
VALUES

(1, 'James', 5.0, 'One of the best science fiction movies ever made.'),
(2, 'Alex', 4.8, 'Great performances and an incredible villain.'),
(3, 'Maria', 4.7, 'A creative and complex story.'),
(4, 'David', 4.5, 'A classic animated movie.'),
(7, 'Chris', 4.3, 'Very suspenseful and well made.'),
(8, 'Emily', 4.9, 'Amazing visuals and world building.');



INSERT INTO Showtime
(movie_id, show_date, show_time, hall_number)
VALUES

(8, '2026-07-01', '14:00:00', 1),
(8, '2026-07-01', '19:30:00', 2),

(9, '2026-07-01', '16:00:00', 3),
(9, '2026-07-02', '20:15:00', 1),

(10, '2026-07-01', '15:30:00', 2),
(10, '2026-07-03', '18:45:00', 3),

(2, '2026-07-02', '21:00:00', 1),

(1, '2026-07-03', '19:00:00', 2);