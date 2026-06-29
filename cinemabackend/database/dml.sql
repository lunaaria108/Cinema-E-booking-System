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
 'Superman',
 1,
 'James Gunn',
 'Peter Safran',
 'David Corenswet, Rachel Brosnahan, Nicholas Hoult',
 'Superman balances his Kryptonian heritage with his human upbringing while facing new threats.',
 'https://upload.wikimedia.org/wikipedia/en/3/32/Superman_%282025_film%29_poster.jpg',
 'https://www.youtube.com/watch?v=uhUht6vAsMY',
 'PG-13',
 '2025-07-11',
 'Currently Running'
),
(
 'Jurassic World Rebirth',
 1,
 'Gareth Edwards',
 'Frank Marshall',
 'Scarlett Johansson, Mahershala Ali, Jonathan Bailey',
 'A new mission brings humans face to face with dangerous dinosaurs in a changed world.',
 'https://upload.wikimedia.org/wikipedia/en/a/a5/Jurassic_World_Rebirth_poster.jpg',
 'https://www.youtube.com/watch?v=jan5CFWs9ic',
 'PG-13',
 '2025-07-02',
 'Currently Running'
),
(
 'Avengers: Doomsday',
 1,
 'Anthony Russo, Joe Russo',
 'Kevin Feige',
 'Robert Downey Jr., Chris Hemsworth, Anthony Mackie',
 'The Avengers face a powerful new threat that could change the multiverse forever.',
 'https://upload.wikimedia.org/wikipedia/en/9/9f/Avengers_Doomsday_logo.jpg',
 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
 'PG-13',
 '2026-12-18',
 'Coming Soon'
),
(
 'Spider-Man: Brand New Day',
 1,
 'Destin Daniel Cretton',
 'Kevin Feige',
 'Tom Holland, Zendaya',
 'Peter Parker begins a new chapter as Spider-Man while facing new dangers.',
 'https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg',
 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
 'PG-13',
 '2026-07-31',
 'Coming Soon'
),
(
 'Shrek 5',
 6,
 'Walt Dohrn',
 'Gina Shay',
 'Mike Myers, Eddie Murphy, Cameron Diaz',
 'Shrek, Fiona, and Donkey return for a new animated adventure.',
 'https://upload.wikimedia.org/wikipedia/en/3/39/Shrek.jpg',
 'https://www.youtube.com/watch?v=CwXOrWvPBPk',
 'PG',
 '2026-12-23',
 'Coming Soon'
),
(
 'Frozen III',
 6,
 'Jennifer Lee',
 'Peter Del Vecho',
 'Kristen Bell, Idina Menzel, Josh Gad',
 'Anna, Elsa, Olaf, and their friends return for a new adventure.',
 'https://upload.wikimedia.org/wikipedia/en/0/05/Frozen_%282013_film%29_poster.jpg',
 'https://www.youtube.com/watch?v=TbQm5doF_Uc',
 'PG',
 '2027-11-24',
 'Coming Soon'
),
(
 'Zootopia 2',
 6,
 'Jared Bush',
 'Yvett Merino',
 'Ginnifer Goodwin, Jason Bateman',
 'Judy Hopps and Nick Wilde return for a new case in Zootopia.',
 'https://upload.wikimedia.org/wikipedia/en/e/ea/Zootopia.jpg',
 'https://www.youtube.com/watch?v=jWM0ct-OLsM',
 'PG',
 '2025-11-26',
 'Coming Soon'
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
(1, 'James', 4.7, 'Great action and a strong superhero story.'),
(2, 'Alex', 4.5, 'Exciting dinosaur action and visuals.'),
(8, 'Emily', 4.9, 'Amazing visuals and world building.'),
(9, 'Chris', 4.6, 'Funny, violent, and entertaining.'),
(10, 'Maria', 4.8, 'A great emotional sequel.');

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
