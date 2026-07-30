import './MovieModal.css';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { loadAuthState } from "../utils/authStorage";
import AlertModal from "./AlertModal";

function MovieModal({ movie, onClose }) {
  const navigate = useNavigate();
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const auth = loadAuthState();
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const showDates = [
    ...new Set(
      (movie.showtimes || []).map((showtime) => showtime.showDate)
    ),
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <div className="modal-top">
          {movie.trailerImage ? (
            <img className="modal-poster" src={movie.trailerImage} alt={`${movie.movieTitle} poster`} />
          ) : (
            <div className="modal-poster placeholder">Poster</div>
          )}
          <div className="modal-details">
            <h2>{movie.movieTitle}</h2>
            <p className="modal-rating">Rating: {movie.mpaaRating}</p>
            <p className="modal-description">{movie.synopsis}</p>
          </div>
        </div>

        <div className="flex flex-col items-center m-6 gap-4">
          <h3>Trailer</h3>
          <iframe
            className="aspect-video w-full max-w-3xl rounded-lg"
            src={movie.trailerVideo}
            title={`${movie.movieTitle} trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="showtimes-section">
          <h3>Show Dates</h3>

          <div className="showtimes">
            {showDates.map((date) => (
              <button
                key={date}
                type="button"
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedShowtime(null);
                }}
                className={`showtime-btn ${
                  selectedDate === date ? "selected" : ""
                }`}
              >
                {new Date(`${date}T00:00:00`).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  }
                )}
              </button>
            ))}
          </div>

          {selectedDate && (
            <>
              <h3 className="mt-6">Show Times</h3>

              <div className="showtimes">
                {movie.showtimes
                  ?.filter(
                    (showtime) =>
                      showtime.showDate === selectedDate
                  )
                  .map((showtime) => (
                    <button
                      key={showtime.showtimeId}
                      type="button"
                      onClick={() =>
                        setSelectedShowtime(showtime)
                      }
                      className={`showtime-btn ${
                        selectedShowtime?.showtimeId ===
                        showtime.showtimeId
                          ? "selected"
                          : ""
                      }`}
                    >
                      {new Date(
                        `${showtime.showDate}T${showtime.showTime}`
                      ).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </button>
                  ))}
              </div>
            </>
          )}
        </div>

       <button className="book-btn" onClick={() => {
          if (!selectedShowtime) {
              setAlertMessage("Please select a showtime before booking.");
              return;
          }

          navigate("/booking", {
              state: {
                  movie,
                  selectedShowtime,
              },
          });
      }}>
        Book Now
      </button>
      </div>

      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={() => setAlertMessage("")}
        />
      )}
    </div>
  );
}

export default MovieModal;