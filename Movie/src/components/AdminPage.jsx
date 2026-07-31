import { useEffect, useMemo, useState } from "react";
import NavBar from "./NavBar";
import { clearAuthState, loadAuthState } from "../utils/authStorage";
import { useNavigate } from "react-router-dom";
import AdminPromotions from "./AdminPromotions";
import ManagePromotions from "./ManagePromotions";

export default function AdminPage() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState("users");
  const [activeSection, setActiveSection] = useState("manage-users");
  const [auth, setAuth] = useState(() => loadAuthState());

  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [isLoadingAdminData, setIsLoadingAdminData] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");
  const [adminError, setAdminError] = useState("");

  const [movieForm, setMovieForm] = useState({
    movieTitle: "",
    genreId: "",
    director: "",
    producer: "",
    castMembers: "",
    synopsis: "",
    trailerImage: "",
    trailerVideo: "",
    mpaaRating: "PG-13",
    releaseDate: "",
    status: "Coming Soon",
  });

  const [showtimeForm, setShowtimeForm] = useState({
    movieId: "",
    hallNumber: "",
    showDate: "",
    showTime: "",
  });

  const isLoggedIn = Boolean(auth.token && auth.userId);
  const isAdmin = Boolean(auth.user?.isAdmin);

  const canManageCatalog = isLoggedIn && isAdmin;

  const sortedMovies = useMemo(() => {
    return [...movies].sort((leftMovie, rightMovie) => {
      const leftTitle = (leftMovie?.movieTitle || "").toLowerCase();
      const rightTitle = (rightMovie?.movieTitle || "").toLowerCase();
      return leftTitle.localeCompare(rightTitle);
    });
  }, [movies]);

  const fetchJsonWithMessage = async (url, options = {}) => {
    const response = await fetch(url, options);
    const responseText = await response.text();

    let responseData = null;

    if (responseText) {
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { message: responseText };
      }
    }

    if (!response.ok) {
      throw new Error(
        responseData?.message ||
          `Request failed with status ${response.status}`
      );
    }

    return responseData;
  };

  const loadAdminData = async () => {
    if (!canManageCatalog) {
      return;
    }

    try {
      setIsLoadingAdminData(true);
      setAdminError("");

      const [genreData, movieData, showtimeData] = await Promise.all([
        fetchJsonWithMessage("http://localhost:8080/api/admin/genres", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }),
        fetchJsonWithMessage("http://localhost:8080/api/admin/movies", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }),
        fetchJsonWithMessage("http://localhost:8080/api/admin/showtimes", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }),
      ]);

      setGenres(Array.isArray(genreData) ? genreData : []);
      setMovies(Array.isArray(movieData) ? movieData : []);
      setShowtimes(Array.isArray(showtimeData) ? showtimeData : []);
    } catch (error) {
      setAdminError(
        error.message || "Unable to load admin catalog data."
      );
    } finally {
      setIsLoadingAdminData(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [canManageCatalog, auth.token]);
  
  const handleLogout = async () => {
      if (!auth.token) {
        clearAuthState();
        setAuth(loadAuthState());
        return;
      }
  
      try {
        await fetch('http://localhost:8080/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: auth.token }),
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      } finally {
        clearAuthState();
        setAuth(loadAuthState());
      }
    };

  const handleBrowseMovies = () => {
    navigate("/");
  };

  const handleMovieFieldChange = (event) => {
    const { name, value } = event.target;
    setMovieForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleShowtimeFieldChange = (event) => {
    const { name, value } = event.target;
    setShowtimeForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleCreateMovie = async (event) => {
    event.preventDefault();

    if (!canManageCatalog) {
      return;
    }

    try {
      setAdminMessage("");
      setAdminError("");

      const payload = {
        movieTitle: movieForm.movieTitle.trim(),
        genreId: Number(movieForm.genreId),
        director: movieForm.director.trim(),
        producer: movieForm.producer.trim(),
        castMembers: movieForm.castMembers.trim(),
        synopsis: movieForm.synopsis.trim(),
        trailerImage: movieForm.trailerImage.trim(),
        trailerVideo: movieForm.trailerVideo.trim(),
        mpaaRating: movieForm.mpaaRating.trim(),
        releaseDate: movieForm.releaseDate || null,
        status: movieForm.status,
      };

      const createdMovie = await fetchJsonWithMessage(
        "http://localhost:8080/api/admin/movies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      setMovies((currentMovies) => [...currentMovies, createdMovie]);

      setMovieForm({
        movieTitle: "",
        genreId: "",
        director: "",
        producer: "",
        castMembers: "",
        synopsis: "",
        trailerImage: "",
        trailerVideo: "",
        mpaaRating: "PG-13",
        releaseDate: "",
        status: "Coming Soon",
      });

      setShowtimeForm((currentForm) => ({
        ...currentForm,
        movieId:
          createdMovie?.movieId
            ? String(createdMovie.movieId)
            : currentForm.movieId,
      }));

      setAdminMessage("Movie created successfully.");
    } catch (error) {
      setAdminError(error.message || "Unable to create movie.");
    }
  };

  const handleScheduleShowtime = async (event) => {
    event.preventDefault();

    if (!canManageCatalog) {
      return;
    }

    try {
      setAdminMessage("");
      setAdminError("");

      const payload = {
        movieId: Number(showtimeForm.movieId),
        hallNumber: Number(showtimeForm.hallNumber),
        showDate: showtimeForm.showDate,
        showTime:
          showtimeForm.showTime && showtimeForm.showTime.length === 5
            ? `${showtimeForm.showTime}:00`
            : showtimeForm.showTime,
      };

      await fetchJsonWithMessage(
        "http://localhost:8080/api/admin/showtimes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      await loadAdminData();

      setShowtimeForm({
        movieId: "",
        hallNumber: "",
        showDate: "",
        showTime: "",
      });

      setAdminMessage("Showtime scheduled successfully.");
    } catch (error) {
      setAdminError(error.message || "Unable to schedule showtime.");
    }
  };

  const menuItems = [
    {
      id: "users",
      label: "Users",
      options: [
        { id: "manage-users", label: "Manage Users" },
        { id: "add-user", label: "Add User" },
        { id: "delete-user", label: "Delete User" },
      ],
    },
    {
      id: "admins",
      label: "Admins",
      options: [
        { id: "manage-admins", label: "Manage Admins" },
        { id: "add-admin", label: "Add Admin" },
        { id: "delete-admin", label: "Delete Admin" },
      ],
    },
    {
      id: "movies",
      label: "Movies",
      options: [
        { id: "manage-movies", label: "Manage Movies" },
        { id: "add-movie", label: "Add Movie" },
        { id: "schedule-showtime", label: "Schedule Showtime" },
        { id: "delete-movie", label: "Delete Movie" },
      ],
    },
    {
      id: "promotions",
      label: "Promotions",
      options: [
        {
          id: "manage-promotions",
          label: "Manage Promotions",
        },
        {
          id: "add-promotion",
          label: "Add Promotion",
        },
      ],
    },
  ];

  const handleMenuClick = (menuId) => {
    setOpenMenu((currentMenu) =>
      currentMenu === menuId ? null : menuId
    );
  };

  const handleOptionClick = (menuId, optionId) => {
    setOpenMenu(menuId);
    setActiveSection(optionId);
  };

  const selectedHallNumber = Number(showtimeForm.hallNumber);

  const normalizedShowTime =
    showtimeForm.showTime && showtimeForm.showTime.length === 5
      ? `${showtimeForm.showTime}:00`
      : showtimeForm.showTime;

  const conflictingShowtime = showtimes.find((showtime) => {
    return (
      Number(showtime.hallNumber) === selectedHallNumber &&
      showtime.showDate === showtimeForm.showDate &&
      showtime.showTime === normalizedShowTime
    );
  });

  const sameDayReservations = showtimes.filter((showtime) => {
    if (!showtimeForm.showDate) {
      return true;
    }

    return showtime.showDate === showtimeForm.showDate;
  });

  const renderSection = () => {
    switch (activeSection) {
      case "manage-users":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Manage Users
            </h1>

            <p className="mt-4 text-gray-300">
              View, activate, suspend, or remove customer accounts.
            </p>
          </div>
        );

      case "add-user":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Add User
            </h1>

            <p className="mt-4 text-gray-300">
              Create a new customer account.
            </p>
          </div>
        );

      case "delete-user":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Delete User
            </h1>

            <p className="mt-4 text-gray-300">
              Search for and remove a customer account.
            </p>
          </div>
        );

      case "manage-admins":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Manage Admins
            </h1>

            <p className="mt-4 text-gray-300">
              View and manage administrator accounts.
            </p>
          </div>
        );

      case "add-admin":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Add Admin
            </h1>

            <p className="mt-4 text-gray-300">
              Create a new administrator account.
            </p>
          </div>
        );

      case "delete-admin":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Delete Admin
            </h1>

            <p className="mt-4 text-gray-300">
              Remove an administrator account.
            </p>
          </div>
        );

      case "manage-movies":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Manage Movies
            </h1>

            <p className="mt-4 text-gray-300">
              View and edit movie information and showtimes.
            </p>

            <div className="mt-6 rounded border border-[#2a2a2a] bg-[#0f0f0f] p-4">
              <h2 className="text-xl font-semibold text-[#D4AF37]">
                Current Catalog
              </h2>

              {isLoadingAdminData && (
                <p className="mt-3 text-gray-300">Loading catalog...</p>
              )}

              {!isLoadingAdminData && sortedMovies.length === 0 && (
                <p className="mt-3 text-gray-300">No movies found.</p>
              )}

              {!isLoadingAdminData && sortedMovies.length > 0 && (
                <ul className="mt-3 space-y-2 text-gray-200">
                  {sortedMovies.map((movie) => (
                    <li key={movie.movieId}>
                      {movie.movieTitle} ({movie.status})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );

      case "add-movie":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Add Movie
            </h1>

            <p className="mt-4 text-gray-300">
              Add a new movie to the cinema catalog.
            </p>

            <form
              onSubmit={handleCreateMovie}
              className="mt-6 grid gap-4 rounded border border-[#2a2a2a] bg-[#0f0f0f] p-5"
            >
              <input
                name="movieTitle"
                value={movieForm.movieTitle}
                onChange={handleMovieFieldChange}
                placeholder="Movie Title"
                className="rounded bg-[#1a1a1a] p-3 text-white"
                required
              />

              <select
                name="genreId"
                value={movieForm.genreId}
                onChange={handleMovieFieldChange}
                className="rounded bg-[#1a1a1a] p-3 text-white"
                required
              >
                <option value="">Select Genre</option>
                {genres.map((genre) => (
                  <option key={genre.genreId} value={genre.genreId}>
                    {genre.genreName}
                  </option>
                ))}
              </select>

              <input
                name="director"
                value={movieForm.director}
                onChange={handleMovieFieldChange}
                placeholder="Director"
                className="rounded bg-[#1a1a1a] p-3 text-white"
              />

              <input
                name="producer"
                value={movieForm.producer}
                onChange={handleMovieFieldChange}
                placeholder="Producer"
                className="rounded bg-[#1a1a1a] p-3 text-white"
              />

              <textarea
                name="castMembers"
                value={movieForm.castMembers}
                onChange={handleMovieFieldChange}
                placeholder="Cast Members"
                className="rounded bg-[#1a1a1a] p-3 text-white"
                rows={2}
              />

              <textarea
                name="synopsis"
                value={movieForm.synopsis}
                onChange={handleMovieFieldChange}
                placeholder="Synopsis"
                className="rounded bg-[#1a1a1a] p-3 text-white"
                rows={4}
              />

              <input
                name="trailerImage"
                value={movieForm.trailerImage}
                onChange={handleMovieFieldChange}
                placeholder="Poster URL"
                className="rounded bg-[#1a1a1a] p-3 text-white"
              />

              <input
                name="trailerVideo"
                value={movieForm.trailerVideo}
                onChange={handleMovieFieldChange}
                placeholder="Trailer URL"
                className="rounded bg-[#1a1a1a] p-3 text-white"
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <input
                  name="mpaaRating"
                  value={movieForm.mpaaRating}
                  onChange={handleMovieFieldChange}
                  placeholder="MPAA Rating"
                  className="rounded bg-[#1a1a1a] p-3 text-white"
                  required
                />

                <input
                  type="date"
                  name="releaseDate"
                  value={movieForm.releaseDate}
                  onChange={handleMovieFieldChange}
                  className="rounded bg-[#1a1a1a] p-3 text-white"
                />

                <select
                  name="status"
                  value={movieForm.status}
                  onChange={handleMovieFieldChange}
                  className="rounded bg-[#1a1a1a] p-3 text-white"
                  required
                >
                  <option value="Currently Running">Currently Running</option>
                  <option value="Coming Soon">Coming Soon</option>
                  <option value="Ended">Ended</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-fit rounded bg-[#003D1A] px-5 py-2 text-[#D4AF37]"
                disabled={!canManageCatalog}
              >
                Create Movie
              </button>
            </form>
          </div>
        );

      case "schedule-showtime":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Schedule Showtime
            </h1>

            <p className="mt-4 text-gray-300">
              Assign a movie to a hall on a date and time.
            </p>

            <form
              onSubmit={handleScheduleShowtime}
              className="mt-6 grid gap-4 rounded border border-[#2a2a2a] bg-[#0f0f0f] p-5"
            >
              <select
                name="movieId"
                value={showtimeForm.movieId}
                onChange={handleShowtimeFieldChange}
                className="rounded bg-[#1a1a1a] p-3 text-white"
                required
              >
                <option value="">Select Movie</option>
                {sortedMovies.map((movie) => (
                  <option key={movie.movieId} value={movie.movieId}>
                    {movie.movieTitle}
                  </option>
                ))}
              </select>

              <input
                name="hallNumber"
                value={showtimeForm.hallNumber}
                onChange={handleShowtimeFieldChange}
                type="number"
                min="1"
                placeholder="Hall Number"
                className="rounded bg-[#1a1a1a] p-3 text-white"
                required
              />

              <input
                type="date"
                name="showDate"
                value={showtimeForm.showDate}
                onChange={handleShowtimeFieldChange}
                className="rounded bg-[#1a1a1a] p-3 text-white"
                required
              />

              <input
                type="time"
                name="showTime"
                value={showtimeForm.showTime}
                onChange={handleShowtimeFieldChange}
                className="rounded bg-[#1a1a1a] p-3 text-white"
                required
              />

              <button
                type="submit"
                className="w-fit rounded bg-[#003D1A] px-5 py-2 text-[#D4AF37]"
                disabled={!canManageCatalog || Boolean(conflictingShowtime)}
              >
                Schedule Showtime
              </button>

              {conflictingShowtime && (
                <p className="rounded border border-red-700 bg-red-950 p-3 text-red-200">
                  Hall {conflictingShowtime.hallNumber} is already reserved on {conflictingShowtime.showDate} at {conflictingShowtime.showTime} for {conflictingShowtime.movieTitle}.
                </p>
              )}
            </form>

            <div className="mt-6 rounded border border-[#2a2a2a] bg-[#0f0f0f] p-5">
              <h2 className="text-xl font-semibold text-[#D4AF37]">
                Existing Hall Reservations
              </h2>

              {sameDayReservations.length === 0 && (
                <p className="mt-3 text-gray-300">
                  No reservations found for the selected date.
                </p>
              )}

              {sameDayReservations.length > 0 && (
                <ul className="mt-3 space-y-2 text-gray-200">
                  {sameDayReservations.map((showtime) => (
                    <li
                      key={showtime.showtimeId}
                      className="rounded border border-[#1f1f1f] bg-[#141414] p-3"
                    >
                      Hall {showtime.hallNumber} | {showtime.showDate} {showtime.showTime} | {showtime.movieTitle}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );

      case "delete-movie":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Delete Movie
            </h1>

            <p className="mt-4 text-gray-300">
              Remove a movie from the cinema catalog.
            </p>
          </div>
        );

      case "manage-promotions":
  return <ManagePromotions />;

  case "add-promotion":
  return <AdminPromotions />;

      default:
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Admin Dashboard
            </h1>
          </div>
        );
    }
  };

  if (!auth.userId) {
          return (
            <div className="min-h-screen bg-[#0b0b0b] text-white">
                <NavBar
                    isLoggedIn={Boolean(auth.token)}
                    onLogout={handleLogout}
                    isSignUpPage={true}
                />
  
                <div className="p-8 text-center">
                    <p>You must be logged in to view admin pages.</p>
                </div>
            </div>
        );
    }

  if (auth.userId && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white">
        <NavBar
          isLoggedIn={Boolean(auth.token)}
          onLogout={handleLogout}
          isSignUpPage={true}
          isProfilePage={true}
        />

        <div className="p-8 text-center">
          <p>Administrator access is required for this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <NavBar booking={true} onBrowseMovies={handleBrowseMovies} isLoggedIn={Boolean(auth.token)} onLogout={handleLogout} isProfilePage={true} isSignUpPage={true}/>

      <div className="flex min-h-[calc(100vh-96px)] w-full overflow-hidden">
        <aside className="w-64 h-[calc(100vh-96px)] shrink-0 bg-black">
          <h2 className="border-b border-[#003D1A] px-6 py-6 text-2xl font-bold text-white">
            Admin Panel
          </h2>

          <nav className="w-64 flex flex-col border-0">
            {menuItems.map((menu) => {
              const isOpen = openMenu === menu.id;

              const containsSelectedOption = menu.options.some(
                (option) => option.id === activeSection
              );

              return (
                <div
                  key={menu.id}
                  className="w-64 border-b border-[#161616]"
                >
                  <button
                    type="button"
                    onClick={() => handleMenuClick(menu.id)}
                    className={`flex w-64 items-center justify-between px-6 py-4 text-left text-lg transition-colors box-border ${
                    isOpen
                        ? "bg-[#003D1A] text-[#D4AF37]"
                        : "text-white hover:bg-[#121212] hover:text-[#D4AF37]"
                    }`}
                  >
                    <span>{menu.label}</span>

                    <span className="text-sm">
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="w-64 bg-[#090909]">
                      {menu.options.map((option) => {
                        const isSelected = activeSection === option.id;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                            setActiveSection(option.id);
                            setOpenMenu(menu.id);
                            }}
                            className={`block w-64 border-l-4 px-10 py-3 text-left box-border transition-colors ${
                              isSelected
                                ? "border-[#D4AF37] bg-[#123d25] text-[#D4AF37]"
                                : "border-transparent text-gray-300 hover:bg-[#121212] hover:text-white"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-x-hidden">
          <div className="m-8 min-h-[calc(100%-4rem)] rounded-xl border border-[#003D1A] bg-[#121212] p-8">
            {adminError && (
              <p className="mb-4 rounded border border-red-700 bg-red-950 p-3 text-red-200">
                {adminError}
              </p>
            )}

            {adminMessage && (
              <p className="mb-4 rounded border border-green-700 bg-green-950 p-3 text-green-200">
                {adminMessage}
              </p>
            )}

            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
